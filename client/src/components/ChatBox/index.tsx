import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

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
  onDecrypt: (msg: Mensagem, idx: number) => void;
  selectedUser: string | null;
  nickname: string;
}

export default function ChatBox({
  chat,
  privateChats,
  selectedUser,
  nickname,
  onDecrypt,
}: ChatBoxProps) {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, privateChats]);

  const renderMessage = (msg: Mensagem, idx: number) => {
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
      background: isOwnMessage ? "#cce5ff" : "#f0ddee",
      textAlign: "left" as const,
      color: "#000",
      fontSize: 14,
      cursor: msg.iv && msg.chave ? "pointer" : "default",
    };

    switch (msg.type) {
      case "system":
        return (
          <Typography
            key={idx}
            fontStyle="italic"
            color="text.secondary"
            variant="body2"
          >
            [{time}] 💬 <strong>Sistema:</strong> {msg.content}
          </Typography>
        );
      case "login":
        return (
          <Typography key={idx} color="success.main" variant="body2">
            [{time}] ✅ {msg.content}
          </Typography>
        );
      case "logout":
        return (
          <Typography key={idx} color="error.main" variant="body2">
            [{time}] 🚪 <strong>{msg.author}</strong> saiu do chat.
          </Typography>
        );
      case "private": {
        const isEncrypted = msg.iv && msg.chave;
        const isOwnMessage = msg.author === nickname;
        const isOwnEncrypted = isEncrypted && isOwnMessage;

        return (
          <div key={idx} style={messageStyle}>
            <Box
              sx={{
                ...bubbleStyle,
                ...(isEncrypted && {
                  backgroundColor: isOwnEncrypted ? "#d6f5ff" : "#ffe0b3",
                  border: "1px dashed",
                  borderColor: isOwnEncrypted ? "#2b92a7" : "#c48f00",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }),
              }}
              title={
                isEncrypted
                  ? isOwnEncrypted
                    ? "🔐 Você enviou uma mensagem criptografada"
                    : "🔐 Mensagem criptografada recebida"
                  : undefined
              }
              onClick={() =>
                isEncrypted && !isOwnEncrypted && onDecrypt(msg, idx)
              }
            >
              <Box fontWeight="bold" minWidth={80}>
                {msg.author}
              </Box>

              <Box>
                {isEncrypted ? (
                  <>
                    {isOwnEncrypted ? (
                      <>
                        <Typography variant="body2">
                          🔐 Mensagem criptografada
                        </Typography>
                        <Typography variant="body2">
                          {msg.content.slice(0, 12)}...
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2">
                          🔐 Clique para descriptografar
                        </Typography>
                        <Typography variant="body2">
                          {msg.content.slice(0, 12)}...
                        </Typography>
                      </>
                    )}
                  </>
                ) : (
                  <Typography variant="body2">{msg.content}</Typography>
                )}
              </Box>
            </Box>
          </div>
        );
      }

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

  const mensagens = selectedUser ? privateChats[selectedUser] || [] : chat;

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          padding: "26px 20px",
          backgroundColor: "#898592",
          borderRadius: "12px",
          outline: "6px solid #3B3847",
          outlineOffset: "-3px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Martyric Personal Use Only",
            fontSize: 113,
            color: "rgba(255, 255, 255, 0.65)",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            opacity: 0.06,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          Kripto Chat
        </Box>

        <Box
          sx={{
            zIndex: 1,
            flexGrow: 1,
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          {mensagens.map(renderMessage)}
          <div ref={chatEndRef} />
        </Box>
      </Box>
    </Box>
  );
}
