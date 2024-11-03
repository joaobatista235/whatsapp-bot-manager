const botService = require("../services/botService");

exports.createBot = async (req, res, next) => {
  const {
    nameCompany,
    context,
    apiKey,
    modelIA,
    objective,
    communication,
    nameAgent,
    sector,
  } = req.body;

  if (Object.values(req.body).some((campo) => !campo)) {
    return res
      .status(400)
      .json({ error: "Todos os campos devem estar preenchidos." });
  }

  try {
    const qrCode = await botService.createBotForCompany({
      nameCompany,
      context,
      apiKey,
      modelIA,
      objective,
      communication,
      nameAgent,
      sector,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.json({
      message: `Bot para a empresa ${nameCompany} foi configurado com sucesso!`,
      qrcode: qrCode,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeBot = async (req, res, next) => {
  const { nameCompany } = req.body;
  try {
    await botService.removeBotCompany(nameCompany);
    res.status(200).json({ message: `Bot da empresa ${nameCompany} removido com sucesso!` });
  } catch (error) {
    console.error('Erro ao remover o bot:', error);
    next(error);
  }
}

exports.startAllBots = async (req, res, next) => {
  try {
    await botService.startAllBots();
    res.json({ message: "Todos os bots foram iniciados com sucesso!" });
  } catch (error) {
    next(error);
  }
};
