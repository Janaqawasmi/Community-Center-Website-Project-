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
import AboutUsSection from "../components/homePage/AboutUsSection";

export default function HomePage() {
  const featuredPrograms = useFeaturedPrograms();
  const featuredEvents = useFetchEvents(true); // Fetch only featured events 
  const combinedSlides = [...featuredPrograms, ...featuredEvents.map(e => ({ ...e, isEvent: true }))];
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
    loadSections();
  }, []);

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
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
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
                height: { xs: 280, md: 380 },
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
                 paddingRight: { xs: "0%", md: "35%" },


                }}
              />

              {/* Right Overlay - Desktop */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "50%",
                  height: "100%",
                  background: "linear-gradient(180deg, #00b0f0 0%, #003366 100%)",
                  clipPath: "polygon(100% 0%, 20% 0%, 0% 50%, 20% 100%, 100% 100%)",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  px: 8,
                  zIndex: 1,
                }}
              >
                <OverlayContent program={item} navigate={navigate} isEvent={item.isEvent} />
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
                  pl: 4,
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
                  variant="h5"
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
                    borderRadius: "20px",
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
                      item.isEvent
                        ? `/events?highlight=${item.id}`
                        : `/programs/${encodeURIComponent(item.category?.[0] || '')}?highlight=${item.id}`
                    )
                  }
                >
        عرض التفاصيل
                </Button>
              </Box>
            </Box>
          ))}
        </Slider>
      )}

      <AboutUsSection />
      <QuickLinksSection sections={sections} />

      <Box sx={{ mt: 1, px: { xs: 2, md: 30 } }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          التقويم والفعاليات
        </Typography>
        <CalendarSection />
      </Box>
    </Box>
  );
}

function OverlayContent({ program, navigate, isEvent = false }) {
  return (
    <>
      <Typography variant="h3" fontWeight="bold" sx={{ color: "#fff", mb: 2 , textAlign: "right" }}>
        {program.name}
      </Typography>
      <Typography variant="body1" sx={{ color: "#fff", mb: 3,  textAlign: "right" }}>
        {program.description}
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "rgb(197, 94, 24)",
          borderRadius: "20px",
          fontWeight: "bold",
          px: 4,
          py: 1,
          textTransform: "none",
        }}
        onClick={() =>
          navigate(
            isEvent
              ? `/events?highlight=${program.id}`
              : `/programs/${encodeURIComponent(program.category?.[0] || '')}?highlight=${program.id}`
          )
        }
      >
        عرض التفاصيل
      </Button>
    </>
  );
}
