import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, IconButton } from "@mui/material";

function CreditInfo() {
  return (
    <Tooltip
      title="Designed & developed by Rishabh Tiwari with AI-assisted engineering."
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "#111",
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.75rem",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          },
        },
        arrow: {
          sx: {
            color: "#111",
          },
        },
      }}
    >
      <IconButton
        size="small"
        sx={{
          position: "absolute",
          top: "16px",
          right: "20px",
          color: "rgba(255,255,255,0.4)",
          "&:hover": {
            color: "rgba(255,255,255,0.8)",
          },
        }}
      >
        <InfoOutlinedIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
}

export default CreditInfo;
