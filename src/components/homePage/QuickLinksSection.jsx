import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { sectionColors } from "../../constants/sectionMeta";
import RoundedButton from "../layout/Buttons/RoundedButton";
import PrettyCard from "../layout/PrettyCard";

export default function SectionGrid({ sections }) {
  const navigate = useNavigate();

  const cleanSectionTitle = (title) =>
    title
      .normalize("NFKC")
      .replace(/^[^\w\u0600-\u06FF]*قسم\s*/u, "")
      .trim();

  const isLoading = !sections || sections.length === 0;

  return (
    <Box sx={{ px: { xs: 1, md: 6 }, pt: 0, pb: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <PrettyCard title="أقسام المركز">
          {isLoading ? (
            <Box
              sx={{
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="primary" />
              <Typography sx={{ mt: 2, fontWeight: "medium" }}>
                جاري التحميل...
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "1fr 1fr 1fr 1fr",
                  md: "1fr 1fr 1fr 1fr 1fr 1fr",
                },
                gap:{ xs: 0.5, md: 2 },
              }}
            >
              {sections.map((section, index) => {
                const color = sectionColors[section.id] || "#00b0f0";
                return (
                  <RoundedButton
                    key={section.id}
                    label={cleanSectionTitle(section.title)}
                    color={color}
                    onClick={() => navigate(`/sections/${section.id}`)}
                    index={index}
                  />
                );
              })}
            </Box>
          )}
        </PrettyCard>
      </motion.div>
    </Box>
  );
}
