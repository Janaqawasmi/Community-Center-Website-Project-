import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
 import { sectionColors } from '../constants/sectionMeta';
import Slider from 'react-slick';
import Collapse from '@mui/material/Collapse';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import HeroSection from "../components/HeroSection";
import ExpandableText from '../components/ExpandableText';
import ExpandableList from '../components/ExpandableList';
import SectionScrollButton from '../components/sections/SectionScrollButton';

// 🔧 Put this at the top of the file, after imports but before SectionPage()
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


const PrettyCard = ({ title, color, children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '28px',
        p: { xs: 3, sm: 4 },
        mt: 5,
        //background: `linear-gradient(to bottom right, ${color}10, #ffffff)`,
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
    height: { xs: '40px', sm: '40px' },  // shorter height
    minWidth: 'fit-content',
    padding: '0 20px', // horizontal padding
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
    whiteSpace: 'nowrap', // keep title on one line
    boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
  }}
>
  {title}
</Box>



      {/* Card Body without title */}
<Box sx={{ textAlign: 'right', fontSize: '1rem', color: '#444', pt: { xs: 5, sm: 6 } }}>
        {children}
      </Box>
    </Box>
  );
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
    <Box sx={{ position: 'relative', minHeight: '100vh', direction: 'rtl', fontFamily: 'Cairo, Arial, sans-serif', color: '#222', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <HeroSection pageId={id} />

   <Container maxWidth="lg" sx={{ pt: 2, pb: 6, px: 2, position: 'relative', zIndex: 3, flex: 1 }}>

   {(() => {
  const buttonData = getScrollButtonData();
  if (!buttonData) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'right',
        mt: 0,
        mb: 6,
        px: 2,
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



 <Grid container spacing={4}>
 {section.description && (
  <Grid item xs={12} md={6} sx={{ mt: { xs: -3, md: -4 } }}>
    <PrettyCard title={section.description_title || "الرؤية"} color={sectionColor}>
      <ExpandableText text={section.description} sx={{ fontSize: '1.2em', lineHeight: 2 }} />
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
    </PrettyCard>
{/* 👇 Start Collapse block */}
<Collapse in={expanded}>
  {section.hallDescription && (
    <PrettyCard title={section.hallDescription_title || "نادي الحلقات"} color={sectionColor}>
      <ExpandableText
        text={section.hallDescription}
        sx={{ fontSize: '5rem', lineHeight: 4 }}
        expandable={false}
      />
    </PrettyCard>
  )}

  {section.goals?.length > 0 && (
    <PrettyCard title={section.goals_title || "الأهداف"} color={sectionColor}>
      <ExpandableList items={section.goals} expandable={false} />
    </PrettyCard>
  )}

  {section.extra_goals?.length > 0 && (
    <PrettyCard title={section.extra_goals_title || "أهداف إضافية"} color={sectionColor}>
      <ExpandableList items={section.extra_goals} expandable={false} />
    </PrettyCard>
  )}

  {section.programs?.length > 0 && (
    <PrettyCard title={section.programs_title || "البرامج والأنشطة"} color={sectionColor}>
      <ExpandableList items={section.programs} expandable={false} />
    </PrettyCard>
  )}
</Collapse>
{/* 👆 End Collapse block */}

    
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

        {section.programCards?.length > 0 && (
          <>
              <Box id="programs" sx={{ textAlign: 'center', mt: 6, mb: 3 }}></Box>
            <Box sx={{ textAlign: 'center', mt: 6, mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: sectionColor, fontFamily: 'Cairo, Arial, sans-serif', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                🧩 برامجنا الخاصة بالقسم
              </Typography>
            </Box>
            <Grid container spacing={4} sx={{ px: 3, pb: 5 }}>
              {section.programCards.map((program, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Paper
                    elevation={3}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
  transform: 'none',
  cursor: 'default',
                      },
                    }}
                  >
                    {program.image && (
                      <Box sx={{ height: 180, backgroundImage: `url(${program.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
                    )}
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: sectionColor }}>{program.name}</Typography>
                      <ExpandableText
  text={program.description}
  sx={{ mt: 1, color: '#555', fontSize: '0.95rem' }}
  limit={250}
/>

                      <Typography sx={{ mt: 1, fontSize: '0.95rem' }}>📝 <strong>الشروط:</strong> {program.conditions}</Typography>
                      <Typography sx={{ mt: 1, fontSize: '0.95rem' }}>🎓 <strong>المؤهلات:</strong> {program.qualifications}</Typography>
                      <Typography sx={{ mt: 1, fontSize: '0.95rem' }}>📞 <strong>هاتف:</strong> <span style={{ direction: 'ltr', unicodeBidi: 'embed' }}>{program.phone}</span></Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}


        {section.nurseries?.length > 0 && (
          <PrettyCard title="حضاناتنا" icon="🏫" color={sectionColor}>
           <Box id="nurseries"></Box>
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
            <Box id="kindergartens">
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
            </Box>
          </PrettyCard>
        )}
      </Container>
    </Box>
  );
}

export default SectionPage;
