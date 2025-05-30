import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { sectionColors } from "../../constants/sectionMeta";

// Helper to darken color (copied from SectionPage)
function darkenColor(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) - amount * 255;
  let g = ((num >> 8) & 0x00ff) - amount * 255;
  let b = (num & 0x0000ff) - amount * 255;

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export default function SectionGrid({ sections }) {
  const navigate = useNavigate();
  const sectionColor = "linear-gradient(180deg, #00b0f0 0%, #003366 100%)"; // You can choose a fixed color or pass one in

  return (
<Box sx={{ px: { xs: 2, md: 6 }, pt: 1, pb: 4 }}>
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
            p: { xs: 3, sm: 4 },
            mt: 5,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            direction: "rtl",
            fontFamily: "Cairo, sans-serif",
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
              boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
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
                        minHeight: "55px",
                        height: "55px",
                        boxShadow: 1,
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          transform: "translateY(-2px)",
                          borderRight: `6px solid ${color}`,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          color: "black",
                          fontFamily: "Cairo, sans-serif",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {section.title}
                      </Typography>
                      <Box sx={{ mr: 2 }}>
                        <Typography
                          fontSize="1.2rem"
                          fontWeight="bold"
                          color={color}
                        >
                          &lt;
                        </Typography>
                      </Box>
                    </Button>
                  </motion.div>
                );
              })}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
