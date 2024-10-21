const admin = require("firebase-admin");
const db = admin.firestore();

admin.initializeApp({
  credential: admin.credential.cert("./src/config/serviceAccountKey.json"),
});

module.exports = db;
