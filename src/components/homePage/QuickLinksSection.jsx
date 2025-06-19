import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { sectionColors } from "../../constants/sectionMeta";
import RoundedButton from "../Buttons/RoundedButton";

export default function SectionGrid({ sections }) {
  const navigate = useNavigate();
  const sectionColor = "linear-gradient(180deg, #00b0f0 0%, #003366 100%)"; // You can choose a fixed color or pass one in

  return (
<Box sx={{ px: { xs: 2, md: 6 }, pt: 0, pb: 1}}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            position: "relative",
            borderRadius: "28px",
            p: { xs: 2, sm: 2 },
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            overflow: "hidden",
            direction: "rtl",
          }}
        >
          {/* Top-Right Title Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              height: { xs: "40px", sm: "40px" },
              minWidth: "fit-content",
              padding: "0 20px",
              background: sectionColor, // ✅ use gradient directly
              borderBottomLeftRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              zIndex: 2,
              textAlign: "center",
              whiteSpace: "nowrap",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            أقسام المركز
          </Box>

          {/* Card Body */}
          <Box sx={{ pt: { xs: 5, sm: 6 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              {sections.map((section, index) => {
                const color = sectionColors[section.id] || " #00b0f0";
 return (
    <RoundedButton
      label={section.title}
      color={color}
      onClick={() => navigate(`/sections/${section.id}`)}
      index={index}
    />
  );
              })}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
