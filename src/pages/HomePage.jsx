import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../components/firebase";
import { useLocation } from "react-router-dom";
import { useSectionContext } from "../components/SectionContext";
import EventsSection from "./EventsSection";
import CalendarSection from "./CalendarSection";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function HomePage() {
  const [heroPrograms, setHeroPrograms] = useState([]);
  const eventsRef = useRef(null);
  const coursesRef = useRef(null);
  const location = useLocation();
  const { setActiveSection } = useSectionContext();

  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (scrollTo === "courses") {
      coursesRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (scrollTo === "events") {
      eventsRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (scrollTo) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchHeroPrograms = async () => {
      try {
        const q = query(
          collection(db, "heroPrograms"),
          where("isActive", "==", true),
          orderBy("order", "asc")
        );
        const snapshot = await getDocs(q);
        const programs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHeroPrograms(programs);
      } catch (error) {
        console.error("Error fetching hero programs:", error);
      }
    };
    fetchHeroPrograms();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleSection = "";
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === coursesRef.current) visibleSection = "courses";
            else if (entry.target === eventsRef.current) visibleSection = "events";
          }
        });
        if (visibleSection) {
          setActiveSection(visibleSection);
        }
      },
      { threshold: 0.7 }
    );

    if (coursesRef.current) observer.observe(coursesRef.current);
    if (eventsRef.current) observer.observe(eventsRef.current);

    return () => {
      if (coursesRef.current) observer.unobserve(coursesRef.current);
      if (eventsRef.current) observer.unobserve(eventsRef.current);
    };
  }, []);

  const arrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    cursor: "pointer",
    bgcolor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "50%",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: 1,
    transition: "background-color 0.3s",
    "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <Box onClick={onClick} sx={{ ...arrowStyles, right: { xs: 8, md: 16 } }}>
        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
      </Box>
    );
  };

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <Box onClick={onClick} sx={{ ...arrowStyles, left: { xs: 8, md: 16 } }}>
        <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
      </Box>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 8000,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  return (
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      {/* Hero Section */}
      <Box sx={{ py: 0, px: 0, backgroundColor: "#f4f6f8", mt: -5 }}>
        <Slider {...sliderSettings}>
          {heroPrograms.map((program, index) => (
            <Box key={program.id || index}>
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 300, md: 500 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: "0px", // Remove border radius for full width
                  boxShadow: "none", // Remove shadow for full width
                  mx: 0, // Remove horizontal margin
                  my: 0, // Remove vertical margin
                  backgroundColor: "#fff",
                }}
              >
                <Box
                  component="img"
                  src={program.imageUrl}
                  alt={program.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    filter: "brightness(0.8)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(226, 226, 226, 0.6)",
                    padding: { xs: 3, md: 4 },
                    borderRadius: "12px",
                    textAlign: "center",
                    color: "#fff",
                    maxWidth: { xs: "90%", md: "60%" },
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: "#fff", mb: 2 }}
                  >
                    {program.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, fontSize: "1.2rem", lineHeight: 1.6 }}
                  >
                    {program.description}
                  </Typography>
                  {program.link && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#63aa1f",
                        color: "#fff",
                        px: 4,
                        py: 1.5,
                        fontWeight: "bold",
                        fontSize: "1rem",
                        borderRadius: "30px",
                        "&:hover": { backgroundColor: " #4f8c19" },
                      }}
                      onClick={() => window.location.href = program.link}
                    >
                      سجلوا الآن
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Page Sections */}
      {/* <ProgramPage coursesRef={coursesRef} /> */}
      <EventsSection eventsRef={eventsRef} />
      <CalendarSection />
    </Box>
  );
}
