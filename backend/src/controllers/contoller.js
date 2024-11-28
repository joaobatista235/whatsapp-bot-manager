import GloogleService from "../services/gloogle.js";
import AgentService from "../services/agent.js";
import { google } from "googleapis";
import { db } from "../config/firebaseConfig.js";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET_ID,
  process.env.REDIRECT
);

const gloogleService = GloogleService(oauth2Client);
const agentService = AgentService(db, gloogleService);

const redirectToGoogleAuth = (req, res, next) => {
  const { body } = req;
  return gloogleService
    .generateAuthUrl({ body })
    .then((response) => res.json(response))
    .catch(next);
};
const handleGoogleCallback = (req, res, next) => {
  const code = req?.query?.code;
  return gloogleService
    .getToken(code)
    .then((response) => res.json(response))
    .catch(next);
};

const getEvents = (req, res, next) => {
  const code = req?.query?.code;
  return gloogleService
    .getEvents(code)
    .then((response) => res.json(response))
    .catch(next);
};

const createEvent = (req, res, next) => {
  return gloogleService
    .createCalendarMeeting({ email: "diego@gmail.com" })
    .then((response) => res.json(response))
    .catch(next);
};

const createAgent = (req, res, next) => {
  const { body } = req;
  return agentService
    .createAgent({ body })
    .then((response) => res.json(response))
    .catch(next);
};

const updateAgent = (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  return agentService
    .updateAgent({ body: { ...body, agentId: id } })
    .then((response) => res.json(response))
    .catch(next);
};

const startAgent = (req, res, next) => {
  const { id } = req.params;

  return agentService
    .startAgent({ id })
    .then((response) => res.json(response))
    .catch(next);
};

const stopAgent = (req, res, next) => {
  const { id } = req.params;

  return agentService
    .stopAgent({ id })
    .then((response) => res.json(response))
    .catch(next);
};

const deleteAgent = (req, res, next) => {
  const { id } = req.params;

  return agentService
    .deleteAgent({ id })
    .then((response) => res.json(response))
    .catch(next);
};

export {
  redirectToGoogleAuth,
  handleGoogleCallback,
  getEvents,
  createEvent,
  createAgent,
  updateAgent,
  deleteAgent,
  startAgent,
  stopAgent,
};
