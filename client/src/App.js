import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SnackbarProvider, useSnackbar } from 'notistack';
import CryptoJS from 'crypto-js';
import Home from './pages/Home';

const socketURL = 'http://localhost:8888';

function gerarChaveAES() {
  const chave = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);
  return { chave, iv };
}

function criptografarAES(texto, chave, iv) {
  const encrypted = CryptoJS.AES.encrypt(texto, chave, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

function descriptografarAES({ content, chave, iv }) {
  const key = CryptoJS.enc.Hex.parse(chave);
  const ivBytes = CryptoJS.enc.Hex.parse(iv);
  const encrypted = CryptoJS.enc.Hex.parse(content);
  const ciphertext = CryptoJS.lib.CipherParams.create({
    ciphertext: encrypted,
  });

  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: ivBytes,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

function Chat() {
  const socket = useRef(null);
  const chatEndRef = useRef(null);
  const nicknameRef = useRef('');
  const { enqueueSnackbar } = useSnackbar();

  const [nickname, setNickname] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateChats, setPrivateChats] = useState({});
  const [useCrypto, setUseCrypto] = useState(false);

  useEffect(() => {
    if (socket.current) return;

    socket.current = io(socketURL);

    socket.current.on('mensagem', (msg) => {
      if (msg.type === 'internal') return;

      if (msg.type === 'login') {
        enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });
        socket.current.emit('mensagem', '/lista clientes');
        return;
      }

      if (msg.type === 'system' && msg.content.startsWith('Usuários online: ')) {
        const nomes = msg.content
          .replace('Usuários online: ', '')
          .split(', ')
          .filter((nome) => nome && nome !== nicknameRef.current);

        setOnlineUsers(nomes.length > 0 ? nomes : []);
        return;
      }

      if (msg.type === 'private') {
        const outroUsuario = msg.author === nickname ? msg.recipient : msg.author;

        setPrivateChats((prev) => ({
          ...prev,
          [outroUsuario]: [...(prev[outroUsuario] || []), msg],
        }));
        return;
      }

      setChat((prev) => [...prev, msg]);
    });
  }, [nickname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, privateChats]);

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;

    if (selectedUser) {
      const comando = useCrypto ? `/tellcript ${selectedUser}` : `/tell ${selectedUser}`;

      socket.current.emit('mensagem', comando);

      socket.current.once('mensagem', () => {
        socket.current.emit('mensagem', mensagem);

        const minhaMsg = {
          type: 'private',
          author: nickname,
          content: mensagem,
          recipient: selectedUser,
          timestamp: Date.now(),
          ...(useCrypto && { encrypted: true }),
        };

        setPrivateChats((prev) => ({
          ...prev,
          [selectedUser]: [...(prev[selectedUser] || []), minhaMsg],
        }));

        setMensagem('');
      });
      return;
    }

    socket.current.emit('mensagem', mensagem);
    setMensagem('');
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    nicknameRef.current = e.target.value;
  };

  const handleLogin = () => {
    if (nickname.trim()) {
      socket.current.emit('mensagem', nickname);
      setLoggedIn(true);
    }
  };

  const iniciarChatPrivado = (user) => {
    setSelectedUser(user);
    if (!privateChats[user]) {
      setPrivateChats((prev) => ({ ...prev, [user]: [] }));
    }
  };

  const toggleDecrypt = (msg, idx) => {
    if (!msg.iv || !msg.chave) return;

    try {
      const texto = descriptografarAES({
        content: msg.content,
        chave: msg.chave,
        iv: msg.iv,
      });

      setPrivateChats((prev) => {
        const usuario = selectedUser;
        const novo = [...(prev[usuario] || [])];
        novo[idx] = { ...msg, content: texto, iv: null, chave: null };
        return { ...prev, [usuario]: novo };
      });
    } catch {
      enqueueSnackbar('Erro ao descriptografar a mensagem', {
        variant: 'error',
      });
    }
  };

  const renderMessage = (msg, idx) => {
    const time = new Date(msg.timestamp).toLocaleTimeString();
    const isOwnMessage = msg.author === nickname;

    const messageStyle = {
      display: 'flex',
      justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
      marginBottom: 6,
    };

    const bubbleStyle = {
      maxWidth: '70%',
      padding: '8px 12px',
      borderRadius: 10,
      background: isOwnMessage ? '#cce5ff' : '#f0ddee',
      textAlign: 'left',
      color: '#000',
      fontSize: 14,
      cursor: msg.iv && msg.chave ? 'pointer' : 'default',
    };

    switch (msg.type) {
      case 'system':
        return (
          <div key={idx} style={{ color: '#555', fontStyle: 'italic' }}>
            [{time}] 💬 <strong>Sistema:</strong> {msg.content}
          </div>
        );
      case 'login':
        return (
          <div key={idx} style={{ color: 'green' }}>
            [{time}] ✅ {msg.content}
          </div>
        );
      case 'logout':
        return (
          <div key={idx} style={{ color: 'red' }}>
            [{time}] 🚪 <strong>{msg.author}</strong> saiu do chat.
          </div>
        );
      case 'private':
        const isEncrypted = msg.iv && msg.chave;

        const encryptedStyle = {
          background: '#ffe0b3',
          whiteSpace: 'pre-wrap',
          cursor: isEncrypted ? 'pointer' : 'default',
          border: '1px dashed #c48f00',
          display: 'flex',
          gap: '8px',
        };

        return (
          <div key={idx} style={messageStyle}>
            <div
              style={{ ...bubbleStyle, ...(isEncrypted ? encryptedStyle : {}) }}
              onClick={() => isEncrypted && toggleDecrypt(msg, idx)}
              title={isEncrypted ? 'Clique para ver a mensagem' : undefined}
            >
              {/* COLUNA 1: Nome */}
              <div
                style={{
                  fontWeight: 'bold',
                  minWidth: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {msg.author}
              </div>

              {/* COLUNA 2: Mensagem */}
              <div>
                {isEncrypted ? (
                  <>
                    <div>🔐 Clique para descriptografar</div>
                    <div>{msg.content.slice(0, 12)}...</div>
                  </>
                ) : (
                  <div>{msg.content}</div>
                )}
              </div>
            </div>
          </div>
        );
      case 'message':
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
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
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
          <h2>Chat {selectedUser ? `(privado com ${selectedUser})` : '(público)'}</h2>

          {onlineUsers.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <strong>Usuários online:</strong>
              {onlineUsers.map((user) => (
                <button
                  key={user}
                  onClick={() => iniciarChatPrivado(user)}
                  style={{
                    marginRight: 8,
                    padding: '2px 6px',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  {user}
                </button>
              ))}
              {selectedUser && (
                <button onClick={() => setSelectedUser(null)} style={{ marginLeft: 10 }}>
                  Voltar ao chat público
                </button>
              )}
            </div>
          )}

          <div
            style={{
              border: '1px solid #ccc',
              padding: 10,
              height: 300,
              overflowY: 'scroll',
              backgroundColor: '#f9f9f9',
              marginBottom: 10,
            }}
          >
            {selectedUser
              ? (privateChats[selectedUser] || []).map(renderMessage)
              : chat.map(renderMessage)}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={{ flex: 1 }}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
            />
            <button onClick={enviarMensagem}>Enviar</button>
            {selectedUser && (
              <button onClick={() => setUseCrypto(!useCrypto)}>
                {!useCrypto ? '🔓 Simples' : '🔐 Criptografado'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      {/* <Chat /> */}
      <Home />
    </SnackbarProvider>
  );
}
