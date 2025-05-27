const express = require("express");
const http = require("http");
const configurarSockets = require("./socket");

const app = express();
const server = http.createServer(app);

configurarSockets(server);

server.listen(8888, () => {
  console.log("Servidor rodando na porta 8888");
});
