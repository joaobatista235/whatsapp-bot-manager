import express from "express";
import {
  handleGoogleCallback,
  redirectToGoogleAuth,
} from "../controllers/contoller.js";

const gloogleRoutes = express.Router();

gloogleRoutes.get("/", redirectToGoogleAuth);

gloogleRoutes.get("/redirect", handleGoogleCallback);


export default gloogleRoutes;
