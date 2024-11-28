import OpenAI from "openai";
import venom from "venom-bot";
import fs from "fs";

import AgentMetting from "../models/AgentMetting.js";

export default (db, gloogleService) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const threads = {}; // Armazena o threadId para cada número
  let pollingInterval;
  const activeSessions = new Map(); // Mapa para rastrear sessões ativas

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

        // Pega o assistantId diretamente do documento
        const assistantId = doc.data().assistantId;
        if (!assistantId) {
          throw new Error("AssistantId não encontrado no agente.");
        }

        // Se o agente existe e o assistantId está presente, começamos a exclusão
        const batch = db.batch();

        // Deleta o documento encontrado
        batch.delete(doc.ref);

        return batch.commit().then(() => {
          // Exclui também no OpenAI usando o assistantId

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

          // Verificar se a sessão já está ativa
          if (activeSessions.has(sessionName)) {
            resolve(`Session ${sessionName} is already active`);
            return;
          }

          venom
            .create(
              sessionName,
              (base64Qrimg, asciiQR) => {
                console.log("Terminal qrcode: ", asciiQR);
                console.log("Base64 image string qrcode: ", base64Qrimg);
              },
              (statusSession) => {
                console.log("Status Session: ", statusSession);

                if (statusSession === "successChat") {
                  // Atualizar o status do agente para 1 (autenticado)
                  agentRef
                    .update({
                      status: true,
                    })
                    .then(() => {
                      console.log("Agent status updated to authenticated");
                    })
                    .catch((error) => {
                      console.error("Error updating agent status:", error);
                    });
                }
              },
              {
                folderNameToken: "tokens",
                logQR: true,
              },
              async (browser, waPage) => {
                try {
                  console.log("Aguardando o QR code aparecer...");
                  await waPage.waitForSelector("canvas", { timeout: 60000 });

                  const qrElement = await waPage.$("canvas");

                  let qrFileName = `qrcode_${Date.now()}.png`;

                  await qrElement.screenshot({ path: qrFileName });

                  const screenshotBuffer = fs.readFileSync(qrFileName);
                  const base64Screenshot = screenshotBuffer.toString("base64");

                  fs.unlinkSync(qrFileName);

                  resolve({
                    qrcode: `data:image/png;base64,${base64Screenshot}`,
                  });
                } catch (error) {
                  console.log("Erro ao capturar o QR code:", error);
                }
              }
            )
            .then((client) => {
              activeSessions.set(sessionName, client); // Armazena o cliente no mapa de sessões ativas
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

          // Encerrar a sessão com o Venom
          client
            .logout()
            .then(() => {
              console.log(`Session ${sessionName} logged out successfully`);

              // Fechar o processo do cliente
              client
                .close()
                .then(() => {
                  console.log(`Session ${sessionName} closed successfully`);
                  activeSessions.delete(sessionName);

                  // Atualizar status do agente no Firestore
                  agentRef
                    .update({
                      status: false, // Atualiza status para inativo
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

  const _createThread = (assistantId) => {
    return openai.beta.threads
      .create()
      .then((thread) => {
        return db
          .collection("threads")
          .doc(thread.id) // Aqui você define o id do documento
          .set({
            assistantId,
            threadId: thread.id,
            createdAt: new Date(),
            updatedAt: new Date(),
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
    console.log("✌️message --->", message);
    return new Promise((resolve, reject) => {
      // Primeiro, cria a mensagem com a API do OpenAI
      openai.beta.threads.messages
        .create(threadId, {
          role: "user",
          content: message,
        })
        .then((response) => {
          // Se a mensagem for criada com sucesso, agora salvamos no banco de dados

          const threadRef = db.collection("threads").doc(threadId);
          const messagesRef = threadRef.collection("messages");

          // Adiciona a mensagem na subcoleção 'messages'
          return messagesRef
            .add({
              content: message,
              createdAt: new Date(),
              role: "user",
            })
            .then(() => resolve(response));
        })
        .then(() => {
          // Resolva a Promise com sucesso
          resolve("Mensagem adicionada e salva com sucesso!");
        })
        .catch((error) => {
          // Em caso de erro, rejeite a Promise
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
        return response; // Retorna a resposta da API
      })
      .catch((error) => {
        throw new Error(`Erro ao executar assistente: ${error.message}`); // Lida com erros
      });
  };

  const _checkingStatus = (callback, threadId, runId) => {
    return new Promise((resolve, reject) => {
      openai.beta.threads.runs
        .retrieve(threadId, runId)
        .then((runObject) => {
          console.log(runObject);

          const status = runObject.status;
          console.log("Current status: " + status);

          if (status === "completed") {
            clearInterval(pollingInterval);

            openai.beta.threads.messages
              .list(threadId)
              .then((messagesList) => {
                let messages = [];

                messagesList.body.data.forEach((message) => {
                  messages.push(message.content);
                });

                callback({ messages });
                resolve(); // Resolve after the callback is executed
              })
              .catch((error) =>
                reject(`Error retrieving messages: ${error.message}`)
              ); // Error in retrieving messages
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
                      resolve(); // Resolve after submitting tool outputs
                    })
                    .catch((error) =>
                      reject(`Error submitting tool outputs: ${error.message}`)
                    ); // Error in submitting tool outputs
                })
                .catch((error) =>
                  reject(`Error creating calendar meeting: ${error.message}`)
                ); // Error in creating calendar meeting
            }
          }
        })
        .catch((error) =>
          reject(`Error retrieving run object: ${error.message}`)
        ); // Error in retrieving run object
    });
  };

  const _handleMessages = (client, assistantId) => {
    client.onMessage((message) => {
      if (message.isGroupMsg === false && message.isNewMsg) {
        console.log("✌️message --->", message);
        let threadId;

        // Função para adicionar mensagem à thread
        const addMessageAndRunAssistant = (threadId) => {
          _addMessage(threadId, message.body)
            .then(() => {
              // Executa o assistente e lida com a resposta
              _runAssistant(threadId, assistantId).then((run) => {
                const runId = run.id;

                // Polling para verificar o status do assistente
                pollingInterval = setInterval(() => {
                  _checkingStatus(
                    (response) => {
                      // Envia a resposta de volta para o WhatsApp
                      client.sendText(
                        message.from,
                        response.messages[0][0].text.value
                      );
                    },
                    threadId,
                    runId
                  );
                }, 5000);
              });
            })
            .catch((error) => {
              console.error("Erro ao adicionar mensagem:", error);
            });
        };

        if (threads[message.from]) {
          threadId = threads[message.from];
          addMessageAndRunAssistant(threadId);
        } else {
          db.collection("threads")
            .where("threadId", "==", message.from)
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                threadId = doc.id;
                threads[message.from] = threadId;
                addMessageAndRunAssistant(threadId);
              } else {
                _createThread(assistantId)
                  .then((thread) => {
                    threadId = thread.id;
                    threads[message.from] = threadId;
                    addMessageAndRunAssistant(threadId);
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

  return { createAgent, updateAgent, deleteAgent, startAgent, stopAgent };
};
