const venom = require("venom-bot");
const { OpenAI } = require("openai");
const { saveBotData, getActiveBots, deleteBotData } = require("./firebaseService");
const path = require('path');
const fs = require('fs');
const getTokenFilePath = (nameCompany) => {
  return path.join(__dirname, `../../tokens/session-${nameCompany}`);
};

const models = {
  1: 'gpt-3.5-turbo',
  2: 'gpt-3.5-turbo-16k-0613',
  3: 'gpt-4o',
  4: 'gpt-4-32k'
}

exports.createBotForCompany = async ({
  nameCompany,
  context,
  apiKey,
  modelIA,
  objective,
  communication,
  nameAgent,
  sector,
  createdAt,
  updatedAt,
}) => {
  return new Promise((resolve, reject) => {
    venom
      .create(
        `session-${nameCompany}`,
        (base64Qrimg) => {
          const botData = {
            nameCompany,
            context,
            apiKey,
            modelIA,
            objective,
            communication,
            nameAgent,
            sector,
            createdAt,
            updatedAt,
            isActive: true
          };

          saveBotData(nameCompany, botData)
            .then(() => {
              resolve(base64Qrimg);
            })
            .catch((error) => {
              reject(error);
            });
        },
        (statusSession) => console.log("Status Session: ", statusSession),
        { logQR: true, createPathFileToken: false }
      )
      .then((client) => startBot(client, botData))
      .catch((erro) => {
        reject(erro);
      });
  });
};

exports.startAllBots = async () => {
  try {
    const allBots = await getActiveBots();
    for (const bot of allBots) {
      const { nameCompany } = bot;
      const tokenFilePath = getTokenFilePath(nameCompany);
      if (fs.existsSync(tokenFilePath)) {
        venom
          .create(
            `session-${nameCompany}`,
            (base64Qrimg) => {
              console.log(`Bot ${nameCompany} iniciado com sucesso!`);
            },
            (statusSession) => console.log("Status Session: ", statusSession),
            {
              createPathFileToken: false,
              multidevice: true,
              folderNameToken: path.dirname(tokenFilePath),
              sessionTokenFile: path.basename(tokenFilePath)
            }
          )
          .then((client) => startBot(client, bot))
          .catch((error) =>
            console.error(`Erro ao iniciar o bot ${nameCompany}:`, error)
          );
      }
    }
  } catch (error) {
    console.error("Erro ao iniciar todos os bots:", error);
  }
};

async function startBot(client, data) {
  if (!client) throw new Error("Falha ao criar a sessão do Venom.");

  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      const response = await handleMessage(data, message.body);
      client.sendText(message.from, response);
    }
  });

  client.onStateChange(async (state) => {
    console.log(`Estado do cliente ${nameCompany}:`, state);
    if (
      state === "CONFLICT" ||
      state === "UNPAIRED" ||
      state === "UNLAUNCHED"
    ) {
      await db.collection("whatsapp-agents").doc(nameCompany).update({
        isActive: false,
      });
    }
  });
}

async function handleMessage(data, message) {
  const openai = new OpenAI({ apiKey: data.apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
          Você é um agente de IA chamado "${data.nameAgent}", um assistente virtual oficial da empresa "${data.nameCompany}".
          Seu principal objetivo é ajudar com: ${data.objective}.
          Comunicação ideal: ${data.communication}.

          **Contexto do atendimento**: ${data.context}

          Sempre mantenha o foco no contexto acima. Se alguma pergunta estiver fora desse contexto, responda educadamente que você não pode fornecer essa informação.
          `
        },
        { role: "user", content: message },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao gerar resposta do bot:", error);
    return "Desculpe, ocorreu um erro ao processar sua solicitação.";
  }
}

exports.removeBotCompany = async (nameCompany) => {
  try {
    deleteBotData(nameCompany);

    const tokenFilePath = getTokenFilePath(nameCompany);
    if (fs.existsSync(tokenFilePath)) {
      fs.rm(tokenFilePath, { recursive: true });
      console.log(`Pasta de tokens para ${nameCompany} removida com sucesso.`);
    } else {
      console.warn(`Pasta de tokens não encontrada para ${nameCompany}.`);
    }
  } catch (error) {
    console.error(`Erro ao excluir o bot da empresa ${nameCompany}.`);
    throw error;
  }
}