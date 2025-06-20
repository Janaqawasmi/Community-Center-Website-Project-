import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, Typography, Container, Grid } from '@mui/material';
import Slider from 'react-slick';
import HeroSection from "../components/HeroSection";
import { sectionColors } from '../constants/sectionMeta';
import { useParams, useNavigate } from 'react-router-dom';

// Helper: Map Arabic category name to sectionColors key
const categoryColorMap = {
  "دورة": "courses",
  "أمسية": "evening",
  "فعالية": "activity",
  "برنامج": "program",
  "الكل": "default",
};

function darkenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) - amount * 255;
  let g = ((num >> 8) & 0x00FF) - amount * 255;
  let b = (num & 0x0000FF) - amount * 255;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

const PrettyCard = ({ title, color, children }) => (
  <Box
    sx={{
      position: 'relative',
      borderRadius: '28px',
      p: { xs: 3, sm: 4 },
      mt: 5,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      direction: 'rtl',
      minHeight: '200px',
      background: '#fff'
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
        background: `linear-gradient(135deg, ${color}, ${darkenColor(color, 0.2)})`,
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

function NewsDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const docRef = doc(db, 'News', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNews({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error('News not found');
      }
    };
    fetchNews();
  }, [id]);

  if (!news)
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>جاري التحميل...</p>;

  // Get category key and color
  const categoryKey = categoryColorMap[news.category] || "default";
  const newsColor = sectionColors[categoryKey] || '#003366';

  const fullText = news.full_description || '';
  // Show the toggle button if text is long
  const shouldShowToggle = fullText.length > 400;

  // Clamp style: 4 lines if not expanded, full text if expanded
  const textSx = !expanded
    ? {
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textAlign: 'right',
        transition: 'max-height 0.3s',
        fontSize: '1.1rem',
        lineHeight: 2,
        fontWeight: 'normal',
        fontStyle: 'normal',
      }
    : {
        textAlign: 'right',
        transition: 'max-height 0.3s',
        fontSize: '1.1rem',
        lineHeight: 2,
        fontWeight: 'normal',
        fontStyle: 'normal',
      };

  const sliderSettings = {
    dots: true,
    appendDots: dots => (
      <Box sx={{ textAlign: 'center', mt: 1 }}>{dots}</Box>
    ),
    customPaging: () => (
      <span
        style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#888',
          margin: '0 2px',
          opacity: 0.9,
        }}
      />
    ),
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: false,
  };

  return (
    <Box
      sx={{
        direction: 'rtl',
        backgroundColor: '#fcfcfc',
        minHeight: '100vh',
        py: 0,
      }}
    >
      <HeroSection pageId="news" />

      {/* تصفح المزيد من الأخبار */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          mt: 2,
          mb: 2,
          px: 2,
          direction: 'rtl',
        }}
      >
        <Button
          onClick={() => navigate('/News')}
          disableRipple
          sx={{
            position: 'relative',
            padding: '10px 26px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: newsColor,
            backgroundColor: 'transparent',
            borderRadius: '28px',
            overflow: 'hidden',
            transition: 'all 0.4s ease-in-out',
            boxShadow: `15px 15px 15px ${newsColor}`,
            textTransform: 'none',
            minWidth: 'auto',
            '&:focus:not(:focus-visible)': {
              outline: 'none',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '30px',
              height: '30px',
              border: `0px solid transparent`,
              borderTopColor: newsColor,
              borderRightColor: newsColor,
              borderTopRightRadius: '22px',
              transition: 'all 0.3s ease-in-out',
              boxSizing: 'border-box',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '30px',
              height: '30px',
              border: `0px solid transparent`,
              borderBottomColor: newsColor,
              borderLeftColor: newsColor,
              borderBottomLeftRadius: '22px',
              transition: 'all 0.3s ease-in-out',
              boxSizing: 'border-box',
            },
            '&:hover::before': {
              width: '100%',
              height: '100%',
              border: `2px solid ${newsColor}`,
              borderRadius: '28px',
              borderLeft: 'none',
              borderBottom: 'none',
            },
            '&:hover::after': {
              width: '100%',
              height: '100%',
              border: `2px solid ${newsColor}`,
              borderRadius: '28px',
              borderRight: 'none',
              borderTop: 'none',
              textShadow: '0 0 5px rgba(0,0,0,0.1)',
            },
            '&:hover': {
              boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
            },
          }}
        >
          تصفح المزيد من الأخبار
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 2, pb: 6, px: 2, position: 'relative', zIndex: 3, flex: 1 }}>
        <Grid container spacing={4}>
          {/* Main News Content Card */}
          <Grid item xs={12} md={8} sx={{ mt: { xs: -3, md: -4 } }}>
            <PrettyCard title="عن الخبر" color={newsColor}>
              <Typography sx={textSx}>
                {fullText}
              </Typography>

              {/* المزيد / إخفاء Button */}
              {shouldShowToggle && (
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <button
                    onClick={() => setExpanded(!expanded)}
                    style={{
                      color: 'red',
                      fontWeight: 'bold',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    {expanded ? 'إخفاء' : 'المزيد'}
                  </button>
                </div>
              )}
            </PrettyCard>
          </Grid>
          {/* Image Slider */}
          <Grid item xs={12} md={4}>
            {Array.isArray(news.Pictures) && news.Pictures.length > 0 && (
              <Box
                sx={{
                  width: '100%',
                  minHeight: 300,
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  background: '#fff',
                  display: 'block',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: 0,
                }}
              >
                <Slider {...sliderSettings}>
                  {news.Pictures.map((url, i) => (
                    <Box key={i} sx={{ width: '100%', height: 300, borderRadius: 3, overflow: 'hidden' }}>
                      <img src={url} alt={`desc-img-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Box>
                  ))}
                </Slider>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default NewsDetail;