const { Server } = require("socket.io");
const comandos = require("./commands");

const clientes = new Map();

function configurarSockets(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`[+] Cliente conectado: ${socket.id}`);
    socket.emit("mensagem", comandos.LOGIN_TELA);

    socket.on("mensagem", (mensagem) => {
      const cliente = clientes.get(socket.id);

      // LOGIN
      if (!cliente) {
        const nome = mensagem.trim().replace(/,/g, "");
        const nomesExistentes = [...clientes.values()].map((c) => c.nome);

        if (!nome || nomesExistentes.includes(nome)) {
          socket.emit("mensagem", comandos.LOGIN_NEGADO);
        } else {
          clientes.set(socket.id, { nome, socket });
          socket.emit("mensagem", comandos.LOGIN_ACEITO);
          socket.emit("mensagem", `Olá ${nome}`);
          io.emit("mensagem", `🔔 ${nome} entrou no chat.`);
          console.log(`[LOGIN] ${nome} entrou.`);
        }
        return;
      }

      const { nome } = cliente;

      // SAIR
      if (mensagem === comandos.SAIR) {
        socket.disconnect();
        return;
      }

      // LISTA DE CLIENTES
      if (mensagem === comandos.LISTA_USUARIOS) {
        const nomes = [...clientes.values()].map((c) => c.nome).join(", ");
        socket.emit("mensagem", `Usuários online: ${nomes}`);
        return;
      }

      // MENSAGEM PRIVADA
      if (mensagem.startsWith(comandos.MENSAGEM)) {
        const nomeDest = mensagem.slice(comandos.MENSAGEM.length).trim();
        const destino = [...clientes.values()].find((c) => c.nome === nomeDest);

        if (!destino) {
          socket.emit("mensagem", `Usuário ${nomeDest} não encontrado.`);
        } else {
          socket.emit("mensagem", `Digite a mensagem para ${nomeDest}:`);
          socket.once("mensagem", (resposta) => {
            destino.socket.emit("mensagem", `<${nome}> (privado): ${resposta}`);
          });
        }
        return;
      }

      // MENSAGEM BROADCAST
      for (const c of clientes.values()) {
        c.socket.emit("mensagem", `<${nome}>: ${mensagem}`);
      }
    });

    socket.on("disconnect", () => {
      const cliente = clientes.get(socket.id);
      if (cliente) {
        console.log(`[-] ${cliente.nome} saiu.`);
        io.emit("mensagem", `⚠️ ${cliente.nome} saiu do chat.`);
        clientes.delete(socket.id);
      }
    });
  });
}

module.exports = configurarSockets;
