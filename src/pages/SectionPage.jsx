import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { iconMap, sectionColors } from '../constants/sectionMeta';
import Slider from 'react-slick';

function SectionPage() {
  const sectionsWithCourses = ['section_sports', 'section_women', 'section_culture', 'section_curricular'];
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
      elevation={6}
      sx={{
        position: 'relative',
        p: 4,
        pt: 7,
        bgcolor: '#fff',
        borderRadius: '20px',
        borderRight: `6px solid ${color}`,
        boxShadow: '0px 4px 16px rgba(0,0,0,0.08)',
        mt: 4,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: '0px 6px 20px rgba(0,0,0,0.12)',
        },
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
          borderRadius: '30px',
          fontSize: '1rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 4,
          whiteSpace: 'nowrap'
        }}
      >
        {icon} {title}
      </Box>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Paper>
  );

  const singleImageSliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', direction: 'rtl', fontFamily: 'Cairo, Arial, sans-serif', color: '#222', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ background: `linear-gradient(to left, ${sectionColor}, ${sectionColor}99)`, color: '#fff', py: 6, px: 3, borderBottomRightRadius: '80px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', zIndex: 2, position: 'relative' }}>
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

      <Container sx={{ py: 5, position: 'relative', zIndex: 3, flex: 1 }}>
        <Grid container spacing={4}>
          {/* الرؤية */}
          {section.description && (
            <Grid item xs={12} md={6}>
              <PrettyCard title={section.description_title || "الرؤية"} icon="📝" color={sectionColor}>
                <Typography sx={{ fontSize: '1.3rem', lineHeight: 2 }}>{section.description}</Typography>
              </PrettyCard>
            </Grid>
          )}

          {/* صور */}
          {section.imageGallery?.length > 0 && (
            <Grid item xs={12} md={6}>
              <Slider {...singleImageSliderSettings}>
                {section.imageGallery.map((url, i) => (
                  <Box key={i} sx={{ width: '100%', height: 300, borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <img src={url} alt={`desc-img-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </Box>
                ))}
              </Slider>
            </Grid>
          )}
        </Grid>

        {/* نادي الحلقات */}
        {section.hallDescription && (
          <PrettyCard title={section.hallDescription_title || "نادي الحلقات والحلقات التشغيلية"} icon="🏢" color={sectionColor}>
            <Typography sx={{ fontSize: '1.3rem', lineHeight: 2 }}>{section.hallDescription}</Typography>
          </PrettyCard>
        )}

        {/* الأهداف */}
        {section.goals?.length > 0 && (
          <PrettyCard title={section.goals_title || "الأهداف (نادي الحلقات)"} icon="🎯" color={sectionColor}>
            <ul style={{ fontSize: '1.2rem', paddingRight: 20, lineHeight: 2 }}>
              {section.goals.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </PrettyCard>
        )}

        {section.extra_goals?.length > 0 && (
          <PrettyCard title={section.extra_goals_title || "الأهداف (الحلقات التشغيلية)"} icon="🎯" color={sectionColor}>
            <ul style={{ fontSize: '1.2rem', paddingRight: 20, lineHeight: 2 }}>
              {section.extra_goals.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </PrettyCard>
        )}

        {section.programs?.length > 0 && (
          <PrettyCard title={section.programs_title || "البرامج والأنشطة"} icon="📋" color={sectionColor}>
            <ul style={{ fontSize: '1.2rem', paddingRight: 20, lineHeight: 2 }}>
              {section.programs.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </PrettyCard>
        )}

        {section.programCards?.length > 0 && (
          <>
            <Box sx={{ textAlign: 'center', mt: 6, mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: sectionColor, fontFamily: 'Cairo, Arial, sans-serif', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                🧩 برامجنا الخاصة بالقسم
              </Typography>
            </Box>
            <Grid container spacing={4} sx={{ px: 3, pb: 5 }}>
              {section.programCards.map((program, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Paper elevation={4} sx={{ height: '100%', overflow: 'hidden', borderRadius: 3, display: 'flex', flexDirection: 'column', backgroundColor: '#fff', position: 'relative' }}>
                    {program.image && (
                      <Box sx={{ height: 180, backgroundImage: `url(${program.image})`, backgroundSize: 'contain', backgroundColor: '#f2f2f2', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
                    )}
                    <Box sx={{ p: 2, textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: sectionColor }}>{program.name}</Typography>
                      <Typography sx={{ mt: 1, color: '#444' }}>{program.description}</Typography>
                      <Typography sx={{ mt: 1 }}>📝 <strong>الشروط:</strong> {program.conditions}</Typography>
                      <Typography sx={{ mt: 1 }}>🎓 <strong>المؤهلات:</strong> {program.qualifications}</Typography>
                      <Typography sx={{ mt: 1 }}>📞 <strong>هاتف:</strong> <span style={{ direction: 'ltr', unicodeBidi: 'embed' }}>{program.phone}</span></Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {sectionsWithCourses.includes(section.id) && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Box component="a" href={`/programs?section=${section.id}`} sx={{ backgroundColor: sectionColor, color: '#fff', textDecoration: 'none', px: 4, py: 1.5, borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', display: 'inline-block', transition: '0.3s', '&:hover': { backgroundColor: '#333' } }}>
              🎓 عرض جميع الدورات الخاصة بالقسم
            </Box>
          </Box>
        )}

        {section.nurseries?.length > 0 && (
          <PrettyCard title="حضاناتنا" icon="🏫" color={sectionColor}>
            <Grid container spacing={2}>
              {section.nurseries.map((nursery, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: sectionColor }}>{nursery.name}</Typography>
                    <Typography sx={{ mt: 1 }}>📍 <strong>الموقع:</strong> {nursery.location}</Typography>
                    <Typography>🕒 <strong>الدوام:</strong> {nursery.hours}</Typography>
                    <Typography>📞 <strong>هاتف:</strong> <span style={{ direction: 'ltr', unicodeBidi: 'embed' }}>{nursery.phone}</span></Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </PrettyCard>
        )}

        {section.kindergartens?.length > 0 && (
          <PrettyCard title="روضاتنا" icon="🏫" color={sectionColor}>
            <Grid container spacing={2}>
              {section.kindergartens.map((kg, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: sectionColor }}>{kg.name}</Typography>
                    <Typography sx={{ mt: 1 }}>📍 <strong>الموقع:</strong> {kg.location}</Typography>
                    <Typography>🕒 <strong>الدوام:</strong> {kg.hours}</Typography>
                    <Typography>📞 <strong>هاتف:</strong> <span style={{ direction: 'ltr', unicodeBidi: 'embed' }}>{kg.phone}</span></Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </PrettyCard>
        )}
      </Container>
    </Box>
  );
}

export default SectionPage;