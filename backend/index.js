const express = require('express');
const venom = require('venom-bot');
const { OpenAI } = require('openai');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const bots = {};

function createBotForCompany(companyId, context, apiKey) {
    venom.create({session: `session-${companyId}`})
        .then(client => {
            if (!client) {
                throw new Error('Falha ao criar a sessão do Venom.');
            }
            
            bots[companyId] = { client, context, apiKey };

            client.onMessage(async (message) => {
                if (message.isGroupMsg === false) {
                    const response = await handleMessage(companyId, message.body);
                    client.sendText(message.from, response);
                }
            });
        })
        .catch(err => {
            console.error(`Erro ao criar sessão Venom para ${companyId}:`, err);
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

app.post('/create-bot', (req, res) => {
    const { companyId, context, apiKey } = req.body;

    if (!companyId || !context || !apiKey) {
        return res.status(400).send('Informações insuficientes');
    }

    createBotForCompany(companyId, context, apiKey);

    res.send(`Bot para a empresa ${companyId} foi configurado com sucesso!`);
});

app.get('/test', async (req, res) => {
    const openai = new OpenAI({
        apiKey: '',
    });

    const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-3.5-turbo'
    });

    console.log(response)
    
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
