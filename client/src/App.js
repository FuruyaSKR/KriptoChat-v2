import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SnackbarProvider, useSnackbar } from "notistack";

const socketURL = "http://localhost:8888";

function Chat() {
  const socket = useRef(null);
  const chatEndRef = useRef(null);
  const nicknameRef = useRef("");
  const { enqueueSnackbar } = useSnackbar();

  const [nickname, setNickname] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState([]); // chat público
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateChats, setPrivateChats] = useState({});

  useEffect(() => {
    if (socket.current) return;

    socket.current = io(socketURL);

    socket.current.on("mensagem", (msg) => {
      if (msg.type === "internal") {
        return;
      }
      if (msg.type === "login") {
        enqueueSnackbar("Login realizado com sucesso!", { variant: "success" });
        socket.current.emit("mensagem", "/lista clientes");
        return;
      }

      if (
        msg.type === "system" &&
        msg.content.startsWith("Usuários online: ")
      ) {
        const nomes = msg.content
          .replace("Usuários online: ", "")
          .split(", ")
          .filter((nome) => nome && nome !== nicknameRef.current);

        if (nomes.length > 0) {
          setOnlineUsers(nomes);
        } else {
          setOnlineUsers([]);
        }

        return;
      }

      if (msg.type === "private" && msg.author !== nickname) {
        setPrivateChats((prev) => ({
          ...prev,
          [msg.author]: [...(prev[msg.author] || []), msg],
        }));
        return;
      }

      setChat((prev) => [...prev, msg]);
    });
  }, [nickname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, privateChats]);

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;

    // Envio privado
    if (selectedUser) {
      socket.current.emit("mensagem", `/tell ${selectedUser}`);
      socket.current.once("mensagem", () => {
        socket.current.emit("mensagem", mensagem);

        const minhaMsg = {
          type: "private",
          author: nickname,
          content: mensagem,
          recipient: selectedUser,
          timestamp: Date.now(),
        };

        setPrivateChats((prev) => ({
          ...prev,
          [selectedUser]: [...(prev[selectedUser] || []), minhaMsg],
        }));

        setMensagem("");
      });
      return;
    }

    // Envio público
    socket.current.emit("mensagem", mensagem);
    setMensagem("");
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    nicknameRef.current = e.target.value;
  };

  const handleLogin = () => {
    if (nickname.trim()) {
      socket.current.emit("mensagem", nickname);
      setLoggedIn(true);
    }
  };

  const iniciarChatPrivado = (user) => {
    setSelectedUser(user);
    if (!privateChats[user]) {
      setPrivateChats((prev) => ({ ...prev, [user]: [] }));
    }
  };

  const renderMessage = (msg, idx) => {
    const time = new Date(msg.timestamp).toLocaleTimeString();
    const isOwnMessage = msg.author === nickname;

    const messageStyle = {
      display: "flex",
      justifyContent: isOwnMessage ? "flex-end" : "flex-start",
      marginBottom: 6,
    };

    const bubbleStyle = {
      maxWidth: "70%",
      padding: "8px 12px",
      borderRadius: 10,
      background: isOwnMessage ? "#cce5ff" : "#e2e2e2",
      textAlign: "left",
      color: "#000",
      fontSize: 14,
    };

    switch (msg.type) {
      case "system":
        return (
          <div key={idx} style={{ color: "#555", fontStyle: "italic" }}>
            [{time}] 💬 <strong>Sistema:</strong> {msg.content}
          </div>
        );
      case "login":
        return (
          <div key={idx} style={{ color: "green" }}>
            [{time}] ✅ {msg.content}
          </div>
        );
      case "logout":
        return (
          <div key={idx} style={{ color: "red" }}>
            [{time}] 🚪 <strong>{msg.author}</strong> saiu do chat.
          </div>
        );
      case "private":
        return (
          <div key={idx} style={messageStyle}>
            <div style={{ ...bubbleStyle, background: "#f0ddee" }}>
              🔒 <strong>{msg.author}</strong>: {msg.content}
            </div>
          </div>
        );
      case "message":
      default:
        return (
          <div key={idx} style={messageStyle}>
            <div style={bubbleStyle}>
              <strong>{msg.author}</strong>: {msg.content}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      {!loggedIn ? (
        <>
          <h2>Login</h2>
          <input
            placeholder="Digite seu nickname"
            value={nickname}
            onChange={handleNicknameChange}
          />
          <button onClick={handleLogin}>Entrar</button>
        </>
      ) : (
        <>
          <h2>
            Chat {selectedUser ? `(privado com ${selectedUser})` : "(público)"}
          </h2>

          {onlineUsers.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <strong>Usuários online:</strong>
              {onlineUsers.map((user) => (
                <button
                  key={user}
                  onClick={() => iniciarChatPrivado(user)}
                  style={{
                    marginRight: 8,
                    padding: "2px 6px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  {user}
                </button>
              ))}
              {selectedUser && (
                <button
                  onClick={() => setSelectedUser(null)}
                  style={{ marginLeft: 10 }}
                >
                  Voltar ao chat público
                </button>
              )}
            </div>
          )}

          <div
            style={{
              border: "1px solid #ccc",
              padding: 10,
              height: 300,
              overflowY: "scroll",
              backgroundColor: "#f9f9f9",
              marginBottom: 10,
            }}
          >
            {selectedUser
              ? (privateChats[selectedUser] || []).map(renderMessage)
              : chat.map(renderMessage)}
            <div ref={chatEndRef} />
          </div>

          <input
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
          />
          <button onClick={enviarMensagem}>Enviar</button>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Chat />
    </SnackbarProvider>
  );
}
