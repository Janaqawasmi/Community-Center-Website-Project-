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
          px: {xs:1,sm:2,md:2},
          py: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRight: " #003366 solid 5px",
          backgroundColor: "#fff",
          transition: "0.3s",
          width: "100%",
minHeight: { xs: "40px", sm: "50px", md: "50px" },
height: "auto",
          height: "auto",
          boxShadow: 1,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#f5f5f5",
            transform: "translateY(-2px)",
            borderRight: `5px solid ${color}`,
          },
        }}
        {...props}
      >
        <Typography
          sx={{
            fontWeight: "bold",
fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
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
