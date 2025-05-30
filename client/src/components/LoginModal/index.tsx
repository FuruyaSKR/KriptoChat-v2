import { Box, Modal, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import SendIcon from "@mui/icons-material/Send";
import KriptoBg from "../../assets/LoginBackground.png";

interface LoginModalProps {
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  onLogin: () => void;
}

export default function LoginModal({
  nickname,
  setNickname,
  onLogin,
}: LoginModalProps) {
  const handleLoginClick = () => {
    if (!nickname.trim()) return;
    onLogin();
  };

  return (
    <Modal open>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          background: "#25232D",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={KriptoBg}
          alt="Kripto Chat Logo"
          sx={{
            objectFit: "contain",
            height: "100%",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            zIndex: 1,
            textAlign: "center",
            px: 2,
            width: "600px",
          }}
        >
          <Typography
            sx={{
              color: "#3D364A",
              fontSize: 59,
              fontWeight: 700,
              fontFamily: "Inter",
            }}
          >
            Qual o seu nome?
          </Typography>

          <Box
            display="flex"
            gap={2}
            flexDirection={"row"}
            sx={{
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              fullWidth
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Digite seu nome..."
              variant="filled"
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                height: 67,
                maxWidth: 528,
                "& .MuiFilledInput-root": {
                  bgcolor: "rgba(0, 0, 0, 0.15)",
                  borderRadius: 2,
                  px: 3,
                  height: "100%",
                  color: "white",
                  fontSize: 18,
                  fontFamily: "Roboto",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.56)",
                  opacity: 1,
                },
                "& .MuiInputBase-input": {
                  color: "white",
                  padding: 0,
                },
                "& .MuiFilledInput-root::before, & .MuiFilledInput-root::after":
                  {
                    border: "none",
                  },
              }}
            />

            <Box
              sx={{
                height: 56,
                px: 2.5,
                background: "#2D2A37",
                borderRadius: "50px",
                boxShadow: "0px 2px 16px 1px rgba(0, 0, 0, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                cursor: nickname.trim() ? "pointer" : "not-allowed",
                opacity: nickname.trim() ? 1 : 0.4,
              }}
              onClick={nickname.trim() ? handleLoginClick : undefined}
            >
              <Typography
                color="white"
                fontSize={15}
                fontWeight={500}
                fontFamily="Roboto"
                sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
              >
                Entrar
              </Typography>
              <SendIcon sx={{ color: "white", ml: 0.5 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
