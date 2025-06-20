import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, Container, Grid, Button } from '@mui/material';
import Slider from 'react-slick';
import HeroSection from "../components/HeroSection";
import { sectionColors } from '../constants/sectionMeta';
import { useParams, useNavigate } from 'react-router-dom';
import SectionScrollButton from "../components/sections/SectionScrollButton";
import ExpandableText from '../components/ExpandableText';
import PrettyCard from '../components/layout/PrettyCard';


const categoryToSectionId = {
  "أمسية": "section_evening",
  "فعالية": "section_activity",
  "دورة": "section_courses",
  "برنامج": "section_program",
};

function NewsDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [news, setNews] = useState(null);

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

  const sectionId = categoryToSectionId[news.category] || 'section_default';
  const newsColor = sectionColors[sectionId] || '#003366';

  const sliderSettings = {
    dots: true,
    appendDots: dots => <Box sx={{ textAlign: 'center', mt: 1 }}>{dots}</Box>,
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
  };

  return (
    <Box sx={{ direction: 'rtl', backgroundColor: '#fcfcfc', minHeight: '100vh', py: 0 }}>
      <HeroSection pageId="news" />

      <Box sx={{ display: 'flex', justifyContent: 'right', mt: 7, mb: 6, px: 7 }}>
        <SectionScrollButton
          label="تصفح المزيد من الأخبار"
          sectionId={sectionId}
          sectionColor={newsColor}
          onClick={() => navigate('/news')}
            sx={{
            backgroundColor: '#003366',
            color: 'white',
            fontWeight: 'bold',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: newsColor,
            },
          }}
        />
      </Box>
      <Container maxWidth="lg" sx={{ pt: 2, pb: 6, px: 2 }}>
        <Grid container spacing={4} alignItems="stretch">
          {/* Right: عن الخبر */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%' }}>
              <PrettyCard title="عن الخبر" color={newsColor}>
                <Box
                  sx={{
                    mt: 5,
                    textAlign: 'right',
                    fontSize: '1rem',
                    color: '#444',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                  }}
                >
                  <ExpandableText
                    text={news.full_description || ''}
                    sx={{ fontSize: '1.2rem', lineHeight: 2 }}
                    limit={400}
                    expandText="المزيد"
                    collapseText="إخفاء"
                    expandSx={{
                      mt: 2,
                      color: 'red',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: 'none',
                      border: 'none',
                      display: 'block'
                    }}
                    collapseSx={{
                      mt: 2,
                      color: 'red',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: 'none',
                      border: 'none',
                      display: 'block'
                    }}
                  />
                </Box>
              </PrettyCard>
            </Box>
          </Grid>

          {/* Left: Image Slider */}
          <Grid item xs={12} md={6}>
            {Array.isArray(news.Pictures) && news.Pictures.length > 0 && (
              <Box
                sx={{
                  height: '100%',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <Slider {...sliderSettings}>
                  {news.Pictures.map((url, i) => (
                    <Box key={i} sx={{ width: '100%', height: '100%', display: 'flex' }}>
                      <img
                        src={url}
                        alt={`desc-img-${i}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
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
