import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, Typography, Container, Grid, Paper, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Slider from 'react-slick';

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

  if (!news) return <p style={{ textAlign: 'center', marginTop: '50px' }}>جاري التحميل...</p>;

  const newsColor = '#003366';
  const newsIcon = '📰';
  const fullText = news.full_description || '';
  const shouldShowToggle = fullText.length > 300;

  // Text clamp for "اقرأ المزيد"
  const clampSx = !showMore
    ? {
        display: '-webkit-box',
        WebkitLineClamp: 5,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }
    : {};

  // Slider settings: dots under image, no arrows
  const sliderSettings = {
    dots: true,
    appendDots: dots => (
      <Box sx={{ textAlign: 'center', mt: 1 }}>{dots}</Box>
    ),
    customPaging: () => (
      <span
        style={{
          display: 'inline-block',
          width: 8, // smaller dot
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
      {/* Orange header - right under navbar */}
      <Box
        sx={{
          backgroundColor: newsColor,
          color: '#fff',
          textAlign: 'center',
          py: 4, // smaller header
          px: 3,
          borderBottomRightRadius: '60px', // smaller curve
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

      {/* Content Grid */}
      <Container sx={{ mt: 3, maxWidth: 'md' }}> {/* smaller top margin and container */}
        <Grid
          container
          spacing={2} // smaller gap between boxes
          alignItems="stretch"
        >
          {/* Main News Content */}
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper
              elevation={4}
              sx={{
                position: 'relative',
                p: 2,         // smaller padding
                pt: 5,        // less padding top
                bgcolor: '#fff',
                borderRadius: 2,
                borderRight: `5px solid ${newsColor}`,
                boxShadow: '0 4px 10px rgba(0,0,0,0.09)',
                minHeight: 300,      // smaller box
                maxHeight: 260,      // control max size
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              {/* Tag */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -14,
                  right: 18,
                  background: newsColor,
                  color: '#fff',
                  px: 2,
                  py: 0.5,
                  borderRadius: '18px',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  boxShadow: '0 1.5px 7px rgba(0,0,0,0.13)',
                }}
              >
                {newsIcon} عن الخبر
              </Box>

              {/* Full Description (Clamped or Expanded) */}
              <Typography
                sx={{
                  lineHeight: 1.7,
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                  fontSize: '0.95rem', // even smaller
                  transition: 'max-height 0.3s',
                  textAlign: 'right',
                  ...clampSx,
                }}
              >
                {fullText}
              </Typography>

              {/* Read More Toggle */}
              {shouldShowToggle && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 0.5 }}>
                  <Typography
                    sx={{
                      color: '#888',
                      fontWeight: 'normal',
                      mb: 0,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                    onClick={() => setShowMore(!showMore)}
                  >
                    اقرأ المزيد
                  </Typography>
                  <IconButton
                    onClick={() => setShowMore(!showMore)}
                    disableRipple
                    disableFocusRipple
                    sx={{
                      color: '#888',
                      fontSize: 32,
                      mt: '-4px',
                      background: 'none !important',
                      border: 'none',
                      boxShadow: 'none',
                      outline: 'none',
                      '&:hover': { background: 'none !important', color: '#888', outline: 'none', boxShadow: 'none', border: 'none' },
                      '&:focus': { outline: 'none', boxShadow: 'none', border: 'none' },
                      '&:active': { outline: 'none', boxShadow: 'none', border: 'none' },
                    }}
                  >
                    {showMore ? <ExpandLessIcon fontSize="inherit" /> : <ExpandMoreIcon fontSize="inherit" />}
                  </IconButton>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Left Side Slider for Pictures */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', mt: -1 }}>
            {Array.isArray(news.Pictures) && news.Pictures.length > 0 && (
              <Box
                sx={{
                  width: '100%',
                  minHeight: 300,    // smaller image box
                  maxHeight: 260,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.07)',
                  background: '#fff',
                  display: 'block',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: 0,
                }}
              >
                <Slider {...sliderSettings}>
                  {news.Pictures.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                       
                        width: '100%',
                        height: { xs: 120, md: 180 },
                        display: 'block',
                        alignItems: 'center',
                        justifyContent: 'center',
                        m: 0,
                        p: 0,
                        background: '#fff',
                      }}
                    >
                      <Box
                        component="img"
                        src={url}
                        alt={`slide-${index}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 0,
                          display: 'block',
                          m: 0,
                        }}
                      />
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
