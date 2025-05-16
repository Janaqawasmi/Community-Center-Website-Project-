import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../components/firebase";
import { useLocation } from "react-router-dom";
import { useSectionContext } from "../components/SectionContext";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function HomePage() {
  const [heroPrograms, setHeroPrograms] = useState([]);
  const location = useLocation();
  const { setActiveSection } = useSectionContext();


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
<Box sx={{ py: 0, px: 0, backgroundColor: "rgb(255, 255, 255)", mt: 0 }}>
  
        <Slider {...sliderSettings}>
          {heroPrograms.map((program, index) => (
            <Box key={program.id || index}>
      <Box
  sx={{
    position: "relative",
    height: { xs: 300, md: 500 },
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  }}
>
  {/* Background Image Full Width */}
<Box
  component="img"
  src={program.imageUrl}
  alt="Program Image"
  sx={{
    position: "absolute",
    top: "50px",
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "right",
    paddingLeft: { xs: "35%", md: "35%" }, // push image right to avoid clipping
    zIndex: 0,
  }}
/>

  {/* Text + Shape Overlay */}
  <Box
    sx={{
      width: { xs: "35%", md: "35%" },
      height: "100%",
background: "linear-gradient(180deg, #00b0f0 0%, #003366 100%)",
clipPath: "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      px: { xs: 2, md: 7 },
      zIndex: 1,
    }}
  >
    <Typography
      variant="h3"
      fontWeight="bold"
      sx={{ color: " #fff", mb: 2 }}
    >
      {program.title}
    </Typography>
    <Typography
      variant="body1"
      sx={{ color: " #fff", fontSize: "1.1rem", mb: 3 }}
    >
      {program.description}
    </Typography>
    {program.link && (
      <Button
        variant="contained"
        sx={{
          backgroundColor: "rgb(197, 94, 24)",
          color: " #fff",
          px: 4,
          py: 1,
          borderRadius: "20px",
          textTransform: "none",
          fontWeight: "bold",
          boxShadow: "none",
          "&:hover": { backgroundColor: "rgb(255, 255, 255)", color: "black"  }, 
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


    </Box>
  );
}
