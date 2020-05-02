const { Client } = require("pg");
var bodyParser = require("body-parser");
const path = require("path");

const express = require("express");

const WebSocket = require("ws");
const app = express();
const connectionString =
  "postgres://unavejsb:NSoWq1fWupJYQMktk9nBLi5PDTEVe9sL@balarama.db.elephantsql.com:5432/unavejsb";
const clientPg = new Client(connectionString);
clientPg.connect();

const connection = new WebSocket.Server({ port: 8003 });

connection.on("connection", (ws) => {
  ws.on("message", (message) => {
    sendMessage(message).then((data) => {
      connection.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    });
  });
});

const staticFilesUrl = path.join(__dirname, "../build");

app.listen(Number(process.env.PORT)|| 8002);

app.use(bodyParser.json());
app.use(express.static(staticFilesUrl));

app.post("/api/register", registerHandler);

async function registerHandler(req, res) {
  const { login, password, name, surname } = req.body;
  if (!(await isUserLoginExist(login))) {
    try {
      const response = await registerUser(login, password, name, surname);
      if (response.rows.length === 0) {
        res.send({ status: "ok" });
      } else {
        res.send({ status: "error", message: "я не знаю почему" });
      }
    } catch (error) {
      res.send({ status: "error", message: "видимо ошибка подключения к БД" });
    }
  } else {
    res.send({ status: "error", message: "логин занят" });
  }
  res.send(res.rows);
}

async function isUserLoginExist(login) {
  const queryString = `SELECT * FROM "public"."Users" where "public"."Users"."LOGIN" = '${login}'`;
  return clientPg
    .query(queryString)
    .then((res) => Boolean(res.rows.length))
    .catch((e) => false);
}

async function registerUser(login, password, name, surname) {
  const queryString = `INSERT INTO public."Users"(
    "NAME", "SURNAME", "LOGIN", "PASSWORD")
   VALUES ( '${name}', '${surname}', '${login}', '${password}');`;

  return clientPg.query(queryString);
}

app.post("/api/auth", authHandler);

async function authHandler(req, res) {
  const { login, password } = req.body;
  const responseFromDB = await checkLogPass(login, password);
  if (responseFromDB.status) {
    res.send({
      status: "ok",
      userData: {
        userId: responseFromDB.data.USER_ID,
        name: responseFromDB.data.NAME,
        surname: responseFromDB.data.SURNAME,
      },
    });
  } else {
    res.send({ status: "error", message: "неверный логин или пароль" });
  }
}

async function checkLogPass(login, password) {
  const queryString = `SELECT * FROM "public"."Users" where "public"."Users"."LOGIN" = '${login}' AND "public"."Users"."PASSWORD" = '${password}' `;
  return clientPg
    .query(queryString)
    .then((res) => ({
      status: Boolean(res.rows.length),
      data: res.rows[0],
    }))
    .catch((e) => false);
}

app.get("/api/chats", getChats);

async function getChats(req, res) {
  const queryString = `SELECT * FROM "public"."Chats" `;
  return clientPg
    .query(queryString)
    .then((response) => {
      const sendData = response.rows.map((el) => {
        return {
          chatName: el.CHAT_NAME,
          chatId: el.CHAT_ID,
        };
      });
      res.send(sendData);
    })
    .catch((e) => false);
}

app.post("/api/send", sendMessage);

async function sendMessage(req) {
  const { chatId, userId, text } = JSON.parse(req);
  const tableName = await getTable(chatId);
  await trySendMessage(tableName, userId, text);
  const message = await getLastMessage(tableName);
  const userInfo = await getUserById(userId);
  return {
    textMessage: message.TEXT,
    userName: userInfo.NAME,
    userSurname: userInfo.SURNAME,
    userId: userId,
    messageId: message.MESSAGE_ID,
  };
}
async function trySendMessage(table, userId, text) {
  const queryString = `INSERT INTO public."${table}"(
    "USER_ID", "TEXT")
   VALUES ( '${userId}', '${text}');`;
  return clientPg.query(queryString);
}

async function getTable(chatId) {
  const queryString = `SELECT * FROM "public"."Chats" where "public"."Chats"."CHAT_ID" = '${chatId}'`;
  return clientPg
    .query(queryString)
    .then((response) => {
      return response.rows[0].CHAT_TABLE;
    })
    .catch((e) => false);
}

async function getLastMessage(tableName) {
  const queryString = `SELECT * FROM public."${tableName}" ORDER BY public."${tableName}"."MESSAGE_ID" DESC LIMIT 1`;
  return clientPg
    .query(queryString)
    .then((response) => {
      return response.rows[0];
    })
    .catch((e) => false);
}

async function getUserById(userId) {
  const queryString = `SELECT * FROM "public"."Users" where "public"."Users"."USER_ID" = '${userId}'`;
  return clientPg
    .query(queryString)
    .then((response) => {
      return response.rows[0];
    })
    .catch((e) => false);
}

app.get("/api/messages", getMessageById);
async function getMessageById(req, res) {
  const chatId = req.query.chatId;
  const tableName = await getTable(chatId);
  const messages = await getMessagesFromTable(tableName);
  res.send(
    messages.map((el) => ({
      textMessage: el.TEXT,
      userName: el.NAME,
      userSurname: el.SURNAME,
      userId: el.USER_ID,
      messageId: el.MESSAGE_ID,
    }))
  );
}

async function getMessagesFromTable(tableName) {
  const queryString = `SELECT * FROM "public"."${tableName}" inner join "public"."Users" ON "public"."${tableName}"."USER_ID" = "public"."Users"."USER_ID"`;
  return clientPg
    .query(queryString)
    .then((response) => {
      return response.rows;
    })
    .catch((e) => false);
}

app.get("*", function (req, res) {
  res.sendfile(path.join(staticFilesUrl, "index.html"));
});