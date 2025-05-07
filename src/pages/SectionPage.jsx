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
        setSection({ id: docSnap.id, ...docSnap.data() }); // include doc ID as section_key
      } else {
        console.error("Section not found");
      }
    };
    fetchSection();
  }, [id]);
  

  if (!section) return <p>جاري التحميل...</p>;

// ✅ Add this block:
const sectionColor = sectionColors[section.id] || '#607d8b';
const sectionIcon = iconMap[section.id] || '🔸';

  return (
    <Box sx={{ direction: 'rtl', fontFamily: 'Cairo, Arial, sans-serif', bgcolor: '#fcfcfc', color: '#222' }}>
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: sectionColor,
          color: '#fff',
          py: 4,
          px: 2,
          display: 'flex',
          flexDirection: ['column', 'row'],
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4">{section.title}</Typography>
          {section.subtitle && <Typography variant="subtitle1">{section.subtitle}</Typography>}
        </Box>
        {section.imageUrl && (
          <Box
            component="img"
            src={section.imageUrl}
            alt="Section Banner"
            sx={{
              width: ['100%', '40%'],
              maxHeight: '250px',
              objectFit: 'cover',
              mt: [2, 0],
            }}
          />
        )}
      </Box>

      {/* Section Content */}
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Description */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: sectionColor }}>
                📝 {section.description_title}
              </Typography>
              <Typography>{section.description}</Typography>
            </Paper>
          </Grid>

          {/* Goals */}
          {section.goals?.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: sectionColor }}>
                  🎯 {section.goals_title}
                </Typography>
                <ul>
                  {section.goals.map((goal, i) => (
                    <li key={i}>{goal}</li>
                  ))}
                </ul>
              </Paper>
            </Grid>
          )}

          {/* Programs */}
          {section.programs?.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: sectionColor }}>
                  📋 {section.programs_title}
                </Typography>
                <ul>
                  {section.programs.map((prog, i) => (
                    <li key={i}>{prog}</li>
                  ))}
                </ul>
              </Paper>
            </Grid>
          )}

          {/* Extra Goals */}
          {section.extra_goals?.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                {section.extra_goals_title && (
                  <Typography variant="h6" sx={{ color: sectionColor }}>
                    {section.extra_goals_title}
                  </Typography>
                )}
                <ul>
                  {section.extra_goals.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Paper>
            </Grid>
          )}

          {/* Curricular Programs */}
          {section.curricular_programs?.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                {section.curricular_programs_title && (
                  <Typography variant="h6" sx={{ color: sectionColor }}>
                    {section.curricular_programs_title}
                  </Typography>
                )}
                {section.curricular_programs_subtitle && (
                  <Typography fontWeight="bold">{section.curricular_programs_subtitle}</Typography>
                )}
                <ul>
                  {section.curricular_programs.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Paper>
            </Grid>
          )}

          {/* Non Curricular */}
          {section.non_curricular_programs?.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                {section.non_curricular_programs_title && (
                  <Typography variant="h6" sx={{ color: sectionColor }}>
                    {section.non_curricular_programs_title}
                  </Typography>
                )}
                <ul>
                  {section.non_curricular_programs.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Illustration Placeholder */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            bgcolor: '#f3f3f3',
            textAlign: 'center',
            fontStyle: 'italic',
            borderRadius: 2,
          }}
        >
          [رسم توضيحي أو صورة لاحقاً]
        </Box>
      </Container>
    </Box>
  );
}

export default SectionPage;
