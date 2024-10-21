const db = require('../config/firebaseConfig');

exports.saveBotData = async (companyId, botData) => {
    const botDocRef = db.collection('whatsapp-agents').doc(companyId);
    return botDocRef.set(botData);
};

exports.getActiveBots = async () => {
    const snapshot = await db.collection('whatsapp-agents').where('isActive', '==', true).get();
    return snapshot.docs.map(doc => doc.data());
};

exports.getAllBots = async () => {
    const snapshot = await db.collection('whatsapp-agents').get();
    return snapshot.docs.map(doc => doc.data());
};