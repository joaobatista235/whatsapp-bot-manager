import express from "express";
import cors from "cors";
import router from "./router.js";

const app = express();
app.use(cors());
app.use(express.json());

router(app);

export default app;
