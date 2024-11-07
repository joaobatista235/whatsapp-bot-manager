import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDE-xFRR4ST9ubrEmr7Fx4CVPX_kVS_-1k",
  authDomain: "whatsapp-agent-e9d4d.firebaseapp.com",
  projectId: "whatsapp-agent-e9d4d",
  storageBucket: "whatsapp-agent-e9d4d.appspot.com",
  messagingSenderId: "440074381816",
  appId: "1:440074381816:web:be26a41d03f75f7f068e0d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
