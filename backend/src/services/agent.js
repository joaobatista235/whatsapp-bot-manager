import OpenAI from "openai";
import venom from "venom-bot";
import fs from "fs";

import AgentMetting from "../models/AgentMetting.js";

export default (db, gloogleService) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const threads = {};
  let pollingInterval;
  const activeSessions = new Map();
  const activeRuns = new Map();

  const createAgent = ({ body }) => {
    const { companyName, context, objective, communication, name, sector } =
      body;

    const agent = new AgentMetting(
      name,
      context,
      objective,
      communication,
      sector,
      companyName
    );

    return openai.beta.assistants
      .create({
        name: agent.name,
        instructions: agent.getGlobalContext(),
        model: "gpt-3.5-turbo",
        tools: [agent.getScheduleFunction()],
      })
      .then((assistant) => {
        return db.collection("agents").add({
          ...agent,
          assistantId: assistant.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: false,
        });
      });
  };

  const updateAgent = ({ body }) => {
    const {
      name,
      context,
      objective,
      communication,
      sector,
      companyName,
      agentId,
    } = body;

    return db
      .collection("agents")
      .doc(agentId)
      .get()
      .then((agentDoc) => {
        if (!agentDoc.exists) {
          throw new Error(`Agente com ID ${agentId} não encontrado.`);
        }

        const agentData = agentDoc.data();

        const updatedAgent = new AgentMetting(
          name || agentData.name,
          context || agentData.context,
          objective || agentData.objective,
          communication || agentData.communication,
          sector || agentData.sector,
          companyName || agentData.companyName
        );

        const openAiUpdatePromise =
          name || context
            ? openai.beta.assistants.update(agentData.assistantId, {
                name: updatedAgent.name,
                instructions: updatedAgent.getGlobalContext(),
              })
            : Promise.resolve();

        return openAiUpdatePromise.then(() =>
          db
            .collection("agents")
            .doc(agentId)
            .update({
              ...updatedAgent,
              updatedAt: new Date(),
            })
        );
      })
      .then(() => ({
        success: true,
        message: "Agente atualizado com sucesso.",
      }))
      .catch((error) => {
        console.error("Erro ao atualizar o agente:", error);
        throw error;
      });
  };

  const deleteAgent = ({ id }) => {
    if (!id) {
      throw new Error("O 'id' é obrigatório para deletar um agente.");
    }

    return db
      .collection("agents")
      .doc(id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw new Error("Agente não encontrado.");
        }

        const assistantId = doc.data().assistantId;
        if (!assistantId) {
          throw new Error("AssistantId não encontrado no agente.");
        }

        const batch = db.batch();
        batch.delete(doc.ref);

        return batch.commit().then(() => {
          return openai.beta.assistants.del(assistantId);
        });
      })
      .then(() => {
        console.log("Agente deletado com sucesso.");
        return { message: "Agente deletado com sucesso." };
      })
      .catch((error) => {
        console.error("Erro ao deletar o agente:", error);
        throw error;
      });
  };

  const startAgent = ({ id }) => {
    return new Promise((resolve, reject) => {
      const agentRef = db.collection("agents").doc(id);

      agentRef
        .get()
        .then((doc) => {
          if (!doc.exists) {
            reject("Agent not found");
            return;
          }

          const { assistantId } = doc.data();
          const sessionName = `session_${assistantId}`;

          if (activeSessions.has(sessionName)) {
            resolve(`Session ${sessionName} is already active`);
            return;
          }

          venom
            .create({
              session: sessionName,
              catchQR: (qrCode, asciiQR, attempts, urlCode) => {
                console.log("QR Code gerado: ", qrCode);
                console.log("Attempts: ", attempts);

                resolve({
                  qrcode: `${qrCode}`,
                  attempts: attempts,
                  urlCode: urlCode,
                });
              },
              folderNameToken: "tokens",
              logQR: false,
              puppeteerOptions: {
                executablePath: "/usr/bin/chromium-browser",
              },
              statusFind: (statusSession) => {
                if (statusSession === "qrReadFail") {
                  console.log("QR code expirou. Tentando novamente...");
                }

                if (statusSession === "successChat") {
                  agentRef
                    .update({
                      status: true,
                    })
                    .then(() => {
                      resolve({ status: "qrRead" });
                      console.log("Agent status updated to authenticated");
                    })
                    .catch((error) => {
                      console.error("Error updating agent status:", error);
                    });
                }
              },
            })
            .then((client) => {
              activeSessions.set(sessionName, client);
              _handleMessages(client, assistantId);
            })
            .catch((error) => {
              console.log(error);
              reject("Error starting session: " + error);
            });
        })
        .catch((error) => {
          reject("Error fetching agent data: " + error);
        });
    });
  };

  const stopAgent = ({ id }) => {
    return new Promise((resolve, reject) => {
      const agentRef = db.collection("agents").doc(id);

      agentRef
        .get()
        .then((doc) => {
          if (!doc.exists) {
            reject("Agent not found");
            return;
          }

          const { assistantId } = doc.data();
          const sessionName = `session_${assistantId}`;
          const client = activeSessions.get(sessionName);

          if (!client) {
            reject("No active session found for this agent");
            return;
          }

          client
            .logout()
            .then(() => {
              console.log(`Session ${sessionName} logged out successfully`);

              client
                .close()
                .then(() => {
                  console.log(`Session ${sessionName} closed successfully`);
                  activeSessions.delete(sessionName);

                  agentRef
                    .update({
                      status: false,
                    })
                    .then(() => {
                      console.log("Agent status updated to inactive");
                      resolve(`Agent ${id} session stopped successfully`);
                    })
                    .catch((error) => {
                      console.error("Error updating agent status:", error);
                      reject("Error updating agent status");
                    });
                })
                .catch((error) => {
                  console.error(`Error closing session ${sessionName}:`, error);
                  reject("Error closing session");
                });
            })
            .catch((error) => {
              console.error(`Error logging out session ${sessionName}:`, error);
              reject("Error logging out session");
            });
        })
        .catch((error) => {
          reject("Error fetching agent data: " + error);
        });
    });
  };

  const _createThread = (assistantId, _phone, _name) => {
    return openai.beta.threads
      .create()
      .then((thread) => {
        return db
          .collection("threads")
          .doc(thread.id)
          .set({
            assistantId,
            threadId: thread.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            phone: _phone,
            name: _name,
            isBlocked: false,
          })
          .then(() => {
            return thread;
          })
          .catch((error) => {
            console.error("Error saving thread to Firebase:", error);
            throw error;
          });
      })
      .catch((error) => {
        console.error("Error creating thread:", error);
        throw error;
      });
  };

  const _addMessage = (threadId, message) => {
    console.log("✌️threadId --->", threadId);
    return new Promise((resolve, reject) => {
      openai.beta.threads.messages
        .create(threadId, {
          role: "user",
          content: message,
        })
        .then((response) => {
          const threadRef = db.collection("threads").doc(threadId);
          const messagesRef = threadRef.collection("messages");

          return messagesRef
            .add({
              content: message,
              createdAt: new Date(),
              role: "user",
            })
            .then(() => resolve(response));
        })
        .then(() => {
          resolve("Mensagem adicionada e salva com sucesso!");
        })
        .catch((error) => {
          reject(`Erro ao adicionar mensagem: ${error.message}`);
        });
    });
  };

  const _runAssistant = (threadId, assistantId) => {
    return openai.beta.threads.runs
      .create(threadId, {
        assistant_id: assistantId,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new Error(`Erro ao executar assistente: ${error.message}`);
      });
  };

  const _checkingStatus = (callback, threadId, runId) => {
    return new Promise((resolve, reject) => {
      openai.beta.threads.runs
        .retrieve(threadId, runId)
        .then((runObject) => {
          const status = runObject.status;
          console.log("Current status: " + status);
          if (status === "in_progress") {
            activeRuns.set(runId, true);
          } else if (status === "completed" && activeRuns.get(runId)) {
            clearInterval(pollingInterval);
            activeRuns.delete(runId);
            openai.beta.threads.messages
              .list(threadId)
              .then((messagesList) => {
                let messages = [];

                messagesList.body.data.forEach((message) => {
                  messages.push(message.content);
                });

                callback({ messages });
                resolve();

                const agentResponse = messages[0][0].text.value;
                const agentMessage = {
                  content: agentResponse,
                  createdAt: new Date(),
                  role: "agent",
                };

                const threadRef = db.collection("threads").doc(threadId);
                const messagesRef = threadRef.collection("messages");

                return messagesRef.add(agentMessage);
              })
              .catch((error) =>
                reject(`Error retrieving messages: ${error.message}`)
              );
          } else if (status === "requires_action") {
            console.log("requires_action.. looking for a function");

            if (runObject.required_action.type === "submit_tool_outputs") {
              const toolCalls =
                runObject.required_action.submit_tool_outputs.tool_calls;
              const parsedArgs = JSON.parse(toolCalls[0].function.arguments);

              gloogleService
                .createCalendarMeeting(parsedArgs)
                .then((apiResponse) => {
                  openai.beta.threads.runs
                    .submitToolOutputs(threadId, runId, {
                      tool_outputs: [
                        {
                          tool_call_id: toolCalls[0].id,
                          output: JSON.stringify(apiResponse),
                        },
                      ],
                    })
                    .then((run) => {
                      console.log(
                        "Run after submit tool outputs: " + run.status
                      );
                      resolve();
                    })
                    .catch((error) =>
                      reject(`Error submitting tool outputs: ${error.message}`)
                    );
                })
                .catch((error) =>
                  reject(`Error creating calendar meeting: ${error.message}`)
                );
            }
          }
        })
        .catch((error) =>
          reject(`Error retrieving run object: ${error.message}`)
        );
    });
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const _handleMessages = (client, assistantId) => {
    client.onMessage((message) => {
      if (!message.isGroupMsg && message.isNewMsg) {
        const processNextMessage = (from) => {
          const pending = threads[from]?.penddingMessages || [];
          if (pending.length > 0) {
            const nextMessage = pending.shift();
            addMessageAndRunAssistant(nextMessage);
          } else {
            threads[from]["isProcessing"] = false;
          }
        };

        const addMessageAndRunAssistant = (message) => {
          const threadId = threads[message.from].id;

          return db
            .collection("threads")
            .doc(threadId)
            .get()
            .then((doc) => {
              if (doc.exists && doc.data().isBlocked) {
                threads[message.from]["isProcessing"] = false;
                return Promise.reject("Thread is blocked");
              }

              return _addMessage(threadId, message.body)
                .then(() => {
                  threads[message.from]["isProcessing"] = true;

                  if (!threads[message.from]?.id) {
                    _createThread(
                      assistantId,
                      message?.from,
                      message?.sender?.pushname
                    ).then((thread) => {
                      threads[message.from].id = thread.id;
                      _runAssistant(thread.id, assistantId).then((run) => {
                        const runId = run.id;

                        pollingInterval = setInterval(() => {
                          _checkingStatus(
                            (response) => {
                              clearInterval(pollingInterval);
                              client.sendText(
                                message?.from,
                                response.messages[0][0].text.value
                              );
                              processNextMessage(message.from);
                            },
                            thread.id,
                            runId
                          );
                        }, 500);
                      });
                    });
                  } else {
                    _runAssistant(threadId, assistantId).then((run) => {
                      const runId = run.id;

                      pollingInterval = setInterval(() => {
                        _checkingStatus(
                          (response) => {
                            clearInterval(pollingInterval);
                            client.sendText(
                              message?.from,
                              response.messages[0][0].text.value
                            );
                            processNextMessage(message.from);
                          },
                          threadId,
                          runId
                        );
                      }, 500);
                    });
                  }
                })
                .catch((error) => {
                  console.error("Erro ao adicionar mensagem:", error);
                  processNextMessage(message.from);
                });
            });
        };

        const initializeThread = (threadId, message) => {
          threads[message.from] = threads[message.from] || {};
          threads[message.from]["id"] = threadId;
          threads[message.from]["penddingMessages"] = [];

          if (!threads[message.from]["isProcessing"]) {
            addMessageAndRunAssistant(message);
          } else {
            threads[message.from]["penddingMessages"].push(message);
          }
        };
        console.log(threads[message.from]?.id);
        console.log(message.from);

        if (threads[message.from]?.id) {
          initializeThread(threads[message.from].id, message);
        } else {
          db.collection("threads")
            .where("phone", "==", `${message.from}`)
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                initializeThread(doc.id, message);
              } else {
                _createThread(
                  assistantId,
                  message?.from,
                  message?.sender?.pushname
                )
                  .then((thread) => {
                    initializeThread(thread.id, message);
                  })
                  .catch((error) => {
                    console.error("Erro ao criar thread:", error);
                  });
              }
            })
            .catch((error) => {
              console.error("Erro ao consultar Firestore:", error);
            });
        }
      }
    });
  };

  const handleThread = ({ id }) => {
    return db
      .collection("threads")
      .doc(id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw new Error("Thread not found");
        }
        return db.collection("threads").doc(id).update({
          isBlocked: !doc.data().isBlocked,
          updatedAt: new Date(),
        });
      });
  };

  return {
    createAgent,
    updateAgent,
    deleteAgent,
    startAgent,
    stopAgent,
    handleThread,
  };
};
