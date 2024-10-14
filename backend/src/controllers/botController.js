const botService = require('../services/botService');

exports.createBot = async (req, res, next) => {
    const { companyId, context, apiKey } = req.body;

    if (!companyId || !context || !apiKey) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    try {
        const qrCode = await botService.createBotForCompany(companyId, context, apiKey);
        res.json({ message: `Bot para a empresa ${companyId} foi configurado com sucesso!`, qrcode: qrCode });
    } catch (error) {
        next(error);
    }
};
