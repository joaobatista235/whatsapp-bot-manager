const db = require("../config/firebaseConfig");

exports.saveBotData = async (companyName, botData) => {
  const botDocRef = db.collection("agents").doc(companyName);
  return botDocRef.set(botData);
};

exports.getActiveBots = async () => {
  const snapshot = await db
    .collection("agents")
    .where("isActive", "==", true)
    .get();
  return snapshot.docs.map((doc) => doc.data());
};

exports.deleteBotData = async (nameCompany) => {
  try {
    const botQuery = db.collection("agents").where("nameCompany", "==", nameCompany);
    const querySnapshot = await botQuery.get();

    if (querySnapshot.empty) {
      console.log(`Nenhum bot encontrado para a empresa: ${nameCompany}`);
      return
    }

    const doc = querySnapshot.docs[0];
    await doc.ref.delete();

    console.log(`Bot da empresa: ${nameCompany} removido com sucesso!`);
  } catch (error) {
    console.error(`Erro ao remover o bot ${companyName}:`, error);
    throw error;
  }
};
