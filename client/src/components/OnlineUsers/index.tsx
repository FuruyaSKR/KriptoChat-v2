import { Box, Button, Stack, Typography } from '@mui/material';

interface OnlineUsersProps {
  users: string[];
  selectedUser: string | null;
  onSelect: (user: string | null) => void;
}

export default function OnlineUsers({ users, selectedUser, onSelect }: OnlineUsersProps) {
  if (users.length === 0) return null;

  return (
    <Box mb={2}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Usuários online:
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {users.map((user) => (
          <Button
            key={user}
            variant={selectedUser === user ? 'contained' : 'outlined'}
            size="small"
            onClick={() => onSelect(user)}
          >
            {user}
          </Button>
        ))}

        {selectedUser && (
          <Button variant="text" size="small" onClick={() => onSelect(null)} sx={{ ml: 1 }}>
            Voltar ao chat público
          </Button>
        )}
      </Stack>
    </Box>
  );
}
