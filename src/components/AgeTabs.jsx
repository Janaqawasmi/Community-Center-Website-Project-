// src/components/AgeTabs.jsx
import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";

const ageGroups = [
  {
    label: "أطفال",
    categories: ["موسيقى", "فن", "رقص"]
  },
  {
    label: "شباب",
    categories: ["رياضة", "علم", "برمجة"]
  },
  {
    label: "بالغين",
    categories: ["لغة", "طهي", "تطوير"]
  },
  {
    label: "كبار السن",
    categories: ["ترفيه", "رسم", "حرف"]
  }
];

export default function AgeTabs({ navigate }) {
  const [activeAge, setActiveAge] = useState(ageGroups[0]);

  return (
    <Box sx={{ mt: 6 }}>
      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
          background: "#fff",
          flexWrap: "wrap",
        }}
      >
        {ageGroups.map((group) => (
          <Box
            key={group.label}
            onClick={() => setActiveAge(group)}
            sx={{
              px: 4,
              py: 2,
              cursor: "pointer",
              fontWeight: "bold",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              background: activeAge.label === group.label ? "#e6007e" : "#f5f5f5",
              color: activeAge.label === group.label ? "#fff" : "#000",
              transition: "0.3s",
              mx: 1,
              mb: -1,
              boxShadow: activeAge.label === group.label ? "0px -2px 4px rgba(0,0,0,0.2)" : "none",
            }}
          >
            {group.label}
          </Box>
        ))}
      </Box>

      {/* Content */}
      <Box
        sx={{
          backgroundColor: "#e6007e",
          color: "white",
          py: 4,
          px: 3,
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {activeAge.categories.map((cat) => (
            <Grid item key={cat}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: "bold",
                  cursor: "pointer",
                  
                  '&:hover': { opacity: 0.8 },
                }}
                onClick={() => navigate(`/programs/age/${encodeURIComponent(cat)}`)}
              >
                <Box sx={{ fontSize: 40 }}>🎯</Box>
                <Typography>{cat}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
