const venom = require('venom-bot');
const { OpenAI } = require('openai');

const bots = {};

exports.createBotForCompany = async (companyId, context, apiKey) => {
    return new Promise((resolve, reject) => {
        venom.create(
            `session-${companyId}`,
            (base64Qrimg) => resolve(base64Qrimg),
            (statusSession) => console.log('Status Session: ', statusSession),
            { logQR: false, createPathFileToken: false}
        )
        .then((client) => start(client, { companyId, context, apiKey }))
        .catch((erro) => reject(erro));
    });
};

function start(client, data) {
    const { companyId } = data;
    if (!client) throw new Error("Falha ao criar a sessão do Venom.");
    bots[companyId] = data;

    client.onMessage(async (message) => {
        if (message.isGroupMsg) {
            const response = await handleMessage(companyId, message.body);
            client.sendText(message.from, response);
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
