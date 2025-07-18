import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import { useFeaturedPrograms } from "./programs/hooks/useFeaturedPrograms";
import { useFetchEvents } from "./programs/useFetchEvents";
import CalendarSection from "./CalendarSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import QuickLinksSection from "../components/homePage/QuickLinksSection";
import { fetchSections } from "../utils/fetchSections";
import { fetchNews } from "../utils/fetchNews";
import { trackPageView } from "../components/Data Analysis/utils/trackPageView"; 
import { useLocation } from "react-router-dom";

export default function HomePage() {
  const featuredPrograms = useFeaturedPrograms();
  const featuredEvents = useFetchEvents(true); // Fetch only featured events 
  const [featuredNews, setFeaturedNews] = useState([]); // ✅ Declare this BEFORE using it
  const combinedSlides = [
  ...featuredPrograms,
  ...featuredEvents.map(e => ({ ...e, isEvent: true })),
  ...featuredNews,
];
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);

useEffect(() => {
  const loadSections = async () => {
    try {
      const data = await fetchSections();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };
  const loadNews = async () => {
    try {
      const data = await fetchNews(true); // ✅ only featured
      setFeaturedNews(data);
    } catch (error) {
      console.error("Error fetching featured news:", error);
    }
  };

  loadSections();
  loadNews();
}, []);


  // Track page view only once per session 
useEffect(() => {
  const path = location.pathname;
  const key = `viewed_${path}`;
  const lastViewed = localStorage.getItem(key);
  const today = new Date().toDateString();

  if (lastViewed !== today) {
    console.log("📊 Tracking view for:", path);
    trackPageView(path);
    localStorage.setItem(key, today);
  } else {
    console.log("⏳ Already tracked today:", path);
  }
}, [location.pathname]);


  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    rtl: true,
  };

  return (
    <Box sx={{  direction: "rtl" }}>
      {combinedSlides.length > 0 && (
        <Slider {...sliderSettings}>
          {combinedSlides.map((item) => (
            <Box
              key={item.id}
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
                height: { xs: 200, sm: 400, md: 300 },
                width: "100%",

              }}
            >
              {/* Left Image */}
              <Box
                component="img"
                src={item.imageUrl}
                alt={item.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: { xs: "center", md: "left" },
                 paddingRight: { xs: "0%", md: "40%" },


                }}
              />

              {/* Right Overlay - Desktop */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "52%",
                  height: "100%",
                  background: "linear-gradient(180deg, #00b0f0 0%, #003366 100%)",
                  clipPath: "polygon(100% 0%, 20% 0%, 0% 50%, 20% 100%, 100% 100%)",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  pl: 8, pr: 3,
                  zIndex: 1,
                }}
              >
<OverlayContent program={item} navigate={navigate} isEvent={item.isEvent} isNews={item.isNews} />
              </Box>

              {/* Overlay on mobile */}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  background: "linear-gradient(180deg, rgba(0, 176, 240, 0.65) 0%, rgba(0, 51, 102, 0.7) 100%)",
                  clipPath: "polygon(100% 0%, 20% 0%, 0% 50%, 20% 100%, 100% 100%)",
                  borderRadius: 2,
                  pl: 5,
                  pr: 1,
                  py: 1.5,
                  zIndex: 2,
                  flexDirection: "column",
                  alignItems: "center",
                  maxWidth: "85%",
                  boxShadow: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    color: "#fff",
                    mb: 1,
                    textAlign: "center",
                  }}
                >
                  {item.name}
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "rgb(197, 94, 24)",
                    borderRadius: "28px",
                    fontWeight: "bold",
                    px: 2,
                    py: 0.8,
                    fontSize: "0.85rem",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "black",
                    },
                  }}
                 onClick={() =>
  navigate(
    item.isNews
      ? `/news/${item.id}`
      : item.isEvent
        ? `/events?highlight=${item.id}`
        : `/programs/${encodeURIComponent(item.category?.[0] || '')}?highlight=${item.id}`
  )
}
            >
                {item.isNews ? "اقرأ المزيد" : "للتسجيل"}
                </Button>
              </Box>
            </Box>
          ))}
        </Slider>
      )}

{/* Quick Links */}
<Box sx={{ mt: { xs: 4, md: 2.5 } }}>
  <QuickLinksSection sections={sections} />
</Box>   
    </Box>
  );
}

function OverlayContent({ program, navigate, isEvent = false, isNews = false }) {
  // Truncate description to 300 characters
  const truncatedDescription =
    program.description && program.description.length > 300
      ? program.description.slice(0, 250) + "..."
      : program.description;

  return (
    <>
      <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff", mb: 2, textAlign: "right", direction: "rtl" }}>
        {program.name}
      </Typography>
      <Typography variant="body2" sx={{ color: "#fff", mb: 3, textAlign: "right",direction: "rtl" }}>
        {truncatedDescription}
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "rgb(197, 94, 24)",
          borderRadius: "28px",
          fontWeight: "bold",
          px: 4,
          py: 1,
          textTransform: "none",
        }}
        onClick={() =>
          navigate(
            isNews
              ? `/news/${program.id}`
              : isEvent
                ? `/events?highlight=${program.id}`
                : `/programs/${encodeURIComponent(program.category?.[0] || '')}?highlight=${program.id}`
          )
        }
      >
  {isNews ? "اقرأ المزيد" : "للتسجيل"}
      </Button>
    </>
  );
}
