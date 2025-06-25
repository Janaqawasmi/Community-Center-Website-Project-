import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function GradientSearchBar({
  label = "بحث سريع",
  placeholder = "ابحث...",
  searchQuery,
  onChange,
}) {
  return (
    <Box
      sx={{
        background: "#003366",
        borderRadius: "18px",           // 🔽 slightly reduced
        padding: "3px 6px",             // 🔽 tighter padding
        display: "flex",
        alignItems: "center",
        gap: 1,
        maxWidth: 440,                  // 🔽 slightly narrower
        mx: "auto",
        my: 1,
      }}
    >
      <Typography
        sx={{
          color: "white",
          fontWeight: "bold",
          fontSize: "13px",             // 🔽 smaller font
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>

      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchQuery}
        onChange={onChange}
        variant="outlined"
        dir="rtl"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "rgba(0, 0, 0, 0.7)", fontSize: 16 }} />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: "#fff",
            borderRadius: "18px",       // 🔽 matches outer radius
            fontSize: "0.85rem",        // 🔽 input text slightly smaller
            height: "34px",             // 🔽 slightly shorter
            px: 1.2,
            "& fieldset": {
              border: "none",
            },
          },
        }}
      />
    </Box>
  );
}
