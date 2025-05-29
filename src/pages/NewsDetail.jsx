import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, Typography, Container, Grid, Paper, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Slider from 'react-slick';
import HeroSection from "../components/HeroSection";
// Helper to darken blue for gradient
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

// Styled card, same as SectionPage
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
      fontFamily: 'Cairo, sans-serif',
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
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [showMore, setShowMore] = useState(false);

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

  const newsColor = '#003366';
  const newsIcon = '📰';
  const fullText = news.full_description || '';
  const shouldShowToggle = fullText.length > 400;

  // Text clamp for "اقرأ المزيد"
  const clampSx = !showMore
    ? {
        display: '-webkit-box',
        WebkitLineClamp: 6,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }
    : {};

  // Slider settings
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
        fontFamily: 'Cairo, Arial, sans-serif',
        backgroundColor: '#fcfcfc',
        minHeight: '100vh',
        py: 0,
      }}
    >
      {/* Blue header - like SectionPage */}
      <Box
        sx={{
          backgroundColor: newsColor,
          color: '#fff',
          textAlign: 'center',
          py: 4,
          px: 3,
          borderBottomRightRadius: '60px',
          boxShadow: '0 6px 15px rgba(0,0,0,0.12)',
          mt: 0,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {news.title} {newsIcon}
        </Typography>
        {news.subtitle && (
          <Typography variant="h6" mt={1}>
            {news.subtitle}
          </Typography>
        )}
      </Box>

      <Container maxWidth="lg" sx={{ pt: 2, pb: 6, px: 2, position: 'relative', zIndex: 3, flex: 1 }}>
        <Grid container spacing={4}>
          {/* Main News Content Card */}
          <Grid item xs={12} md={8} sx={{ mt: { xs: -3, md: -4 } }}>
            <PrettyCard title="عن الخبر" color={newsColor}>
              <Typography
                sx={{
                  lineHeight: 2,
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                  fontSize: '1.1rem',
                  transition: 'max-height 0.3s',
                  textAlign: 'right',
                  ...clampSx,
                }}
              >
                {fullText}
              </Typography>

              {/* Read More Toggle */}
              {shouldShowToggle && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                  <Typography
                    sx={{
                      color: newsColor,
                      fontWeight: 'bold',
                      mb: 0,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? 'إخفاء' : 'اقرأ المزيد'}
                  </Typography>
                  <IconButton
                    onClick={() => setShowMore(!showMore)}
                    disableRipple
                    sx={{
                      color: newsColor,
                      fontSize: 32,
                      mt: '-4px',
                      background: 'none !important',
                      border: 'none',
                      boxShadow: 'none',
                      outline: 'none',
                      '&:hover': { background: 'none !important' },
                    }}
                  >
                    {showMore ? <ExpandLessIcon fontSize="inherit" /> : <ExpandMoreIcon fontSize="inherit" />}
                  </IconButton>
                </Box>
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
