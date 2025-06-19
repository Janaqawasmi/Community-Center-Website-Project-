import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
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
  const [expandedSections, setExpandedSections] = useState({
    about: false,
    vision: false,
    message: false,
    justifications: false,
    goals: false
  });

  // ألوان للبطاقات مع التدرجات
  const cardColors = {
    about: '#4a90e2',
    vision: '#f7971e',
    message: '#004e92',
    justifications: '#c31432',
    goals: '#3e833e'
  };

  // تدرجات الألوان للهيدرز
  const cardGradients = {
    about: "linear-gradient(180deg, #00b0f0 0%, #003366 100%)", // درجات الأزرق
    vision: "linear-gradient(180deg, #4CAF50 0%, #1B5E20 100%)", // درجات البرتقالي
    message: "linear-gradient(180deg, #FF9800 0%, #E65100 100%)", // درجات الكحلي
    justifications: "linear-gradient(180deg, #F44336 0%, #B71C1C 100%)", // درجات الأحمر
    goals: "linear-gradient(180deg, #8BC34A 0%, #33691E 100%)" // درجات الأخضر
  };

  const headerGradient = "linear-gradient(180deg, #00b0f0 0%, #003366 100%)";

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };



  // PrettyCard component
  const PrettyCard = ({ title, color, children, section }) => {
    const gradient = cardGradients[section] || `linear-gradient(135deg, ${color}, ${darkenColor(color, 0.2)})`;
    
    return (
      <Box
        sx={{
          position: 'relative',
          borderRadius: '28px',
          p: { xs: 3, sm: 4 },
          mt: 0,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          overflow: 'hidden',
          direction: 'rtl',
          minHeight: '200px',
        }}
      >
        {/* Top-Right Title Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: { xs: '40px', sm: '40px' },
            minWidth: 'fit-content',
            padding: '0 20px',
            background: gradient,
            borderBottomLeftRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            zIndex: 2,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
          }}
        >
          {title}
        </Box>

        {/* Card Body */}
        <Box sx={{ textAlign: 'right', fontSize: '1rem', color: '#444', pt: { xs: 5, sm: 6 } }}>
          {children}
        </Box>
      </Box>
    );
  };

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
      <Container sx={{ py: 10}}>
        <Typography align="center">جاري تحميل معلومات عن المركز...</Typography>
      </Container>
    );
  }

  return (
    <Box mb={0} sx={{ direction: "rtl" }}>
      <Box  mb={8} >
        <HeroSection pageId="aboutUs" />
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6, px: 2, position: 'relative', zIndex: 3, flex: 1 }}>
        
        {/* الفقرة التعريفية */}
        <PrettyCard 
          title="نبذة عن المركز" 
          color={cardColors.about}
          section="about"
        >
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: "1.2rem", 
              lineHeight: 2, 
              textAlign: "justify"
            }}
          >
            {aboutData.about_us_text}
          </Typography>

          {/* شعار المركز الجماهيري - يظهر دائماً */}
          <Box sx={{ mt: 1, fontSize: "1.2rem", color: '#1976D2' }}>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={4} sm={3} md={2}>
                <Box sx={{ textAlign: "center" }}>
                  <FaUsers size={60} style={{ color: '#1976D2' }} />
                  <Typography fontWeight="bold" sx={{ mt: 1, fontSize: "1.2rem" }}>جمهور</Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sm={3} md={2}>
                <Box sx={{ textAlign: "center" }}>
                  <FaUserAlt size={60} style={{ color: '#1976D2' }} />
                  <Typography fontWeight="bold" sx={{ mt: 1, fontSize: "1.2rem" }}>انسان</Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sm={3} md={2}>
                <Box sx={{ textAlign: "center" }}>
                  <FaGlobe size={60} style={{ color: '#1976D2' }} />
                  <Typography fontWeight="bold" sx={{ mt: 1, fontSize: "1.2rem" }}>أرض</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography
              onClick={() => toggleSection('about')}
              sx={{
                color: cardColors.about,
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': {
                  color: '#1565c0',
                  textDecoration: 'underline',
                }
              }}
            >
              {expandedSections.about ? 'عرض أقل' : 'اقرأ المزيد'}
            </Typography>
          </Box>
        </PrettyCard>

        {/* رؤية */}
        {expandedSections.about && (
          <PrettyCard 
            title={aboutData.vision_title} 
            color={cardColors.vision}
            section="vision"
          >
            <Typography
              variant="body1"
              sx={{
                lineHeight: 2,
                textAlign: "justify",
                fontSize: "1.2rem",
              }}
            >
              {expandedSections.vision 
                ? aboutData.vision 
                : truncateText(aboutData.vision, 200)
              }
            </Typography>
            {aboutData.vision && aboutData.vision.length > 200 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  onClick={() => toggleSection('vision')}
                  sx={{
                    color: cardColors.vision,
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    }
                  }}
                >
                  {expandedSections.vision ? 'عرض أقل' : 'اقرأ المزيد'}
                </Button>
              </Box>
            )}
          </PrettyCard>
        )}

        {/* رسالة */}
        {expandedSections.about && (
          <PrettyCard 
            title={aboutData.message_title} 
            color={cardColors.message}
            section="message"
          >
            <Typography
              variant="body1"
              sx={{
                lineHeight: 2,
                textAlign: "justify",
                fontSize: "1.2rem",
              }}
            >
              {expandedSections.message 
                ? aboutData.message 
                : truncateText(aboutData.message, 200)
              }
            </Typography>
            {aboutData.message && aboutData.message.length > 200 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  onClick={() => toggleSection('message')}
                  sx={{
                    color: cardColors.message,
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    }
                  }}
                >
                  {expandedSections.message ? 'عرض أقل' : 'اقرأ المزيد'}
                </Button>
              </Box>
            )}
          </PrettyCard>
        )}

        {/* مبررات */}
        {expandedSections.about && (
          <PrettyCard 
            title={aboutData.justifications_title} 
            color={cardColors.justifications}
            section="justifications"
          >
            <Typography
              variant="body1"
              sx={{
                lineHeight: 2,
                textAlign: "justify",
                fontSize: "1.2rem",
              }}
            >
              {expandedSections.justifications 
                ? aboutData.justifications 
                : truncateText(aboutData.justifications, 200)
              }
            </Typography>
            {aboutData.justifications && aboutData.justifications.length > 200 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  onClick={() => toggleSection('justifications')}
                  sx={{
                    color: cardColors.justifications,
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    }
                  }}
                >
                  {expandedSections.justifications ? 'عرض أقل' : 'اقرأ المزيد'}
                </Button>
              </Box>
            )}
          </PrettyCard>
        )}

        {/* أهداف */}
        {expandedSections.about && (
          <PrettyCard 
            title={aboutData.goals_title} 
            color={cardColors.goals}
            section="goals"
          >
            <Box component="ol" sx={{ px: 2 }}>
              {(expandedSections.goals 
                ? aboutData.goals 
                : aboutData.goals?.slice(0, 3)
              )?.map((goal, index) => (
                <Typography
                  component="li"
                  key={index}
                  sx={{ 
                    fontSize: "1.2rem", 
                    mb: 1.5, 
                    color: "#444", 
                    textAlign: "right",
                    lineHeight: 1.8
                  }}
                >
                  {goal}
                </Typography>
              ))}
            </Box>
            {aboutData.goals && aboutData.goals.length > 3 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  onClick={() => toggleSection('goals')}
                  sx={{
                    color: cardColors.goals,
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    }
                  }}
                >
                  {expandedSections.goals ? 'عرض أقل' : `عرض جميع الأهداف (${aboutData.goals.length})`}
                </Button>
              </Box>
            )}
          </PrettyCard>
        )}

      </Container>
    </Box>
  );
}