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
import {
  Info,
  Visibility,
  Edit,
  Add,
  Title,
  Subject,
  ColorLens,
  List as ListIcon,
} from "@mui/icons-material";
import AOS from 'aos';
import 'aos/dist/aos.css';
import HeroSection from "../components/HeroSection";

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // ألوان افتراضية للأقسام القديمة
  const defaultColors = {
    about: '#4a90e2',
    vision: '#f7971e', 
    message: '#004e92',
    justifications: '#c31432',
    goals: '#3e833e'
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // دالة مساعدة لتغميق اللون
  const darkenColor = (hex, amount = 0.3) => {
    // إزالة رمز # إذا كان موجوداً
    const cleanHex = hex.replace('#', '');
    
    // تحويل الهيكس إلى RGB
    const num = parseInt(cleanHex, 16);
    let r = (num >> 16);
    let g = ((num >> 8) & 0x00FF);
    let b = (num & 0x0000FF);

    // تطبيق التعتيم
    r = Math.max(0, Math.min(255, r - amount * 255));
    g = Math.max(0, Math.min(255, g - amount * 255));
    b = Math.max(0, Math.min(255, b - amount * 255));

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  // دالة للحصول على الأيقونة المناسبة
  const getIcon = (iconName) => {
    const iconMap = {
      'Info': <FaLightbulb />,
      'Visibility': <FaEye />,
      'Edit': <FaEnvelope />,
      'Add': <FaBullseye />,
      'Title': <FaUserAlt />,
      'Subject': <FaUsers />,
      'ColorLens': <FaGlobe />,
      'List': <FaBullseye />
    };
    return iconMap[iconName] || <FaLightbulb />;
  };

  // مكون البطاقة الجميلة
  const PrettyCard = ({ title, color, children, customGradient }) => {
    const gradient = customGradient || `linear-gradient(180deg, ${color} 0%, ${darkenColor(color, 0.3)} 100%)`;
    
    return (
      <Box
        sx={{
          position: 'relative',
          borderRadius: '28px',
          p: { xs: 3, sm: 4 },
          mt: 5,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: "1px 1px 3px 1px rgba(0, 0, 0, 0.3)",
          overflow: 'hidden',
          direction: 'rtl',
          fontFamily: 'Cairo, sans-serif',
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

  // مكون عرض القسم
  const SectionDisplay = ({ section, isFirst = false }) => {
    const sectionId = section.id;
    const color = section.color || defaultColors[section.id] || '#4a90e2';
    const gradient = `linear-gradient(180deg, ${color} 0%, ${darkenColor(color, 0.3)} 100%)`;

    return (
      <PrettyCard
        title={section.title}
        color={color}
        customGradient={gradient}
      >
        {/* المحتوى الخاص بالقسم الأول (نبذة عن المركز) */}
        {isFirst && section.id === 'about' && (
          <Box sx={{ mb: 3 }}>
            {/* شعار المركز الجماهيري - يظهر فقط في القسم الأول */}
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: "1.2rem", 
                lineHeight: 2, 
                textAlign: "justify",
                mb: 3
              }}
            >
              {section.content}
            </Typography>

            <Box sx={{ fontSize: "1.2rem", color: '#1976D2' }}>
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
          </Box>
        )}

        {/* عرض المحتوى للأقسام الأخرى */}
        {(!isFirst || section.id !== 'about') && (
          <>
            {/* عرض المحتوى حسب النوع */}
            {section.type === 'list' && Array.isArray(section.content) ? (
              <Box component="ol" sx={{ px: 2 }}>
                {(expandedSections[sectionId] 
                  ? section.content 
                  : section.content.slice(0, 3)
                ).map((item, index) => (
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
                    {item}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: "1.2rem", 
                  lineHeight: 2, 
                  textAlign: "justify"
                }}
              >
                {expandedSections[sectionId] 
                  ? section.content 
                  : truncateText(section.content, 200)
                }
              </Typography>
            )}

            {/* زر اقرأ المزيد */}
            {((section.type === 'list' && Array.isArray(section.content) && section.content.length > 3) ||
              (section.type !== 'list' && section.content && section.content.length > 200)) && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  onClick={() => toggleSection(sectionId)}
                  sx={{
                    color: color,
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                      opacity: 0.8
                    }
                  }}
                >
                  {expandedSections[sectionId] ? 'عرض أقل' : 
                    (section.type === 'list' ? `عرض جميع العناصر (${section.content.length})` : 'اقرأ المزيد')
                  }
                </Button>
              </Box>
            )}
          </>
        )}

        {/* زر "اقرأ المزيد" للقسم الأول */}
        {isFirst && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography
              onClick={() => toggleSection('showMore')}
              sx={{
                color: color,
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'Cairo, sans-serif',
                '&:hover': {
                  opacity: 0.8,
                  textDecoration: 'underline',
                }
              }}
            >
              {expandedSections['showMore'] ? 'عرض أقل' : 'اقرأ المزيد'}
            </Typography>
          </Box>
        )}
      </PrettyCard>
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
          const data = docSnap.data();
          
          // التعامل مع الهيكل الجديد
          if (data.sections) {
            setAboutData(data);
          } else {
            // تحويل البيانات القديمة للعرض
            const sections = [];
            
            if (data.about_us_text) {
              sections.push({
                id: 'about',
                title: 'نبذة عن المركز',
                content: data.about_us_text,
                type: 'text',
                color: '#4a90e2',
                icon: 'Info'
              });
            }
            
            if (data.vision) {
              sections.push({
                id: 'vision',
                title: data.vision_title || 'الرؤية',
                content: data.vision,
                type: 'text',
                color: '#f7971e',
                icon: 'Visibility'
              });
            }
            
            if (data.message) {
              sections.push({
                id: 'message',
                title: data.message_title || 'الرسالة',
                content: data.message,
                type: 'text',
                color: '#004e92',
                icon: 'Edit'
              });
            }
            
            if (data.justifications) {
              sections.push({
                id: 'justifications',
                title: data.justifications_title || 'المبررات',
                content: data.justifications,
                type: 'text',
                color: '#c31432',
                icon: 'Subject'
              });
            }
            
            if (data.goals && data.goals.length > 0) {
              sections.push({
                id: 'goals',
                title: data.goals_title || 'الأهداف',
                content: data.goals,
                type: 'list',
                color: '#3e833e',
                icon: 'Add'
              });
            }
            
            // إضافة الأقسام المخصصة إذا كانت موجودة
            if (data.custom_sections) {
              data.custom_sections.forEach((section) => {
                sections.push({
                  ...section,
                  type: section.type || 'text'
                });
              });
            }
            
            setAboutData({ sections });
          }
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    fetchAboutData();
  }, []);

  if (!aboutData || !aboutData.sections || aboutData.sections.length === 0) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography align="center">جاري تحميل معلومات عن المركز...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <Box mb={4}>
        <HeroSection pageId="aboutUs" />
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6, px: 2, position: 'relative', zIndex: 3, flex: 1 }}>
        
        {/* عرض الأقسام */}
        {aboutData.sections.map((section, index) => {
          const isFirstSection = index === 0;
          const shouldShow = isFirstSection || expandedSections['showMore'];
          
          if (!shouldShow) return null;
          
          return (
            <SectionDisplay
              key={section.id}
              section={section}
              isFirst={isFirstSection}
            />
          );
        })}

      </Container>
    </Box>
  );
}