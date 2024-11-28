import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const getAgents = () => {
  const agentsCollection = collection(db, "agents"); // Altere para o nome correto da coleção

  return getDocs(agentsCollection)
    .then((agentsSnapshot) => {
      const agents = agentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return agents;
    })
    .catch((error) => {
      console.error("Erro ao obter os agentes:", error.message);
      throw error;
    });
};

export const getAgentById = (id) => {
  const agentDoc = doc(db, "agents", id); // Substitua "agents" pelo nome correto da coleção, se necessário

  return getDoc(agentDoc)
    .then((agentSnapshot) => {
      if (agentSnapshot.exists()) {
        return { id: agentSnapshot.id, ...agentSnapshot.data() };
      } else {
        throw new Error("Agente não encontrado");
      }
    })
    .catch((error) => {
      console.error("Erro ao obter o agente:", error.message);
      throw error;
    });
};
