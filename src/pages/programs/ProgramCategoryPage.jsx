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
    <Box sx={{ direction: "rtl" }}>
      <Box mb={8}>
        <HeroSection pageId={categoryName} />
      </Box>

      <Box sx={{ px: { xs: 2, md: 6 }, pb: 4 }}>
        {highlightId && highlightedProgram && isDesktop && (
          <Box sx={{ mb: 6 }} ref={(el) => (cardRefs.current[highlightId] = el)}>
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
          {programs
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

        {programs.length === 0 && (
          <Typography sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
            لا توجد برامج حالياً تحت هذا التصنيف.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
