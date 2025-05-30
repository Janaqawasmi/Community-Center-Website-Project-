import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function QuickLinksSection({ sections }) {
  const navigate = useNavigate();

  // ✅ open by default
  const [showSections, setShowSections] = useState(true);

  const handleToggleSections = () => {
    setShowSections((prev) => !prev);
  };

  return (
    <Box sx={{ my: 10, px: { xs: 2, md: 10 } }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        sx={{ fontFamily: "Cairo, sans-serif" }}
      >
        روابط سريعة
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
          gap: 4,
          alignItems: "flex-start",
        }}
      >
        {/* كل الأقسام button + dropdown */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Button
              onClick={handleToggleSections}
              sx={{
                borderRadius: "90px",
                px: 15,
                py: 1.5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRight: `6px solid rgb(197, 94, 24)`,
                backgroundColor: "#fff",
                transition: "0.3s",
                width: "100%",
                minHeight: "56px",
                boxShadow: 1,
                "&:hover": {
                  backgroundColor: " #f5f5f5",
                  transform: "translateY(-2px)",
                  borderRight: `6px solid rgb(197, 94, 24)`,

                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  color: "black",
                  fontFamily: "Cairo, sans-serif",
                }}
              >
                كل الأقسام
              </Typography>
              <ExpandMoreIcon
                sx={{
                  transform: showSections ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                  color: " rgb(197, 94, 24)",
                  fontSize: "1.8rem",
                }}
              />
            </Button>
          </motion.div>

          {/* Dropdown menu (open by default) */}
          {showSections && (
            <Box
              sx={{
                mt: 1,
                width: "100%",
                minWidth: "200px",
                backgroundColor: "#f9f9f9",
                borderRadius: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              {sections.map((section, index) => (
                <Box
                  key={section.id}
                  sx={{
                    borderBottom: index !== sections.length - 1 ? "1px solid #e0e0e0" : "none",
                  }}
                >
                  <Button
                    fullWidth
                    sx={{
                      justifyContent: "center",
                      color: "#555",
                      fontWeight: "500",
                      fontSize: "1rem",
                      py: 1.5,
                      borderRadius: 0,
                      "&:hover": {
                        backgroundColor: "#eaeaea",
                      },
                    }}
                    onClick={() => navigate(`/sections/${section.id}`)}
                  >
                    {section.title}
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>

   
      </Box>
    </Box>
  );
}
