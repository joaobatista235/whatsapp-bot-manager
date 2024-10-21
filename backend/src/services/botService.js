const venom = require('venom-bot');
const { OpenAI } = require('openai');
const { saveBotData, getActiveBots } = require('./firebaseService');

const bots = {};

const getTokenFilePath = (companyId) => {
    return path.join(__dirname, `../../tokens/session-${companyId}.json`);
};

exports.createBotForCompany = async (companyId, context, apiKey) => {
    return new Promise((resolve, reject) => {
        venom.create(
            `session-${companyId}`,
            (base64Qrimg) => {
                const botData = { companyId, context, apiKey, isActive: true };
                saveBotData(companyId, botData)
                    .then(() => {
                        res.status(200).json({ qr: base64Qrimg, message: 'Bot criado com sucesso!' });
                        resolve(base64Qrimg);
                    })
                    .catch((error) => {
                        res.status(500).json({ error: 'Erro ao salvar bot no Firestore' });
                        reject(error);
                    });
            },
            (statusSession) => console.log('Status Session: ', statusSession),
            { logQR: false, createPathFileToken: false }
        )
        .then((client) => start(client, { companyId, context, apiKey }))
        .catch((erro) => {
            res.status(500).json({ error: 'Erro ao criar a sessão do Venom' });
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
                venom.create(
                    `session-${companyId}`,
                    (base64Qrimg) => {
                        console.log(`Bot ${companyId} iniciado com sucesso!`);
                    },
                    (statusSession) => console.log('Status Session: ', statusSession),
                    {
                        logQR: false,
                        createPathFileToken: false,
                        sessionToken: require(tokenFilePath)
                    }
                ).then((client) => startBot(client, bot))
                .catch((error) => console.error(`Erro ao iniciar o bot ${companyId}:`, error));
            }
        }
    } catch (error) {
        console.error('Erro ao iniciar todos os bots:', error);
    }
}

async function startBot(client, data) {
    const { companyId } = data;
    
    if (!client) throw new Error("Falha ao criar a sessão do Venom.");

    bots[companyId] = data;

    client.onMessage(async (message) => {
        if (!message.isGroupMsg) {
            const response = await handleMessage(companyId, message.body);
            client.sendText(message.from, response);
        }
    });

    client.onStateChange(async (state) => {
        console.log(`Estado do cliente ${companyId}:`, state);
        if (state === 'CONFLICT' || state === 'UNPAIRED' || state === 'UNLAUNCHED') {
            await db.collection('whatsapp-agents').doc(companyId).update({
                isActive: false,
            });
        }
    });
}

async function handleMessage(companyId, message) {
    const bot = bots[companyId];
    if (!bot) return 'Bot não encontrado.';

    const openai = new OpenAI({ apiKey: bot.apiKey });
    
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: bot.context },
                { role: 'user', content: message }
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Erro ao gerar resposta do bot:', error);
        return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
    }
}
