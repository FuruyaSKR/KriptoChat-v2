import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface LoginModalProps {
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  onLogin: () => void;
}

export default function LoginModal({ nickname, setNickname, onLogin }: LoginModalProps) {
  return (
    <Modal open>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: 300,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Bem-vindo ao KriptoChat
        </Typography>

        <TextField
          fullWidth
          label="Digite seu nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onLogin}
          disabled={!nickname.trim()}
        >
          Entrar
        </Button>
      </Box>
    </Modal>
  );
}
