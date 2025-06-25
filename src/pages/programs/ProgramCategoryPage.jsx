//src\pages\programs\ProgramCategoryPage.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Grid,Container } from "@mui/material";
import { useFetchPrograms } from "./useFetchPrograms";
import ItemFlipCard from "./ItemFlipCard";
import HeroSection from "../../components/HeroSection";
import { useSearchParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { trackPageView } from "../../components/Data Analysis/utils/trackPageView"; 
import GradientSearchBar from "../../components/layout/common/GradientSearchBar";

// Icons
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RepeatIcon from '@mui/icons-material/Repeat';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventSeatIcon from '@mui/icons-material/EventSeat';

const programFields = [
  { key: "days", label: "الأيام", icon: <CalendarTodayIcon /> },
  { key: "time", label: "الوقت", icon: <AccessTimeIcon /> },
  { key: "meetingNum", label: "عدد اللقاءات", icon: <RepeatIcon /> },
  { key: "instructor_name", label: "اسم المدرب", icon: <PersonIcon /> },
  { key: "price", label: "السعر", icon: <AttachMoneyIcon /> },
  { key: "capacity", label: "المقاعد المتبقية", icon: <EventSeatIcon /> },
];

export default function ProgramCategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const programs = useFetchPrograms(categoryName);
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const cardRefs = useRef({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 960);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 960);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
  
// Scroll to highlighted program if it exists
useEffect(() => {
    if (highlightId && cardRefs.current[highlightId]) {
      cardRefs.current[highlightId].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [programs, highlightId]);

  const handleRegister = (programName) => {
    navigate(`/RegistrationForm?program=${encodeURIComponent(programName)}`);
  };

  const highlightedProgram = programs.find((p) => p.id === highlightId);

  const [searchTerm, setSearchTerm] = useState("");

const filteredPrograms = programs.filter(
  (prog) =>
    prog.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prog.description?.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <Box sx={{ direction: "rtl" }}>
      <Box mb={4}>
        <HeroSection pageId={categoryName} />
      </Box>
<Box sx={{ mt: -2, mb: 2 }}>
  <GradientSearchBar
    label="بحث سريع"
    placeholder="ابحث عن برنامج"
    searchQuery={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</Box>

      <Container>
        {highlightId && highlightedProgram && isDesktop && (
          <Box sx={{ mb: 8 }} ref={(el) => (cardRefs.current[highlightId] = el)}>
            <Grid container justifyContent="center">
              <Grid item md={4}>
                <ItemFlipCard
                  item={highlightedProgram}
                  fields={programFields}
                  onRegister={handleRegister}
                  highlight={true}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        <Grid container spacing={8} justifyContent="center">
        {filteredPrograms
  .filter((prog) => !(highlightId === prog.id && isDesktop))
  .map((prog) => (
              <Grid
                item
                key={prog.id}
                xs={12}
                sm={6}
                md={4}
                display="flex"
                justifyContent="center"
                ref={(el) => (cardRefs.current[prog.id] = el)}
              >
                <ItemFlipCard
                  item={prog}
                  fields={programFields}
                  onRegister={handleRegister}
                  highlight={highlightId === prog.id}
                />
              </Grid>
            ))}
        </Grid>
{filteredPrograms.length === 0 && searchTerm.trim() !== "" && (
  <Typography sx={{ mt: 8, textAlign: "center", color: "text.secondary" }}>
    لا توجد نتائج مطابقة لبحثك.
  </Typography>
)}

{filteredPrograms.length === 0 && searchTerm.trim() === "" && (
  <Typography sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
    لا توجد برامج حالياً تحت هذا التصنيف.
  </Typography>
)}
      </Container>
    </Box>
  );
}
