// src/layouts/ChatLayout.tsx
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface ChatLayoutProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  footer?: ReactNode;
}

export default function ChatLayout({
  left,
  center,
  right,
  footer,
}: ChatLayoutProps) {
  return (
    <Box
      display="flex"
      height="100vh"
      width="100%"
      overflow="hidden"
      sx={{ backgroundColor: "#25232D" }}
    >
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        {left}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        overflow="hidden"
        sx={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box flex={1} overflow="hidden" padding={2}>
          {center}
        </Box>

        <Box>{footer}</Box>
      </Box>

      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        {right}
      </Box>
    </Box>
  );
}
