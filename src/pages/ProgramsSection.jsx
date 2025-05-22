import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import { useNavigate } from "react-router-dom";
import { programCategories, iconMap } from "../constants/sectionMeta";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";

const getCategoryColor = (label) => {
  const found = programCategories.find((c) => c.label === label);
  return found?.color || "#E0E0E0";
};

function CategoryCard({ label, color, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Paper
        onClick={onClick}
        elevation={1}
        sx={{
          borderRadius: "90px",
          px: 3,
          py: 1.5,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRight: `6px solid ${color}`,
          backgroundColor: " #fff",
          transition: "0.3s",
          width: "100%",
          minHeight: "56px",
          "&:hover": {
            backgroundColor: " #f5f5f5",
            transform: "translateY(-2px)",
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
          {label}
        </Typography>
        <Typography fontSize="1.2rem" fontWeight="bold" color={color}>
          &lt;
        </Typography>
      </Paper>
    </motion.div>
  );
}

export default function ProgramPage() {
  const [allPrograms, setAllPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("category");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const snapshot = await getDocs(collection(db, "programs"));
        const programs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllPrograms(programs);

        const unique = Array.from(
          new Set(programs.flatMap((p) => p.category || []))
        );
        setCategories(unique);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = allPrograms.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <HeroSection pageId="programs" />

      <Container sx={{ pt: 2, pb: 6 }} dir="rtl">
        {/* Search Bar */}
        <Box
          sx={{
            background: "linear-gradient(180deg, #00b0f0 0%, #003366 100%)",
            borderRadius: "90px",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 2,
            maxWidth: 700,
            mx: "auto",
            my: 2,
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              fontFamily: "Cairo, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            بحث سريع
          </Typography>

          <TextField
            fullWidth
            placeholder="ابحث عن دورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            dir="rtl"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "rgba(0, 0, 0, 0.8)" }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "#fff",
                borderRadius: "90px",
                fontFamily: "Cairo, sans-serif",
                color: "rgb(0, 0, 0)",
                fontSize: "1.2rem",
                height: "42px",
                px: 2,
                "& fieldset": {
                  border: "none",
                },
              },
            }}
          />
        </Box>

        {/* Toggle Buttons */}
        {searchQuery.trim() === "" && (
          <Box
            sx={{
              width: "fit-content",
              mx: "auto",
              backgroundColor: "#e0e0e0",
              borderRadius: "90px",
              p: "4px",
              display: "flex",
              gap: 1,
              position: "relative",
              mb: 4,
            }}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: "absolute",
                top: 4,
                bottom: 4,
                right: filterType === "category" ? 4 : "calc(50% + 2px)",
                left: filterType === "category" ? "calc(50% + 2px)" : 4,
                background: "linear-gradient(180deg, #00b0f0 0%, #003366 100%)",
                borderRadius: "90px",
                zIndex: 0,
              }}
            />
            <Box
              onClick={() => setFilterType("category")}
              sx={{
                zIndex: 1,
                cursor: "pointer",
                px: 3,
                py: 1,
                fontWeight: "bold",
                fontFamily: "Cairo, sans-serif",
                color: filterType === "category" ? "white" : "black",
              }}
            >
              اختر حسب القسم
            </Box>
            <Box
              onClick={() => setFilterType("age")}
              sx={{
                zIndex: 1,
                cursor: "pointer",
                px: 3,
                py: 1,
                fontWeight: "bold",
                fontFamily: "Cairo, sans-serif",
                color: filterType === "age" ? "white" : "black",
              }}
            >
              حسب العمر
            </Box>
          </Box>
        )}

        {/* Category View */}
        {searchQuery.trim() === "" && filterType === "category" && (
          <Box sx={{ maxWidth: 700, mx: "auto" }}>
            <Grid container spacing={2}>
              {categories.map((label, index) => {
                const iconKey = Object.keys(iconMap).find((key) =>
                  key.includes(label)
                );
                const Icon = iconMap[iconKey];
                const color = getCategoryColor(label);
                return (
                  <Grid item xs={12} sm={6} key={label}>
                    <CategoryCard
                      label={label}
                      icon={Icon}
                      color={color}
                      index={index}
                      onClick={() =>
                        navigate(`/programs/${encodeURIComponent(label)}`)
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* Age View */}
        {searchQuery.trim() === "" && filterType === "age" && (
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "18px",
              color: "#777",
              mt: 3,
              fontFamily: "Cairo, sans-serif",
            }}
          >
            (هنا سيظهر تصنيف حسب العمر - سيتم تنفيذه لاحقًا)
          </Typography>
        )}

        {/* Search Results */}
        {searchQuery.trim() !== "" && (
          <Grid container spacing={3} mt={2}>
            {filteredPrograms.map((program) => (
              <Grid item xs={12} md={4} key={program.id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      fontFamily="Cairo, sans-serif"
                    >
                      {program.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontFamily="Cairo, sans-serif"
                    >
                      {program.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          `/programs/${encodeURIComponent(program.category)}`
                        )
                      }
                    >
                      عرض التفاصيل
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
