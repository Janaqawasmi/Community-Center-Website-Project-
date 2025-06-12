import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";
import ItemFlipCard from "./ItemFlipCard";
import HeroSection from "../../components/HeroSection";
import { useFetchEvents } from "./useFetchEvents";
import { useMemo, useRef, useEffect, useState } from "react";

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
  const cardRefs = useRef({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 960);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 960);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const highlightId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("highlight");
  }, [location.search]);

  useEffect(() => {
    if (highlightId && cardRefs.current[highlightId]) {
      cardRefs.current[highlightId].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [events, highlightId]);

  const handleRegister = (eventTitle) => {
    navigate(`/RegistrationForm?event=${encodeURIComponent(eventTitle)}`);
  };

  const highlightedEvent = events.find((e) => e.id === highlightId);

  return (
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <Box mb={4}>
        <HeroSection pageId="events" />
      </Box>

      <Box sx={{ px: { xs: 2, md: 6 }, pb: 4 }}>
        {/* Highlighted Event (Large Card on Desktop) */}
        {highlightId && highlightedEvent && isDesktop && (
          <Box sx={{ mb: 6 }} ref={(el) => (cardRefs.current[highlightId] = el)}>
            <Grid container justifyContent="center">
              <Grid item md={4}>
                <ItemFlipCard
                  item={highlightedEvent}
                  fields={eventFields}
                  onRegister={handleRegister}
                  highlight={true}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* All Other Cards */}
        <Grid container spacing={8} justifyContent="center">
          {events
            .filter((event) => !(highlightId === event.id && isDesktop))
            .map((event) => (
              <Grid
                item
                key={event.id}
                xs={12}
                sm={6}
                md={4}
                display="flex"
                justifyContent="center"
                ref={(el) => (cardRefs.current[event.id] = el)}
              >
                <ItemFlipCard
                  item={event}
                  fields={eventFields}
                  onRegister={handleRegister}
                  highlight={highlightId === event.id}
                />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
}
