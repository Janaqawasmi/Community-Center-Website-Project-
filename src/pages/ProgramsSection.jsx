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
import { programCategories } from "../constants/sectionMeta";
import SearchIcon from "@mui/icons-material/Search";
import HeroSection from "../components/HeroSection";
import ItemFlipCard from "./programs/ItemFlipCard";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RepeatIcon from '@mui/icons-material/Repeat';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import RoundedButton from "../components/layout/Buttons/RoundedButton";
import { trackPageView } from "../components/Data Analysis/utils/trackPageView"; 
import { useLocation } from "react-router-dom";

const programFields = [
  { key: "days", label: "الأيام", icon: <CalendarTodayIcon /> },
  { key: "time", label: "الوقت", icon: <AccessTimeIcon /> },
  { key: "meetingNum", label: "عدد اللقاءات", icon: <RepeatIcon /> },
  { key: "instructor_name", label: "اسم المدرب", icon: <PersonIcon /> },
  { key: "price", label: "السعر", icon: <AttachMoneyIcon /> },
  { key: "capacity", label: "المقاعد المتبقية", icon: <EventSeatIcon /> },
];


const getCategoryColor = (label) => {
  const found = programCategories.find((c) => c.label === label);
  return found?.color || " #00b0f0";
};

function CategoryCard({ label, color, onClick, index }) {
  return (
    <RoundedButton
      label={label}
      color={color}
      onClick={onClick}
      index={index}
    />
  );
}


export default function ProgramPage() {
  const location = useLocation();
  const [allPrograms, setAllPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
const handleRegister = (programName) => {
  navigate(`/RegistrationForm?program=${encodeURIComponent(programName)}`);
};

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

  // Track page view only once per session 
useEffect(() => {
  const path = location.pathname;
  const key = `viewed_${path}`;
  const lastViewed = localStorage.getItem(key);
  const today = new Date().toDateString();

  if (lastViewed !== today) {
    trackPageView(path);
    localStorage.setItem(key, today);
  } 
}, [location.pathname]);

  const filteredPrograms = allPrograms.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box  sx={{  direction: "rtl" }} >
      <Box mb={2}>
      <HeroSection pageId="programs" />
      </Box>
      <Container sx={{ pb: 4 }} dir="rtl">
        {/* Search Bar */}
         <Box
      sx={{
        background: "#003366",
        borderRadius: "18px",           // 🔽 slightly reduced
        padding: "3px 6px",             // 🔽 tighter padding
        display: "flex",
        alignItems: "center",
        gap: 1,
        maxWidth: 700,                  // 🔽 slightly narrower
        mx: "auto",
        my: 1,
      }}
    >
      <Typography
        sx={{
          color: "white",
          fontWeight: "bold",
          fontSize: "13px",             // 🔽 smaller font
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
              <SearchIcon sx={{ color: "rgba(0, 0, 0, 0.7)", fontSize: 16 }} />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: "#fff",
            borderRadius: "18px",       // 🔽 matches outer radius
            fontSize: "0.85rem",        // 🔽 input text slightly smaller
            height: "34px",             // 🔽 slightly shorter
            px: 1.2,
            "& fieldset": {
              border: "none",
            },
          },
        }}
      />
    </Box>

   {/* Filter Title - Static Text */}
{searchQuery.trim() === "" && (
  <Typography
    sx={{
      textAlign: "center",
      mb: 2,
      fontWeight: "bold",
      fontSize: "1.4rem",
      color: "black",
    }}
  >
    اختر حسب القسم
  </Typography>
)}


     {/* Category View */}
{searchQuery.trim() === "" && (
  <Box sx={{ maxWidth: 700, mx: "auto" }}>
    <Grid container spacing={2}>
      {categories.map((label, index) => {
        const color = getCategoryColor(label);
        return (
          <Grid item xs={12} sm={6} key={label}>
            <CategoryCard
              label={label}
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


       

        {/* Search Results */}
      {searchQuery.trim() !== "" && (
  <Grid container spacing={2} mt={0}>
    {filteredPrograms.map((program) => (
      <Grid item xs={12} sm={6} md={4} key={program.id}>
        <ItemFlipCard
          item={program}
          fields={programFields}
          onRegister={handleRegister}
          highlight={false}
        />
      </Grid>
    ))}

    {filteredPrograms.length === 0 && (
      <Typography sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
        لا توجد نتائج مطابقة لبحثك.
      </Typography>
    )}
  </Grid>
)}
      </Container>
    </Box>
  );
}
