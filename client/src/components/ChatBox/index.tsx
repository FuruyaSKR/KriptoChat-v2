import { Box, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

interface Mensagem {
  type: string;
  author: string;
  content: string;
  timestamp: number;
  iv?: string;
  chave?: string;
}

interface ChatBoxProps {
  chat: Mensagem[];
  privateChats: Record<string, Mensagem[]>;
  selectedUser: string | null;
  nickname: string;
}

export default function ChatBox({ chat, privateChats, selectedUser, nickname }: ChatBoxProps) {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, privateChats]);

  const renderMessage = (msg: Mensagem, idx: number) => {
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
      textAlign: 'left' as const,
      color: '#000',
      fontSize: 14,
      cursor: msg.iv && msg.chave ? 'pointer' : 'default',
    };

    switch (msg.type) {
      case 'system':
        return (
          <Typography key={idx} fontStyle="italic" color="text.secondary" variant="body2">
            [{time}] 💬 <strong>Sistema:</strong> {msg.content}
          </Typography>
        );
      case 'login':
        return (
          <Typography key={idx} color="success.main" variant="body2">
            [{time}] ✅ {msg.content}
          </Typography>
        );
      case 'logout':
        return (
          <Typography key={idx} color="error.main" variant="body2">
            [{time}] 🚪 <strong>{msg.author}</strong> saiu do chat.
          </Typography>
        );
      case 'private': {
        const isEncrypted = msg.iv && msg.chave;
        return (
          <div key={idx} style={messageStyle}>
            <Box
              sx={{
                ...bubbleStyle,
                ...(isEncrypted && {
                  backgroundColor: '#ffe0b3',
                  border: '1px dashed #c48f00',
                  display: 'flex',
                  gap: '8px',
                }),
              }}
              title={isEncrypted ? '🔐 Mensagem criptografada' : undefined}
            >
              <Box fontWeight="bold" minWidth={80}>
                {msg.author}
              </Box>
              <Box>
                {isEncrypted ? (
                  <>
                    <div>🔐 Clique para descriptografar</div>
                    <div>{msg.content.slice(0, 12)}...</div>
                  </>
                ) : (
                  <div>{msg.content}</div>
                )}
              </Box>
            </Box>
          </div>
        );
      }
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

  const mensagens = selectedUser ? privateChats[selectedUser] || [] : chat;

  return (
    <Box
      border="1px solid #ccc"
      borderRadius={2}
      padding={2}
      height={300}
      overflow="auto"
      bgcolor="#f9f9f9"
      mb={2}
    >
      {mensagens.map(renderMessage)}
      <div ref={chatEndRef} />
    </Box>
  );
}
