import agentRoutes from "./routes/agent.js";
import gloogleRoutes from "./routes/gloogle.js";

export default (app) => {
  app.use("/agent", agentRoutes);
  app.use("/", gloogleRoutes);
};
