// src/components/Buttons/RoundedCButton.jsx
import React from "react";
import { Button, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function RoundedButton({
  label,
  onClick,
  color = " #003366",
  index = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Button
        onClick={onClick}
        disableElevation
        fullWidth
        sx={{
          borderRadius: "28px",
          px: 3,
          py: 1.5,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRight: " #003366 solid 6px",
          backgroundColor: "#fff",
          transition: "0.3s",
          width: "100%",
          minHeight: "55px",
          height: "55px",
          boxShadow: 1,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#f5f5f5",
            transform: "translateY(-2px)",
            borderRight: `6px solid ${color}`,
          },
        }}
        {...props}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "1.1rem",
            color: "black",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </Typography>
      </Button>
    </motion.div>
  );
}
