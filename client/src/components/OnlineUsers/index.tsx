import { Box, Divider, Typography, Avatar, Stack } from "@mui/material";
import {
  deepPurple,
  pink,
  teal,
  orange,
  indigo,
  green,
  blueGrey,
} from "@mui/material/colors";

interface OnlineUsersProps {
  users: string[];
  selectedUser: string | null;
  onSelect: (user: string | null) => void;
  nickname: string;
}

const avatarColors = [
  deepPurple[500],
  pink[500],
  teal[500],
  orange[500],
  indigo[500],
  green[500],
  blueGrey[500],
];

function getInitials(name: string) {
  const [first = "", second = ""] = name.split(" ");
  return (first[0] || "") + (second[0] || "");
}

function getColor(name: string) {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
}

export default function OnlineUsersPanel({
  users,
  selectedUser,
  onSelect,
  nickname,
}: OnlineUsersProps) {
  return (
    <Box
      sx={{
        width: "270px",
        height: "97vh",
        maxWidth: "270px",
        padding: "26px 20px",
        background: "linear-gradient(180deg, #4B455E 0%, #383446 100%)",
        boxShadow: "-4px 4px 9px rgba(0, 0, 0, 0.25) inset",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "26px",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            backgroundColor: "#26232F",
            borderRadius: 1,
            p: "11px 22px",
            textAlign: "center",
            flexShrink: 0,
            width: "auto",
          }}
        >
          <Typography
            color="white"
            fontSize={16}
            fontWeight={700}
            fontFamily="Inter"
          >
            Usuários On-line
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ width: "100%", bgcolor: "rgba(0, 0, 0, 0.23)" }} />

      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {users
          .filter((user) => user !== nickname)
          .map((user) => {
            const initials = getInitials(user);
            const color = getColor(user);

            return (
              <Box
                key={user}
                sx={{
                  width: "auto",
                  display: "flex",
                  alignItems: "center",
                  background: "#C9C9C9",
                  borderRadius: 2,
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  border: "1px solid black",
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                }}
                onClick={() => onSelect(user)}
              >
                <Avatar
                  sx={{
                    bgcolor: color,
                    width: 56,
                    height: 56,
                    fontWeight: 500,
                    fontSize: 22,
                    mr: 2,
                  }}
                >
                  {initials}
                </Avatar>
                <Box>
                  <Typography fontWeight={700} fontSize={16} color="#2D2D2D">
                    {user}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 10.67,
                        height: 10.67,
                        bgcolor: "#139827",
                        border: "1px solid #24572F",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography color="#7C7C7C" fontSize={12} fontWeight={700}>
                      Online agora
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            );
          })}
      </Box>
      {selectedUser && (
        <Typography
          onClick={() => onSelect(null)}
          sx={{
            color: "#fff",
            fontSize: 14,
            mt: 2,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Voltar ao chat público
        </Typography>
      )}
    </Box>
  );
}
