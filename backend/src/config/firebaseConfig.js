const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("./src/config/serviceAccountKey.json"),
});

const db = admin.firestore();
module.exports = db;
