import { Box, Divider, Typography } from "@mui/material";
import AdBet1 from "../../assets/AdBet1.gif";
import AdBet2 from "../../assets/AdBet2.gif";
import KriptoChat from "../../assets/KriptoChat.png";

export default function AdsPanel() {
  return (
    <Box
      sx={{
        width: "100%",
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
      <Box
        component="img"
        src={KriptoChat}
        alt="Kripto Chat Logo"
        sx={{
          width: "60%",
          height: "auto",
          objectFit: "contain",
          flexShrink: 0,
        }}
      />

      <Divider sx={{ width: "100%", bgcolor: "rgba(0, 0, 0, 0.23)" }} />

      <Box sx={{ width: "100%", px: 0 }}>
        <Box
          sx={{
            backgroundColor: "#26232F",
            borderRadius: 1,
            p: "11px 22px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            color="white"
            fontSize={16}
            fontWeight={700}
            fontFamily="Inter"
          >
            PUBLICIDADE
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={AdBet1}
          alt="Ad 1"
          sx={{
            height: "50%",
            flex: 1,
            objectFit: "cover",
            objectPosition: "bottom",
            borderRadius: "10px",
            border: "3px solid #171A2C",
          }}
        />
        <Box
          component="img"
          src={AdBet2}
          alt="Ad 2"
          sx={{
            height: "50%",
            flex: 1,
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "10px",
            border: "3px solid #171A2C",
          }}
        />
      </Box>
    </Box>
  );
}
