import express from "express";
import {
  createEvent,
  getEvents,
  handleGoogleCallback,
  redirectToGoogleAuth,
} from "../controllers/contoller.js";

const gloogleRoutes = express.Router();

gloogleRoutes.get("/", redirectToGoogleAuth);

gloogleRoutes.get("/redirect", handleGoogleCallback);

gloogleRoutes.get("/events", getEvents);

gloogleRoutes.post("/create-event", createEvent);

export default gloogleRoutes;
