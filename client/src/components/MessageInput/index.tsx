import { Box, Button, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SendIcon from '@mui/icons-material/Send';

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
    if (e.key === 'Enter') onSend();
  };

  return (
    <Box display="flex" gap={2}>
      <TextField
        fullWidth
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite uma mensagem..."
        InputProps={{
          endAdornment: selectedUser && (
            <InputAdornment position="end">
              <Tooltip title={useCrypto ? 'Modo criptografado' : 'Modo simples'}>
                <IconButton onClick={() => setUseCrypto(!useCrypto)}>
                  {useCrypto ? <LockIcon color="primary" /> : <LockOpenIcon />}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onSend}
        endIcon={<SendIcon />}
        disabled={!mensagem.trim()}
      >
        Enviar
      </Button>
    </Box>
  );
}
