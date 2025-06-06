import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import {
  FaEye,
  FaEnvelope,
  FaLightbulb,
  FaBullseye,
  FaGlobe,
  FaUserAlt,
  FaUsers,
} from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';
import HeroSection from "../components/HeroSection";
export default function About() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      easing: 'ease-in-out',
      once: true,
    });

    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, "siteInfo", "about us");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    fetchAboutData();
  }, []);

  if (!aboutData) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography align="center">جاري تحميل معلومات عن المركز...</Typography>
      </Container>
    );
  }

  // ✅ SectionHeader معدل ليكون أقصر عرضًا
  const SectionHeader = ({ title, icon, gradient }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        direction: "rtl",
        color: "white",
        background: gradient,
        px: 3,
        py: 2,
        borderRadius: "0 12px 12px 0",
        clipPath: "polygon(6% 0%, 100% 0%, 100% 100%, 0% 100%)",
        mb: 2,
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        gap: 1.5,
        maxWidth: "70%",  // ✅ الإطار أقصر
        ml: "auto",       // ✅ محاذاة لليمين داخل RTL
       
      }}
    >
      <Box sx={{ fontSize: 26 }}>{icon}</Box>
      <Typography variant="h5" fontWeight="bold" >
        {title}
      </Typography>
    </Box>
  );

  const InfoSection = ({ title, icon, text, gradient, animation }) => (
    <Box sx={{ mb: 6 }} data-aos={animation}>
      <Box sx={{ maxWidth: "85%", ml: "auto" }}>
        <SectionHeader title={title} icon={icon} gradient={gradient} />
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            lineHeight: 2,
            textAlign: "justify",
            fontSize: "1.2rem",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
        <Box mb={4}> {/* Adjust the margin as needed */}
        <HeroSection pageId="aboutUs" />
      </Box>

      <Container
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: 4,
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          py: 2,
          px: { xs: 2, md: 6 },
          direction: "rtl",
          fontFamily: "'Noto Kufi Arabic', sans-serif",
        }}
      >
      
        {/* الفقرة التعريفية */}
        <Box
          sx={{
            background: "linear-gradient(to right, #a8e063, #56ab2f)",
            borderRadius: 3,
            p: 4,
            mb: 6,
            color: "white",
                    }}
          data-aos="fade-up"
        >
          <Typography variant="body1" sx={{  fontSize: "1.2rem" ,lineHeight: 2, textAlign: "justify" }}>
            {aboutData.about_us_text}
          </Typography>
        </Box>

        {/* شعار المركز الجماهيري */}
        <Box sx={{ textAlign: "center", mb: 6 }} data-aos="fade-up">
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: "#4682B4", fontSize: "1.7rem" }}>
            شعار المركز الجماهيري
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={4} sm={3} md={2}>
              <Box sx={{ textAlign: "center" }}>
                <FaUsers size={60} style={{ color: "#4682B4" }} />
                <Typography fontWeight="bold" sx={{ mt: 1, fontSize: "1.2rem" }}>جمهور</Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sm={3} md={2}>
              <Box sx={{ textAlign: "center" }}>
                <FaUserAlt size={60} style={{ color: "#4682B4" }} />
                <Typography fontWeight="bold" sx={{ mt: 1, fontSize: "1.2rem" }}>انسان</Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sm={3} md={2}>
              <Box sx={{ textAlign: "center" }}>
                <FaGlobe size={60} style={{ color: "#4682B4" }} />
                <Typography fontWeight="bold" sx={{ mt: 1, fontSize: "1.2rem" }}>أرض</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* رؤية */}
        <InfoSection
          title={aboutData.vision_title}
          icon={<FaEye />}
          text={aboutData.vision}
          gradient="linear-gradient(to left, #f7971e, #ffd200)"
          animation="fade-left"
        />

        {/* رسالة */}
        <InfoSection
          title={aboutData.message_title}
          icon={<FaEnvelope />}
          text={aboutData.message}
          gradient="linear-gradient(to left, #004e92, #56ccf2)"
          animation="fade-right"
        />

        {/* مبررات */}
        <InfoSection
          title={aboutData.justifications_title}
          icon={<FaLightbulb />}
          text={aboutData.justifications}
          gradient="linear-gradient(to left, #c31432, #ff4e50)"
          animation="fade-left"
        />

        {/* أهداف */}
        <Box sx={{ mb: 6 }} data-aos="fade-up">
          <SectionHeader
            title={aboutData.goals_title}
            icon={<FaBullseye />}
            gradient="linear-gradient(to left, #3e833e, #b0d59d)"
          />
          <Box component="ol" sx={{ mt: 2, px: 3 }}>
            {aboutData.goals?.map((goal, index) => (
              <Typography
                component="li"
                key={index}
                sx={{ fontSize: "1.2rem", mb: 1.5, color: "black", textAlign: "right" }}
              >
                {goal}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>

  );
}
