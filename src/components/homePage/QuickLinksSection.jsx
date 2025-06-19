import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { sectionColors } from "../../constants/sectionMeta";
import RoundedButton from "../Buttons/RoundedButton";
import PrettyCard from "../layout/PrettyCard";

export default function SectionGrid({ sections }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, pt: 0, pb: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <PrettyCard title="أقسام المركز" >
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
                <RoundedButton
                  key={section.id}
                  label={section.title}
                  color={color}
                  onClick={() => navigate(`/sections/${section.id}`)}
                  index={index}
                />
              );
            })}
          </Box>
        </PrettyCard>
      </motion.div>
    </Box>
  );
}