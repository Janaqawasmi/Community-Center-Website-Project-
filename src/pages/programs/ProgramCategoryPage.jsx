import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import { useFetchPrograms } from "./useFetchPrograms";
import ItemFlipCard from "./ItemFlipCard"; // import ProgramCard from "./ProgramCard";
import HeroSection from "../../components/HeroSection"; 
import { useSearchParams,useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";

// Import the icons you want for the fields
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RepeatIcon from '@mui/icons-material/Repeat';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventSeatIcon from '@mui/icons-material/EventSeat';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const programFields = [
  { key: "days", label: "الأيام", icon: <CalendarTodayIcon /> },
  { key: "time", label: "الوقت", icon: <AccessTimeIcon /> },
  { key: "meetingNum", label: "عدد اللقاءات", icon: <RepeatIcon /> },
  { key: "instructor_name", label: "اسم المدرب", icon: <PersonIcon /> },
  { key: "price", label: "السعر", icon: <AttachMoneyIcon /> },
  { key: "capacity", label: "المقاعد المتبقية", icon: <EventSeatIcon /> },
];
export default function ProgramCategoryPage() {
  const { categoryName } = useParams();// save the category name from the URL
  const navigate = useNavigate();
  const programs = useFetchPrograms(categoryName);
const [searchParams] = useSearchParams();
const highlightId = searchParams.get("highlight");

// store refs
const cardRefs = useRef({});

// after programs are loaded, scroll to highlighted one
useEffect(() => {
  if (highlightId && cardRefs.current[highlightId]) {
    cardRefs.current[highlightId].scrollIntoView({ behavior: "smooth", block: "center" });
  }
}, [programs, highlightId]);


  const handleRegister = (programName) => {
    navigate(`/RegistrationForm?program=${encodeURIComponent(programName)}`);
  };

  return (
  <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
    {/* Header Section */}
    <Box mb={4}>
      <HeroSection pageId={categoryName} />
    </Box>

    {/* White Box Container - Matches About Page */}
   <Container
  sx={{
    backgroundColor: "#fff", // or rgba(255,255,255,0.95) for semi-transparent
    borderRadius: 4,
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    py: 4,
    px: { xs: 2, md: 6 },
    direction: "rtl",
    fontFamily: "'Noto Kufi Arabic', sans-serif",
  }}
>
 <Grid container spacing={0.3} >
 {programs
  .filter(prog => prog.isActive !== false) // يعرض فقط الدورات المفعلة أو التي لا تحتوي على هذا الحقل
  .map((prog) => (
    <Grid
      item
      key={prog.id}
      xs={12}
      sm={6}
      md={4}
      ref={(el) => (cardRefs.current[prog.id] = el)}
    >
      <ItemFlipCard
        item={prog}
        fields={programFields}
        onRegister={handleRegister}
        highlight={prog.id === highlightId}
      />
    </Grid>
  ))}

   {programs.length === 0 && (
            <Typography sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
              لا توجد برامج حالياً تحت هذا التصنيف.
            </Typography>
          )}
</Grid>

</Container>

  </Box>
);

}
