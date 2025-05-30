import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { sectionColors } from "../../constants/sectionMeta";

export default function SectionGrid({ sections }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 10 }}>
      {/* Section Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        sx={{ fontFamily: "Cairo, sans-serif" }}
      >
        أقسام المركز
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
          gap: 3,
        }}
      >
        {sections.map((section, index) => {
          const color = sectionColors[section.id] || "#00b0f0";

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={() => navigate(`/sections/${section.id}`)}
                sx={{
                  borderRadius: "90px",
                  px: 3,
                  py: 1.5,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRight: `6px solid ${color}`,
                  backgroundColor: "#fff",
                  transition: "0.3s",
                  width: "100%",
                  minHeight: "55px",      // ✅ fixed height
                  height: "55px",         // ✅ ensures all buttons match
                  boxShadow: 1,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    transform: "translateY(-2px)",
                    borderRight: `6px solid ${color}`, // ✅ explicitly keep the border color on hover

                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: "black",
                    fontFamily: "Cairo, sans-serif",
                    whiteSpace: "nowrap",   // ✅ prevent wrapping
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {section.title}
                </Typography>
                <Box
                  sx={{
                    mr: 2, // ✅ add consistent space between text and icon
                  }}
                >
                  <Typography fontSize="1.2rem" fontWeight="bold" color={color}>
                    &lt;
                  </Typography>
                </Box>
              </Button>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}
