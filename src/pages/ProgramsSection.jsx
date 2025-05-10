// src/pages/ProgramSection.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Divider,
  InputAdornment,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import { useNavigate } from "react-router-dom";
import { programCategories } from "../constants/sectionMeta";
import SearchIcon from "@mui/icons-material/Search";

function CategoryList({ categories, navigate, basePath = "/programs" }) {
  const fallbackColors = ["#f26d2c", "#cf2929", "#2baadc", "#fbc21f", "#68a144"];

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
      {categories.map((label) => {
        const catObj = programCategories.find((c) => c.label === label);
        const color =
          catObj?.color ||
          fallbackColors[Math.floor(Math.random() * fallbackColors.length)];

        const isGradient = typeof color === "string" && color.startsWith("linear");

        return (
          <Grid item xs={12} sm={6} key={label}>
<Box
  onClick={() => navigate(`${basePath}/${encodeURIComponent(label)}`)}
  sx={{
    display: "flex",
    gap: 2,
    alignItems: "center",
    borderRadius: "50px",
    px: 3,
    py: 2,
    fontWeight: "bold",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "#f5f5f5",
    color: "black",
    transition: "0.3s",

    // 🎯 Slice of gradient as right border (left to right)
    backgroundImage: isGradient
      ? `linear-gradient(to left, ${color} 20px, #f5f5f5 20px)`
      : "none",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",

    borderRight: isGradient ? "none" : `6px solid ${color}`,

    "& span": {
      color: "black",
    },

    "&:hover": {
      background: color,
      color: "white",
      borderRight: "none",
      "& span": {
        color: "white",
      },
    },
  }}
>

              <span style={{ fontWeight: "normal", fontSize: "20px" }}>&gt;</span>
              <span>{label}</span>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}



export default function ProgramPage({ coursesRef }) {
  const [categories, setCategories] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categoryTitle = "اختر حسب القسم";

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
          new Set(programs.map((p) => p.category).filter(Boolean))
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
    <Container
      sx={{
        py: 6,
        scrollMarginTop: { xs: "100px", md: "120px" },
        textAlign: "center",
      }}
      ref={coursesRef}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#black" }}>
        الدورات
      </Typography>
      <Divider
        sx={{
          width: "100px",
          height: "4px",
  background:"black",
            margin: "8px auto",
          borderRadius: "4px",
        }}
      />

      <Box
        sx={{
          mb: 4,
          p: 1,
          width: { xs: "100%", sm: "90%", md: "100%" },
          maxWidth: "1000px",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(to left, #004e92, #56ccf2)",
            borderRadius: "999px",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 1,
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
                borderRadius: "999px",
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

        {/* Section by Category */}
        {searchQuery.trim() === "" && (
          <>
            <Box
              sx={{
                background:"linear-gradient(to left, #004e92, #56ccf2)",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                px: 4,
                py: 3,
                width: "100%",
                maxWidth: "1000px",
                mx: "auto",
                mb: 0, // <-- Add this line or increase value
              }}
            >
              <Typography
                fontWeight="bold"
                textAlign="center"
                sx={{ color: "white", width: "100%", fontSize: "26px" }}
              >
                {categoryTitle}
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: "#ffffff",
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
                px: 2,
                pb:4,
                pt:0,
              
                width: "100%",
                maxWidth: "1000px",
                mx: "auto",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",

              }}
            >
              <CategoryList categories={categories} navigate={navigate} />
            </Box>

           
          </>
        )}
      </Box>

      {/* Filtered Programs */}
      {searchQuery.trim() !== "" && (
        <Grid container spacing={3}>
          {filteredPrograms.map((program) => (
            <Grid item xs={12} md={4} key={program.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {program.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {program.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate(`/programs/${encodeURIComponent(program.category)}`)
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
  );
}
