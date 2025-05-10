import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../components/firebase";
import { useLocation } from "react-router-dom";
import { useSectionContext } from "../components/SectionContext";
import Slider from "react-slick";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProgramPage from "./ProgramsSection";
import EventsSection from "./EventsSection";
import CalendarSection from "./CalendarSection";

export default function HomePage() {
  const [heroPrograms, setHeroPrograms] = useState([]);
  const eventsRef = useRef(null);
  const coursesRef = useRef(null);
  const location = useLocation();
  const { setActiveSection } = useSectionContext();

  // Scroll-to logic
  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (scrollTo === "courses") coursesRef.current?.scrollIntoView({ behavior: "smooth" });
    else if (scrollTo === "events") eventsRef.current?.scrollIntoView({ behavior: "smooth" });
    if (scrollTo) window.history.replaceState({}, document.title);
  }, [location]);

  // Fetch programs
  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, "heroPrograms"),
        where("isActive", "==", true),
        orderBy("order", "asc")
      );
      const snapshot = await getDocs(q);
      setHeroPrograms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    })();
  }, []);

  // Section observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target === coursesRef.current ? "courses" : "events");
          }
        });
      },
      { threshold: 0.8 }
    );
    if (coursesRef.current) observer.observe(coursesRef.current);
    if (eventsRef.current) observer.observe(eventsRef.current);
    return () => {
      if (coursesRef.current) observer.unobserve(coursesRef.current);
      if (eventsRef.current) observer.unobserve(eventsRef.current);
    };
  }, []);  

  // Arrow styles
  const arrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    bgcolor: "rgba(255,255,255,0.8)",
    borderRadius: "50%",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: 1,
    cursor: "pointer",
    "&:hover": { bgcolor: "rgba(255,255,255,1)" },
  };

  const CustomNextArrow = ({ onClick }) => (
    <Box onClick={onClick} sx={{ ...arrowStyles, right: { xs: 8, md: 2 } }}>
      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
    </Box>
  );
  const CustomPrevArrow = ({ onClick }) => (
    <Box onClick={onClick} sx={{ ...arrowStyles, left: { xs: 8, md: 2} }}>
      <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
    </Box>
  );

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
      {/* Hero Slider */}
      <Box sx={{ py:0,  backgroundColor: "#f8f9fb" }}>
        <Slider {...sliderSettings}>
          {heroPrograms.map((program) => (
            <Box key={program.id}>
              <Grid
                container
                spacing={0}
                alignItems="center"
                justifyContent="center"
                sx={{
                  flexDirection: { xs: "column", md: "row" },
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  px: { xs: 2, md: 0 },
                  py: { xs: 3, md: 0 },
                  mx: { xs: 2, md: 0 },
                  my: 0,
                  minHeight: { xs: 300, md: 450 }, // set slider height
                }}
              >
                {/* Text Side */}
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: "right", marginRight: { xs: 0, md: 2.5} }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#004b87" }}>
                      {program.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, fontSize: "1.1rem", color: "#333" }}>
                      {program.description}
                    </Typography>
                    {program.link && (
                      <Button
                        variant="contained"
                        onClick={() => window.location.href = program.link}
                        sx={{
                          backgroundColor: "#63aa1f",
                          color: "#fff",
                          px: 5,
                          py: 1.5,
                          fontWeight: "bold",
                          fontSize: "1rem",
                          borderRadius: "30px",
                          "&:hover": { backgroundColor: "#4f8c19" },
                        }}
                      >
                        سجلوا الآن
                      </Button>
                    )}
                  </Box>
                </Grid>

                {/* Image Side */}
                <Grid item xs={12} md={9}>
                  <Box
                    component="img"
                    src={program.imageUrl}
                    alt={program.title}
                    sx={{
                      width: "100%",
                      maxHeight: 450,
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Rest of page */}
      <ProgramPage coursesRef={coursesRef} />
      <EventsSection eventsRef={eventsRef} />
      <CalendarSection />
    </Box>
  );
}
