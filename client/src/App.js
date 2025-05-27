import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socketURL = "http://localhost:8888";

function App() {
  const socket = useRef(null);

  const [nickname, setNickname] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.current = io(socketURL);

    const handleMensagem = (msg) => {
      setChat((prev) => [...prev, msg]);
    };

    socket.current.on("mensagem", handleMensagem);

    return () => {
      socket.current.off("mensagem", handleMensagem);
      socket.current.disconnect(); // importante para evitar múltiplas conexões em hot reload
    };
  }, []);

  const enviarMensagem = () => {
    if (mensagem.trim()) {
      socket.current.emit("mensagem", mensagem);
      setMensagem("");
    }
  };

  const handleLogin = () => {
    if (nickname.trim()) {
      socket.current.emit("mensagem", nickname);
      setLoggedIn(true);
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
            onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={handleLogin}>Entrar</button>
        </>
      ) : (
        <>
          <h2>Chat</h2>
          <div
            style={{
              border: "1px solid #ccc",
              padding: 10,
              height: 300,
              overflowY: "scroll",
            }}
          >
            {chat.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
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

export default App;
