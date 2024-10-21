const app = require('./src/config/server');
const botController = require('./src/controllers/botController');

app.listen(3000, async () => {
    console.log('Servidor rodando na porta 3000');

    try {
        await botController.startAllBots();
        console.log('Todos os bots foram iniciados com sucesso!');
    } catch (error) {
        console.error('Erro ao iniciar os bots:', error);
    }
});
