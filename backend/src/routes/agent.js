import express from "express";
import {
  createAgent,
  updateAgent,
  deleteAgent,
  startAgent,
  stopAgent,
  handleThread,
} from "../controllers/contoller.js";

const agentRoutes = express.Router();

agentRoutes.post("/", createAgent);
agentRoutes.put("/startAgent/:id", startAgent);
agentRoutes.put("/stopAgent/:id", stopAgent);
agentRoutes.put("/handleThread/:id", handleThread);
agentRoutes.put("/:id", updateAgent);
agentRoutes.delete("/:id", deleteAgent);

export default agentRoutes;
