import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        py: 1.2,
        px: 2,
        position: "fixed",
        bottom: 0,
        left: 0,
        backdropFilter: "blur(6px)",
        background: "rgba(10, 10, 10, 0.6)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.4px",
        }}
      >
        Built by Rishabh Tiwari • Assisted by AI
      </Typography>
    </Box>
  );
}

export default Footer;
