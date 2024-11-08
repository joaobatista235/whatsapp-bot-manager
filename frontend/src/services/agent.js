import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const getAgents = async () => {
  const agentsCollection = collection(db, "agents"); // Altere para o nome correto da coleção
  const agentsSnapshot = await getDocs(agentsCollection);
  const agents = agentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return agents;
};
