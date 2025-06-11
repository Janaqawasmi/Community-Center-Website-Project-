import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Grid, Container } from "@mui/material";
import ItemFlipCard from "./ItemFlipCard";
import HeroSection from "../../components/HeroSection";
import { useFetchEvents } from "./useFetchEvents";
import { useMemo } from "react";

// الأيقونات...
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InfoIcon from '@mui/icons-material/Info';

const eventFields = [
  { key: "time", label: "الوقت", icon: <CalendarTodayIcon /> },
  { key: "location", label: "الموقع", icon: <LocationOnIcon /> },
  { key: "capacity", label: "عدد المقاعد", icon: <EventSeatIcon /> },
  { key: "price", label: "السعر", icon: <AttachMoneyIcon /> },
  { key: "description", label: "الوصف", icon: <InfoIcon /> },
];

export default function EventsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const events = useFetchEvents();

  // ✅ Extract ?highlight=someId from the URL
  const highlightId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("highlight");
  }, [location.search]);

  const handleRegister = (eventTitle) => {
    navigate(`/RegistrationForm?event=${encodeURIComponent(eventTitle)}`);
  };

  return (
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <Box mb={4}>
        <HeroSection pageId="events" />
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
  {events
    .filter(event => event.isActive !== false) // هذا السطر الجديد (التعجيل/الفلترة)
    .map((event) => (
      <Grid item key={event.id} xs={12} sm={6} md={4}>
        <ItemFlipCard
          item={event}
          fields={eventFields}
          onRegister={handleRegister}
        />
      </Grid>
    ))}
  {events.filter(event => event.isActive !== false).length === 0 && (
    <Typography sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
      لا توجد فعاليات حالياً.
    </Typography>
  )}
</Grid>

      </Container>
    </Box>
  );
}
