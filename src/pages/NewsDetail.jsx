import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, Container, Grid } from '@mui/material';
import Slider from 'react-slick';
import HeroSection from "../components/HeroSection";
import { sectionColors } from '../constants/sectionMeta';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SectionScrollButton from "../components/sections/SectionScrollButton";
import ExpandableText from '../components/ExpandableText';
import PrettyCard from '../components/layout/PrettyCard'; 
import RoundedButton from '../components/layout/Buttons/RoundedButton';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { trackPageView } from '../components/Data Analysis/utils/trackPageView';

const categoryToSectionId = {
  "أمسية": "section_evening",
  "فعالية": "section_activity",
  "دورة": "section_courses",
  "برنامج": "section_program",
};

function NewsDetail() {
  const navigate = useNavigate();
  const location = useLocation();
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
useEffect(() => {
  if (news) {
    const path = news.slug ? `/news/${news.slug}` : `/news/${id}`;
    trackPageView(path);
  }
}, [news, id]);
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
    <Box sx={{ direction: 'rtl', minHeight: '100vh', py: 0 }}>
      <HeroSection pageId="news" title={news.title} />



      <Container maxWidth="lg" sx={{ pt: 2, pb: 6, px: 2 }}>
        <Grid container spacing={4} alignItems="stretch">
          {/* Right: عن الخبر */}
          <Grid item xs={12} md={6}>
  <Box sx={{ height: '100%' }}>
    <PrettyCard title="عن الخبر">
      <Box sx={{ textAlign: 'right', fontSize: '1rem', color: '#444' }}>
        <ExpandableText
          text={news.full_description}
          expanded={expanded}
          sx={{ fontSize: '1.2rem', lineHeight: 2 }}
        />
        <Box sx={{ textAlign: 'center', mt: 0.000001 }}>
          <button
            onClick={() => setExpanded(prev => !prev)}
            style={{
              color: 'red',
              fontWeight: 'bold',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            
          </button>
           <Box sx={{ display: 'flex', justifyContent: 'right', mt: 0.1, mb: 6, px: 7,pr: 0.01 }}>
  <RoundedButton
    label="تصفح المزيد من الأخبار"
    onClick={() => {
      if (location.pathname !== '/news') {
        navigate('/news');
      } else {
        navigate('/', { replace: true });
        setTimeout(() => navigate('/news'), 0);
      }
      
    }}
    color={newsColor}
    
  />
</Box>
        </Box>
      </Box>
    </PrettyCard>
   

  </Box>
</Grid>


         <Grid item xs={12} md={6}>
  {Array.isArray(news.Pictures) && news.Pictures.length > 0 && (
    <Box
      sx={{
        width:'100%',
        height: 360, // ✅ fixed height in pixels
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
   <Box sx={{ position: 'relative' }}>
  <Slider {...sliderSettings}>
    {news.Pictures.map((url, i) => (
      <Box key={i} sx={{ width: '100%', height: 360 }}>
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

  {/* Optional: spacing below the slider for dots */}
  <Box sx={{ height: 30 }} />
</Box>

    </Box>
    
  )}
</Grid>

        </Grid>
      </Container>
    </Box>
    
  );
}

export default NewsDetail;