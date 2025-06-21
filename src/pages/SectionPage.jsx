import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, Typography, Container, Grid, Paper, Button,Stack } from '@mui/material';
 import { sectionColors } from '../constants/sectionMeta';
import Slider from 'react-slick';
import Collapse from '@mui/material/Collapse';
import HeroSection from "../components/HeroSection";
import ExpandableText from '../components/ExpandableText';
import ExpandableList from '../components/ExpandableList';
import SectionScrollButton from '../components/sections/SectionScrollButton';
import PrettyCard from '../components/layout/PrettyCard';

function SectionPage() {
  const [expanded, setExpanded] = useState(false);
const navigate = useNavigate();

  const sectionsWithCourses = ['section_sports', 'section_women', 'section_culture', 'section_curricular'];
  const { id } = useParams();
  const [section, setSection] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
 const getScrollButtonData = () => {
  switch (section.id) {
    case 'section_culture':
    case 'section_curricular':
    case 'section_sports':
    case 'section_women':
      return { label: " تصفّح جميع الدورات", targetId: "courses" };
    case 'section_elderly':
    case 'section_special':
    case 'section_youth':
      return { label: " برامج القسم", targetId: "programs" };
    case 'section_kindergarten':
      return { label: " استكشف الروضات", targetId: "kindergartens" };
    case 'section_nursery':
      return { label: " تعرّف على الحضانات", targetId: "nurseries" };
    default:
      return null;
  }
};

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
    <Box sx={{ position: 'relative', minHeight: '100vh', direction: 'rtl', color: '#222', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <HeroSection pageId={id} />

   <Container maxWidth="lg" sx={{ pt: 8, pb: 8, px: 0, position: 'relative', zIndex: 3, flex: 1 }}>

   {(() => {
  const buttonData = getScrollButtonData();
  if (!buttonData) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'right',
        mb: 4,
        direction: 'rtl',
      }}
    >
      <SectionScrollButton
        label={buttonData.label}
        sectionId={section.id}
        sectionColor={sectionColor}
        targetId={buttonData.targetId}
      />
    </Box>
  );
})()}



{/* ✅ Image and description side by side */}
{section.imageGallery?.length > 0 && (
<Grid
  container
  spacing={4}
  sx={{ mb: 4, alignItems: 'flex-start' }} // align top
>
  <Grid
    item
    xs={12}
    md={6}
    sx={{ 
      order: { xs: 1, md: 2 }, // text on right
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
  >
    <Box sx={{ width: '100%' }}>
      <Slider {...singleImageSliderSettings}>
        {section.imageGallery.map((url, i) => (
          <Box
            key={i}
            sx={{
              width: '100%',
              height: 350,
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
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
  </Grid>

  <Grid
    item
    xs={12}
    md={6}
    sx={{
      order: { xs: 2, md: 1 }, // image on left  
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
  >
    <Box sx={{ width: '100%' }}>
      {section.description && (
        <PrettyCard title={section.description_title || "الرؤية"} color={sectionColor}>
          <Box sx={{ mt: 5, textAlign: 'right', fontSize: '1rem', color: '#444' }}>
            <ExpandableText
              text={section.description}
              sx={{ fontSize: '1.2em', lineHeight: 2 }}
            />
            <Box sx={{ textAlign: 'center', mt: 2 }}>
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
            </Box>
          </Box>
        </PrettyCard>
      )}
    </Box>
  </Grid>
</Grid>


)}

{/* ✅ Everything else hidden initially */}
<Grid container spacing={4}>
  <Grid item xs={12}>
    <Collapse in={expanded}>
      {section.hallDescription && (
        <PrettyCard title={section.hallDescription_title || "نادي الحلقات"} color={sectionColor}>
          <ExpandableText text={section.hallDescription} sx={{ fontSize: '1.1em', lineHeight: 2 }} />
        </PrettyCard>
      )}

      {section.goals?.length > 0 && (
        <PrettyCard title={section.goals_title || "الأهداف"} color={sectionColor}>
          <ExpandableList items={section.goals} />
        </PrettyCard>
      )}

      {section.extra_goals?.length > 0 && (
        <PrettyCard title={section.extra_goals_title || "أهداف إضافية"} color={sectionColor}>
          <ExpandableList items={section.extra_goals} />
        </PrettyCard>
      )}

      {section.programs?.length > 0 && (
        <PrettyCard title={section.programs_title || "البرامج والأنشطة"} color={sectionColor}>
          <ExpandableList items={section.programs} />
        </PrettyCard>
      )}
    </Collapse>
  </Grid>
</Grid>



        {section.programCards?.length > 0 && (
          <>
            <Box id="programs" sx={{ textAlign: 'center', mt: 6, mb: 3 }}></Box>
            <Box sx={{ textAlign: 'center', mt: 6, mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: sectionColor, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                🧩 برامجنا الخاصة بالقسم
              </Typography>
            </Box>
<Grid container spacing={4} sx={{ px: 3, pb: 5 }}>
  {section.programCards.map((program, i) => (
    <Grid item xs={12} sm={6} md={4} key={i}>
      <Box
        sx={{
          background: 'linear-gradient(145deg, #ffffff, #f3f3f3)',
          borderRadius: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
     
        }}
      >
        {/* Image Container */}
        {program.image && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 200,
              backgroundColor: '#f9f9f9',
              borderTopLeftRadius: '30px',
              borderTopRightRadius: '30px',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={program.image}
              alt={program.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
              }}
            />
            {/* Soft ombre overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)',
              }}
            />
          </Box>
        )}

        {/* Content Box - Centered */}
        <Box
          sx={{
            p: 3,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: sectionColor,
              mb: 2,
            }}
          >
            {program.name}
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontWeight: '500',
              color: '#333',
              fontSize: '1rem',
              mb: 2,
            }}
          >
            {program.description}
          </Typography>

          {/* Info List */}
<Stack spacing={1.5} sx={{ color: '#555', fontSize: '0.95rem', textAlign: 'center' }}>
  <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
    <span>📝</span>
    <span><strong>الشروط:</strong> {program.conditions}</span>
  </Stack>

  <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
    <span>🎓</span>
    <span><strong>المؤهلات:</strong> {program.qualifications}</span>
  </Stack>

  <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
    <span>📞</span>
    <span>
      <strong>هاتف:</strong>{' '}
      <span style={{ direction: 'ltr', unicodeBidi: 'embed' }}>
        {program.phone}
      </span>
    </span>
  </Stack>
</Stack>

        </Box>
      </Box>
    </Grid>
  ))}
</Grid>


          </>
        )}

        {/* Nurseries */}
        {section.nurseries?.length > 0 && (
          <Box id="nurseries" sx={{ scrollMarginTop: '100px' }}>
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
          </Box>
        )}

        {/* Kindergartens */}
        {section.kindergartens?.length > 0 && (
          <Box id="kindergartens" sx={{ scrollMarginTop: '100px' }}>
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
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default SectionPage;
