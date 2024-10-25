const venom = require("venom-bot");
const { OpenAI } = require("openai");
const { saveBotData, getActiveBots } = require("./firebaseService");

const bots = {};

const getTokenFilePath = (companyId) => {
  return path.join(__dirname, `../../tokens/session-${companyId}.json`);
};

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
        { logQR: false, createPathFileToken: false }
      )
      .then((client) => startBot(client, { nameCompany, context, apiKey }))
      .catch((erro) => {
        reject(erro);
      });
  });
};

exports.startAllBots = async () => {
  try {
    const allBots = await getActiveBots();
    for (const bot of allBots) {
      const { companyId } = bot;
      const tokenFilePath = getTokenFilePath(companyId);
      if (fs.existsSync(tokenFilePath)) {
        venom
          .create(
            `session-${companyId}`,
            (base64Qrimg) => {
              console.log(`Bot ${companyId} iniciado com sucesso!`);
            },
            (statusSession) => console.log("Status Session: ", statusSession),
            {
              logQR: false,
              createPathFileToken: false,
              sessionToken: require(tokenFilePath),
            }
          )
          .then((client) => startBot(client, bot))
          .catch((error) =>
            console.error(`Erro ao iniciar o bot ${companyId}:`, error)
          );
      }
    }
  } catch (error) {
    console.error("Erro ao iniciar todos os bots:", error);
  }
};

async function startBot(client, data) {
  const { nameCompany } = data;

  if (!client) throw new Error("Falha ao criar a sessão do Venom.");

  bots[nameCompany] = data;

  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      const response = await handleMessage(nameCompany, message.body);
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

async function handleMessage(nameCompany, message) {
  const bot = bots[nameCompany];
  if (!bot) return "Bot não encontrado.";
  console.log(bot);

  const openai = new OpenAI({ apiKey: bot.apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
          Você é um agente de IA chamado: ${bot.nameAgent}
          Representa a empresa: ${bot.nameCompany}
          Seu objetivo é auxiliar em: ${bot.objective}
          Sua comunicação deve ser: ${bot.communication}
          Contexto atual: ${bot.context}
          Caso receba perguntas fora desse contexto, informe que não consegue responder.
          `,
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
