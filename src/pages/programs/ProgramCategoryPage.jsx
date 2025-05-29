import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Container } from "@mui/material";
import ItemFlipCard from "./ItemFlipCard";
import HeroSection from "../../components/HeroSection";
import { useFetchPrograms } from "./useFetchPrograms";

// Import the icons you want for the fields
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RepeatIcon from '@mui/icons-material/Repeat';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { useLocation } from "react-router-dom";

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
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const programs = useFetchPrograms(categoryName);

  const handleRegister = (programName) => {
    navigate(`/RegistrationForm?program=${encodeURIComponent(programName)}`);
  };

  return (
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <Box mb={4}>
        <HeroSection pageId={categoryName} />
      </Box>
      <Container
        sx={{
          backgroundColor: "#fff",
          borderRadius: 4,
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          py: 4,
          px: { xs: 2, md: 6 },
          direction: "rtl",
          fontFamily: "'Noto Kufi Arabic', sans-serif",
        }}
      >
        <Grid container spacing={0.3}>
          {programs.map((prog) => (
            <Grid item key={prog.id} xs={12} sm={6} md={4}>
              <ItemFlipCard
                item={prog}
                fields={programFields}
                onRegister={handleRegister}
                // Optionally, you can pass config={{}} here if needed for special logic
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
