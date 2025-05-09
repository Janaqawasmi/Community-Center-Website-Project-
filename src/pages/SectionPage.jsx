import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { iconMap, sectionColors } from '../constants/sectionMeta';

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
      className="fade-in"
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
        mt: 4
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
          fontSize: '0.95rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 2,
        }}
      >
        {icon} {title}
      </Box>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        direction: 'rtl',
        fontFamily: 'Cairo, Arial, sans-serif',
        color: '#222',
        backgroundImage: section.backgroundImageUrl ? `url(${section.backgroundImageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        py: 2,
        position: 'relative',
      }}
    >
      {/* Add an overlay for the background image transparency */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',  // Semi-transparent overlay to make the image more subtle
          zIndex: 1, // Ensure it is behind the text and content
        }}
      />

      {/* Hero Header with color and bold text */}
      <Box
        sx={{
          background: `linear-gradient(to left, ${sectionColor}, #444)`,
          color: '#fff',
          py: 6,
          px: 3,
          borderBottomRightRadius: '80px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          zIndex: 2, // Ensure the text is above the overlay
        }}
      >
        <Container>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h3" fontWeight="bold">
                {sectionIcon} {section.title}
              </Typography>
              {section.subtitle && (
                <Typography variant="h6" mt={2} sx={{ opacity: 0.9, fontWeight: 'bold' }}>
                  {section.subtitle}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container sx={{ py: 5 }}>
        <Grid container spacing={4}>
          {section.description && (
            <Grid item xs={12}>
              <PrettyCard title={section.description_title} icon="📝" color={sectionColor}>
                <Typography sx={{ lineHeight: 2, fontWeight: 'bold' }}>{section.description}</Typography>
              </PrettyCard>
            </Grid>
          )}

          {section.goals?.length > 0 && (
            <Grid item xs={12}>
              <PrettyCard title={section.goals_title} icon="🎯" color={sectionColor}>
                <ul style={{ paddingRight: 20, lineHeight: 2 }}>
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
                <ul style={{ paddingRight: 20, lineHeight: 2 }}>
                  {section.programs.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </PrettyCard>
            </Grid>
          )}
        </Grid>

        <Box
          sx={{
            mt: 6,
            p: 4,
            bgcolor: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            fontStyle: 'italic',
            borderRadius: 2,
            color: '#666',
          }}
        >
          [رسم توضيحي أو صورة للقسم ستضاف لاحقاً]
        </Box>
      </Container>
    </Box>
  );
}

export default SectionPage;
