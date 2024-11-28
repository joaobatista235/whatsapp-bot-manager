import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert("./src/config/serviceAccountKey.json"),
});

export const db = admin.firestore();
