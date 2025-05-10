import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import { useNavigate } from "react-router-dom";
import { programCategories, iconMap } from "../constants/sectionMeta";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";

const getCategoryColor = (label) => {
  const found = programCategories.find((c) => c.label === label);
  return found?.color || "#E0E0E0";
};

function CategoryCard({ label, icon, color, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Paper
        onClick={onClick}
        elevation={2}
        sx={{
          borderRadius: "50px",
          px: 3,
          py: 2,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          minWidth: 280,
          maxWidth: 320,
          justifyContent: "space-between",
          borderRight: `10px solid ${color}`,
          backgroundColor: "#fff",
          transition: "0.3s",
          "&:hover": {
            backgroundColor: "#f5f5f5",
            transform: "translateY(-4px)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              fontSize: "36px",
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "#222",
              fontFamily: "Cairo, sans-serif",
            }}
          >
            {label}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
}

export default function ProgramPage() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setCategories(programCategories.map((c) => c.label));
  }, []);

  return (
    <Box sx={{ backgroundColor: "#fff9f0", minHeight: "100vh", py: 4 }} dir="rtl">
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#333", mb: 1, fontFamily: "Cairo, sans-serif" }}
          >
            الدورات
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#666", maxWidth: "600px", mx: "auto", fontFamily: "Cairo, sans-serif" }}
          >
            استكشف الأقسام واختر البرنامج المناسب لك من بين باقة متنوعة من الدورات المتخصصة.
          </Typography>
        </Box>

        {/* Search Field */}
        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #eee",
            borderRadius: "12px",
            px: 2,
            py: 1.2,
            maxWidth: "500px",
            mx: "auto",
            mb: 3,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SearchIcon sx={{ color: "#9CA3AF", mr: 2 }} />
            <TextField
              fullWidth
              placeholder="ابحث عن دورة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="standard"
              dir="rtl"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontFamily: "Cairo, sans-serif",
                  fontSize: "1rem",
                },
              }}
            />
            {searchQuery && (
              <IconButton size="small" onClick={() => setSearchQuery("")}>
                ×
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Category Cards — responsive horizontal scroll on mobile */}
        <Box
          sx={{
            display: "flex",
            flexWrap: isMobile ? "nowrap" : "wrap",
            gap: 3,
            overflowX: isMobile ? "auto" : "unset",
            justifyContent: isMobile ? "flex-start" : "center",
            px: isMobile ? 1 : 0,
          }}
        >
          {categories.map((label, index) => {
            const iconKey = Object.keys(iconMap).find((key) => key.includes(label));
            const Icon = iconMap[iconKey];
            const color = getCategoryColor(label);
            return (
              <CategoryCard
                key={label}
                label={label}
                icon={Icon}
                color={color}
                index={index}
                onClick={() =>
                  navigate(`/programs/${encodeURIComponent(label)}`)
                }
              />
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
