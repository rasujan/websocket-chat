const webSocketServerPort = 8001;
import { server as webSocketServer } from "websocket";
import http from "http";

const server = http.createServer();

try {
  server.listen(webSocketServerPort);
  console.log("Listening are port ✔ 😃  ", webSocketServerPort);
} catch {
  console.log("Something went run starting the serve 🙃  ");
}

const wsServer = new webSocketServer({ httpServer: server });

const clients = {};

const generateUserId = () => {
  const id =
    Math.floor(1 + Math.random() * 9999) + Math.floor(1 + Math.random() * 9999);
  return id;
};

wsServer.on("request", (request) => {
  const userId = generateUserId();
  console.log(
    `${new Date()} Received a new connection from origin : ${request.origin}`
  );

  const connection = request.accept(null, request.origin);

  clients[userId] = connection;

  console.log(`Connected ${userId} in ${Object.getOwnPropertyNames(clients)}`);

  connection.on("message", (message) => {
    if (message.type === "utf8") {
      console.log(`Receive message: ${message.utf8Data}`);

      let key;
      for (key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log(`sent message to ${clients[key]}`);
      }
    }
  });
});
