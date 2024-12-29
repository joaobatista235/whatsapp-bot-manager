import { google } from "googleapis";

export default (oauth2Client) => {
  const generateAuthUrl = () => {
    return new Promise((resolve) => {
      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/calendar",
      });
      resolve({ url });
    });
  };

  const getToken = (code) => {
    return new Promise((resolve, reject) => {
      oauth2Client
        .getToken(code)
        .then(({ tokens }) => {
          console.log(tokens);

          oauth2Client.setCredentials(tokens);
          resolve(tokens);
        })
        .catch((error) => {
          console.error("Erro ao obter tokens:", error);
          reject(error);
        });
    });
  };

  const createCalendarMeeting = (args) => {
    console.log("✌️args --->", args);
    return new Promise((resolve, reject) => {
      try {
        const { email, date, time, subject } = args;
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const event = {
          summary: subject,
          location: "Local a definir",
          description: `Reunião com ${email}`,
          start: {
            dateTime: `${date}T${time}:00`,
            timeZone: "America/Sao_Paulo",
          },
          end: {
            dateTime: `${date}T${parseInt(time.split(":")[0]) + 1}:00:00`,
            timeZone: "America/Sao_Paulo",
          },
          attendees: [{ email }],
        };
        console.log("✌️event --->", event);

        calendar.events
          .insert({
            calendarId: "primary",
            resource: event,
          })
          .then((response) => {
            console.log("Evento criado com sucesso:", response.data.htmlLink);
            resolve({
              result: "Reunião agendada",
              link: response.data.htmlLink,
            });
          })
          .catch((error) => {
            console.error("Erro ao criar evento:", error);
            reject({ result: "Erro ao agendar reunião", error: error.message });
          });
      } catch (error) {
        console.error("Erro inesperado:", error);
        reject({ result: "Erro inesperado", error: error.message });
      }
    });
  };

  return {
    generateAuthUrl,
    getToken,
    createCalendarMeeting,
  };
};
