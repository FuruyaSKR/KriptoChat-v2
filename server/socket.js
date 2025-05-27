const { Server } = require("socket.io");
const comandos = require("./commands");

const clientes = new Map(); // socket.id => { nome, socket, isLoggedIn, destinatarioPrivado }

function createMessage({ type, author = null, content, recipient = null }) {
  return {
    type,
    author,
    content,
    recipient,
    timestamp: Date.now(),
  };
}

// Notifica todos os logados com a nova lista
function broadcastUserList() {
  const nomes = [...clientes.values()]
    .filter((c) => c.isLoggedIn)
    .map((c) => c.nome)
    .join(", ");

  for (const c of clientes.values()) {
    if (c.isLoggedIn) {
      c.socket.emit(
        "mensagem",
        createMessage({
          type: "system",
          content: `Usuários online: ${nomes}`,
        })
      );
    }
  }
}

function configurarSockets(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`[+] Cliente conectado: ${socket.id}`);

    socket.on("mensagem", (mensagem) => {
      const cliente = clientes.get(socket.id);

      // LOGIN
      if (!cliente) {
        const nome = mensagem.trim().replace(/,/g, "");
        const nomesExistentes = [...clientes.values()].map((c) => c.nome);

        if (!nome || nomesExistentes.includes(nome)) {
          socket.emit(
            "mensagem",
            createMessage({
              type: "login",
              content: comandos.LOGIN_NEGADO,
            })
          );
        } else {
          clientes.set(socket.id, {
            nome,
            socket,
            isLoggedIn: true,
            destinatarioPrivado: null,
          });

          socket.emit(
            "mensagem",
            createMessage({
              type: "login",
              content: comandos.LOGIN_ACEITO,
            })
          );

          socket.emit(
            "mensagem",
            createMessage({
              type: "system",
              content: `Olá ${nome}`,
            })
          );

          console.log(`[LOGIN] ${nome} entrou.`);

          // Notifica os outros
          for (const c of clientes.values()) {
            if (c.isLoggedIn && c.socket.id !== socket.id) {
              c.socket.emit(
                "mensagem",
                createMessage({
                  type: "system",
                  author: nome,
                  content: `${nome} entrou no chat.`,
                })
              );
            }
          }
          broadcastUserList();
        }
        return;
      }

      const clienteAtual = clientes.get(socket.id);
      const { nome, isLoggedIn } = clienteAtual;
      if (!isLoggedIn) return;

      // SAIR
      if (mensagem === comandos.SAIR) {
        socket.disconnect();
        return;
      }

      // LISTA DE CLIENTES
      if (mensagem === comandos.LISTA_USUARIOS) {
        const lista = [...clientes.values()].map((c) => c.nome).join(", ");
        socket.emit(
          "mensagem",
          createMessage({
            type: "system",
            content: `Usuários online: ${lista}`,
          })
        );
        return;
      }

      // COMANDO /tell <nome>
      if (mensagem.startsWith(comandos.MENSAGEM)) {
        const nomeDest = mensagem.slice(comandos.MENSAGEM.length).trim();
        const destino = [...clientes.values()].find((c) => c.nome === nomeDest);

        if (!destino) {
          socket.emit(
            "mensagem",
            createMessage({
              type: "system",
              content: `Usuário ${nomeDest} não encontrado.`,
            })
          );
        } else {
          clienteAtual.destinatarioPrivado = nomeDest;

          socket.emit(
            "mensagem",
            createMessage({
              type: "internal",
              content: `Digite a mensagem para ${nomeDest}:`,
            })
          );
        }
        return;
      }

      // MENSAGEM PRIVADA se destinatário estiver setado
      if (clienteAtual.destinatarioPrivado) {
        const nomeDest = clienteAtual.destinatarioPrivado;
        const destino = [...clientes.values()].find((c) => c.nome === nomeDest);

        if (destino && destino.isLoggedIn) {
          const msgPrivada = createMessage({
            type: "private",
            author: nome,
            recipient: nomeDest,
            content: mensagem,
          });

          destino.socket.emit("mensagem", msgPrivada); // para o destinatário
          socket.emit("mensagem", msgPrivada); // feedback para o remetente
        }

        clienteAtual.destinatarioPrivado = null; // limpa o estado
        return;
      }

      // MENSAGEM PÚBLICA
      const msgPublica = createMessage({
        type: "message",
        author: nome,
        content: mensagem,
      });

      for (const c of clientes.values()) {
        if (c.isLoggedIn) {
          c.socket.emit("mensagem", msgPublica);
        }
      }
    });

    socket.on("disconnect", () => {
      const cliente = clientes.get(socket.id);

      if (cliente && cliente.isLoggedIn) {
        console.log(`[-] ${cliente.nome} saiu.`);

        for (const c of clientes.values()) {
          if (c.isLoggedIn) {
            c.socket.emit(
              "mensagem",
              createMessage({
                type: "logout",
                author: cliente.nome,
                content: `${cliente.nome} saiu do chat.`,
              })
            );
          }
        }
      }

      clientes.delete(socket.id);
      broadcastUserList();
    });
  });
}

module.exports = configurarSockets;
