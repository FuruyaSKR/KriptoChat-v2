import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SendIcon from "@mui/icons-material/Send";

interface MessageInputProps {
  mensagem: string;
  setMensagem: (value: string) => void;
  onSend: () => void;
  useCrypto: boolean;
  setUseCrypto: (value: boolean) => void;
  selectedUser: string | null;
}

export default function MessageInput({
  mensagem,
  setMensagem,
  onSend,
  useCrypto,
  setUseCrypto,
  selectedUser,
}: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSend();
  };

  return (
    <Box
      sx={{
        height: 90,
        px: 3,
        py: 2.2,
        background: "#565168",
        borderTop: "4px solid #706D7C",
        display: "flex",
        alignItems: "center",
        gap: "22px",
      }}
    >
      <Box
        sx={{
          height: 46,
          width: 46,
          background: !selectedUser ? "#3B3847" : "#2D2A37",
          borderRadius: "50px",
          boxShadow: "0px 2px 16px 1px rgba(0, 0, 0, 0.12)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: !selectedUser ? 0.4 : 1,
          cursor: !selectedUser ? "not-allowed" : "pointer",
        }}
      >
        <Tooltip title={useCrypto ? "Modo criptografado" : "Modo simples"}>
          <IconButton
            onClick={() => setUseCrypto(!useCrypto)}
            disabled={!selectedUser}
            sx={{
              color: "white",
              "&.Mui-disabled": {
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            {useCrypto ? <LockIcon /> : <LockOpenIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <TextField
        fullWidth
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite uma mensagem..."
        variant="filled"
        InputProps={{
          disableUnderline: true,
        }}
        sx={{
          flex: 1,
          height: 67,
          "& .MuiFilledInput-root": {
            bgcolor: "#494558",
            borderRadius: 2,
            px: 3,
            height: "100%",
            color: "white",
            fontSize: 18,
            fontFamily: "Roboto",
          },
          "& .MuiFilledInput-root:hover": {
            bgcolor: "#494558",
          },
          "& .MuiFilledInput-root.Mui-focused": {
            bgcolor: "#494558",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255, 255, 255, 0.56)",
            opacity: 1,
          },
          "& .MuiInputBase-input": {
            color: "white",
            padding: 0,
          },
        }}
      />

      <Box
        sx={{
          height: "48px",
          px: 2,
          background: "#2D2A37",
          borderRadius: "50px",
          boxShadow: "0px 2px 16px 1px rgba(0, 0, 0, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          cursor: mensagem.trim() ? "pointer" : "not-allowed",
          opacity: mensagem.trim() ? 1 : 0.4,
        }}
        onClick={mensagem.trim() ? onSend : undefined}
      >
        <Typography
          color="white"
          fontSize={15}
          fontWeight={500}
          fontFamily="Roboto"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Enviar
        </Typography>
        <SendIcon sx={{ color: "white", ml: 0.5 }} />
      </Box>
    </Box>
  );
}
