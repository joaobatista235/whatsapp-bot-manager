const express = require('express');
const venom = require('venom-bot');
const { OpenAI } = require('openai');
const { json } = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(json());

const bots = {};

async function createBotForCompany(companyId, context, apiKey) {
    return new Promise((resolve, reject) => {
        venom
            .create(
                `session-${companyId}`,
                (base64Qrimg) => resolve(base64Qrimg),
                (statusSession) => console.log('Status Session: ', statusSession),
                { logQR: false }
            )
            .then((client) => start(client, { client, context, apiKey }))
            .catch((erro) => {
                console.error('Erro ao criar sessão:', erro);
                reject(erro);
            });
    });
}

function start(client, data) {
    if (!client) {
        throw new Error("Falha ao criar a sessão do Venom.");
    }
    bots[companyId] = data;

    client.onMessage(async (message) => {
        if (message.isGroupMsg === false) {
            const response = await handleMessage(companyId, message.body);
            client.sendText(message.from, response);
        }
    });
}

async function handleMessage(companyId, message) {
    const bot = bots[companyId];
    if (!bot) {
        return 'Bot não encontrado.';
    }

    const openai = new OpenAI({
        apiKey: bot.apiKey,
    });

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

app.post('/create-bot', async (req, res) => {
    const { companyId, context, apiKey } = req.body;

    if (!companyId) {
        return res.status(400).send('O campo companyId é obrigatório.');
    }

    if (!context) {
        return res.status(400).send('O campo context é obrigatório.');
    }

    if (!apiKey) {
        return res.status(400).send('O campo apiKey é obrigatório.');
    }

    try {
        const qrCode = await createBotForCompany(companyId, context, apiKey);
        res.json({ message: `Bot para a empresa ${companyId} foi configurado com sucesso!`, qrcode: qrCode });
    
    } catch (error) {
        res.status(500).send('Erro ao criar bot');
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
