import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { iconMap, sectionColors } from '../constants/sectionMeta';
import Slider from 'react-slick';

function SectionPage() {
  const { id } = useParams();
  const [section, setSection] = useState(null);

  useEffect(() => {
    const fetchSection = async () => {
      const docRef = doc(db, 'sections', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSection({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error("Section not found");
      }
    };
    fetchSection();
  }, [id]);

  if (!section) return <p style={{ textAlign: 'center', marginTop: '50px' }}>جاري التحميل...</p>;

  const sectionColor = sectionColors[section.id] || '#607d8b';
  const sectionIcon = iconMap[section.id] || '📌';

  const PrettyCard = ({ title, icon, color, children }) => (
    <Paper
      elevation={4}
      sx={{
        position: 'relative',
        p: 4,
        pt: 7,
        bgcolor: '#fff',
        borderRadius: 3,
        borderRight: `6px solid ${color}`,
        overflow: 'visible',
        boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
        mt: 4,
        zIndex: 3,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -18,
          right: 24,
          background: color,
          color: '#fff',
          px: 2.5,
          py: 0.5,
          borderRadius: '20px',
          fontSize: '1rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 4,
        }}
      >
        {icon} {title}
      </Box>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Paper>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        direction: 'rtl',
        fontFamily: 'Cairo, Arial, sans-serif',
        color: '#222',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {section.backgroundImageUrl && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${section.backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.15,
            zIndex: 0,
          }}
        />
      )}

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(to left, ${sectionColor}, ${sectionColor}99)`,
          color: '#fff',
          py: 6,
          px: 3,
          borderBottomRightRadius: '80px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <Container>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '3.5rem' }}>
                {sectionIcon} {section.title}
              </Typography>
              {section.subtitle && (
                <Typography variant="h5" mt={2} sx={{ opacity: 0.9, fontWeight: 'bold', fontSize: '1.6rem' }}>
                  {section.subtitle}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Image Carousel */}
      {Array.isArray(section.imageGallery) && section.imageGallery.length > 0 && (
        <Box sx={{ mt: 5, px: 3, position: 'relative', zIndex: 3 }}>
          <Slider {...sliderSettings}>
            {section.imageGallery
              .filter((url, index, self) => self.indexOf(url) === index) // Remove duplicates
              .map((url, idx) => (
                <Box key={idx}>
                  <img
                    src={url}
                    alt={`Gallery ${idx}`}
                    style={{
                      width: '100%',
                      maxHeight: '450px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      marginBottom: '30px',
                    }}
                  />
                </Box>
              ))}
          </Slider>
        </Box>
      )}

      {/* Main Content */}
      <Container sx={{ py: 5, position: 'relative', zIndex: 3, flex: 1 }}>
        <Grid container spacing={4}>
          {section.description && (
            <Grid item xs={12}>
              <PrettyCard title={section.description_title} icon="📝" color={sectionColor}>
                <Typography sx={{ lineHeight: 2, fontWeight: 'bold', fontSize: '1.4rem' }}>
                  {section.description}
                </Typography>
              </PrettyCard>
            </Grid>
          )}

          {section.goals?.length > 0 && (
            <Grid item xs={12}>
              <PrettyCard title={section.goals_title} icon="🎯" color={sectionColor}>
                <ul style={{ paddingRight: 20, lineHeight: 2, fontSize: '1.3rem', fontWeight: 'bold' }}>
                  {section.goals.map((goal, i) => (
                    <li key={i}>{goal}</li>
                  ))}
                </ul>
              </PrettyCard>
            </Grid>
          )}

          {section.programs?.length > 0 && (
            <Grid item xs={12}>
              <PrettyCard title={section.programs_title} icon="📋" color={sectionColor}>
                <ul style={{ paddingRight: 20, lineHeight: 2, fontSize: '1.3rem', fontWeight: 'bold' }}>
                  {section.programs.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </PrettyCard>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Footer Note - at bottom and subtle */}
      <Box
        sx={{
          mt: 'auto',
          py: 2,
          textAlign: 'center',
          fontStyle: 'italic',
          fontSize: '0.95rem',
          color: '#888',
          borderTop: '1px solid #eee',
          zIndex: 3,
          position: 'relative',
        }}
      >
        [رسم توضيحي أو صورة للقسم ستضاف لاحقاً]
      </Box>
    </Box>
  );
}

export default SectionPage;
