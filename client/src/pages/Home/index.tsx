// src/pages/Home.tsx
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { io, Socket } from 'socket.io-client';

import LoginModal from '../../components/LoginModal';
import OnlineUsers from '../../components/OnlineUsers';
import ChatBox from '../../components/ChatBox';
import MessageInput from '../../components/MessageInput';

const socketURL = 'http://localhost:8888';

export default function Home() {
  const socket = useRef<Socket | null>(null);
  const nicknameRef = useRef('');
  const { enqueueSnackbar } = useSnackbar();

  const [nickname, setNickname] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [chat, setChat] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [privateChats, setPrivateChats] = useState<Record<string, any[]>>({});
  const [useCrypto, setUseCrypto] = useState(false);

  useEffect(() => {
    if (socket.current) return;

    socket.current = io(socketURL);

    socket.current.on('mensagem', (msg) => {
      if (msg.type === 'internal') return;

      if (msg.type === 'login') {
        enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });
        socket.current?.emit('mensagem', '/lista clientes');
        return;
      }

      if (msg.type === 'system' && msg.content.startsWith('Usuários online: ')) {
        const nomes = msg.content
          .replace('Usuários online: ', '')
          .split(', ')
          .filter((nome: string) => nome && nome !== nicknameRef.current);

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

  const handleLogin = () => {
    if (nickname.trim()) {
      socket.current?.emit('mensagem', nickname);
      setLoggedIn(true);
    }
  };

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;

    if (selectedUser) {
      const comando = useCrypto ? `/tellcript ${selectedUser}` : `/tell ${selectedUser}`;
      socket.current?.emit('mensagem', comando);

      socket.current?.once('mensagem', () => {
        socket.current?.emit('mensagem', mensagem);

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

    socket.current?.emit('mensagem', mensagem);
    setMensagem('');
  };

  return (
    <>
      {!loggedIn ? (
        <LoginModal nickname={nickname} setNickname={setNickname} onLogin={handleLogin} />
      ) : (
        <>
          <OnlineUsers users={onlineUsers} selectedUser={selectedUser} onSelect={setSelectedUser} />

          <ChatBox
            chat={chat}
            privateChats={privateChats}
            selectedUser={selectedUser}
            nickname={nickname}
          />

          <MessageInput
            mensagem={mensagem}
            setMensagem={setMensagem}
            onSend={enviarMensagem}
            useCrypto={useCrypto}
            setUseCrypto={setUseCrypto}
            selectedUser={selectedUser}
          />
        </>
      )}
    </>
  );
}
