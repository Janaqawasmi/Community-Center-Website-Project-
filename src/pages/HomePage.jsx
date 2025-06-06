import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import { useFeaturedPrograms } from "./programs/hooks/useFeaturedPrograms";
import CalendarSection from "./CalendarSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import QuickLinksSection from "../components/homePage/QuickLinksSection";
import { fetchSections } from "../utils/fetchSections";
import AboutUsSection from "../components/homePage/AboutUsSection";

export default function HomePage() {
  const featuredPrograms = useFeaturedPrograms();
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
      {featuredPrograms.length > 0 && (
        <Slider {...sliderSettings}>
          {featuredPrograms.map((program) => (
            <Box
              key={program.id}
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                height: { xs: 280, md: 380 },
              }}
            >
              {/* Image Section */}
              <Box
                component="img"
                src={program.imageUrl}
                alt={program.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: { xs: "center", md: "right" },
                  paddingLeft: { xs: "0%", md: "35%" },
                }}
              />

              {/* Overlay on desktop */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "45%",
                  height: "100%",
                  background: "linear-gradient(180deg, #00b0f0 0%, #003366 100%)",
                  clipPath:"polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  px: 9,
                  zIndex: 1,
                }}
              >
                <OverlayContent program={program} navigate={navigate} />
              </Box>

{/* Overlay on mobile (over image, only name + button) */}
<Box
  sx={{
    display: { xs: "flex", md: "none" },
    position: "absolute",
    bottom: 8,
    left: 8,
    background: "linear-gradient(180deg, rgba(0, 176, 240, 0.65) 0%, rgba(0, 51, 102, 0.7) 100%)",
    clipPath: "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
    borderRadius: 2,
pl: 2,
pr: 3,
    py: 1.5,
    zIndex: 2,
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "85%", // doesn't stretch across entire image
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
    {program.name}
  </Typography>

  <Button
    variant="contained"
    sx={{
      backgroundColor: "rgb(197, 94, 24)",
      borderRadius: "20px",
      fontWeight: "bold",
      px: 3,
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
        `/programs/${encodeURIComponent(program.category[0])}?highlight=${program.id}`
      )
    }
  >
    سجلوا الآن
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

function OverlayContent({ program, navigate }) {
  return (
    <>
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          color: "#fff",
          mb: 2,
          fontSize: { xs: "1.5rem", md: "2.5rem" },
          textAlign: { xs: "center", md: "right" },
          width: "100%",
          maxWidth: { xs: "100%", md: "80%" },
        }}
      >
        {program.name}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#fff",
          mb: 3,
          fontSize: { xs: "1rem", md: "1.125rem" },
          textAlign: { xs: "center", md: "right" },
          width: "100%",
          maxWidth: { xs: "100%", md: "80%" },
          lineHeight: 1.8,
        }}
      >
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
          fontSize: { xs: "0.9rem", md: "1rem" },
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#fff",
            color: "black",
          },
        }}
        onClick={() =>
          navigate(
            `/programs/${encodeURIComponent(program.category[0])}?highlight=${program.id}`
          )
        }
      >
        سجلوا الآن
      </Button>
    </>
  );
}
