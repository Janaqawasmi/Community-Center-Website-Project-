import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  InputAdornment,
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
          <Box fontSize="36px" color={color}>
            {icon}
          </Box>
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
        </Box>
      </Paper>
    </motion.div>
  );
}

export default function ProgramPage() {
  const [allPrograms, setAllPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    <Container sx={{ py: 6 }} dir="rtl">
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "center", fontFamily: "Cairo, sans-serif" }}
      >
        الدورات
      </Typography>

      {/* Search Bar */}
      <Box
        sx={{
          background: "linear-gradient(to left, #004e92, #56ccf2)",
          borderRadius: "999px",
          padding: "6px 10px",
          display: "flex",
          alignItems: "center",
          gap: 2,
          maxWidth: 700,
          mx: "auto",
          my: 4,
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

      {/* Extra title under search bar */}
      {searchQuery.trim() === "" && (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#444",
            fontWeight: "bold",
            fontSize: "20px",
            mb: 3,
            fontFamily: "Cairo, sans-serif",
            color:"black",
          }}
        >
          ابحث حسب القسم
        </Typography>
      )}

      {/* Category Pills */}
      {searchQuery.trim() === "" && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
            px: 1,
          }}
        >
          {categories.map((label, index) => {
            const iconKey = Object.keys(iconMap).find((key) =>
              key.includes(label)
            );
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
      )}

      {/* Filtered Programs */}
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
  );
}
