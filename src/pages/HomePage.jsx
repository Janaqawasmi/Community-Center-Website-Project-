// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { Grid, Box } from '@mui/material'; // نستخدم MUI هنا
import './HomePage.css';

import headerImage from '../assets/headerPic.jpg';
import { iconMap, sectionColors } from '../constants/sectionMeta';
import { FaStar } from 'react-icons/fa';

function HomePage({ sections }) {
  if (!sections || sections.length === 0) {
    return <p style={{ textAlign: 'center' }}>جاري تحميل الأقسام...</p>;
  }

  return (
    <Box
      className="main-page"
      sx={{
        width: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Hero section */}
      <Box
        className="hero-section"
        sx={{
          backgroundImage: `url(${headerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '250px',
        }}
      />

      {/* Sections */}
      <h2 className="sections-title">الأقسام</h2>

      <Grid
        container
        spacing={2}
        sx={{
          padding: '20px',
          width: '100%',
          boxSizing: 'border-box',
          justifyContent: 'center',
        }}
      >
        {sections.map((section) => (
          <Grid
            item
            xs={4} // 12 ÷ 4 = 3 أعمدة
            sm={4}
            md={4}
            key={section.id}
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Link
              to={`/sections/${section.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Box
                className="section-circle"
                sx={{
                  backgroundColor: sectionColors[section.id] || '#ccc',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <Box className="icon" sx={{ fontSize: '24px', marginBottom: '5px' }}>
                  {iconMap[section.id] || <FaStar />}
                </Box>
                <Box className="label" sx={{ fontSize: '0.9rem', color: 'black', textAlign: 'center' }}>
                  {section.title}
                </Box>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomePage;
