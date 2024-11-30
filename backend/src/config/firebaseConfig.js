import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert("./src/config/serviceAccountKey.json"),
  databaseAuthVariableOverride: {
    uid: "admin-service-worker",
  },
});

export const db = admin.firestore();
