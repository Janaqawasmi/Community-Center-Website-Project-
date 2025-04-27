// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { Grid, Container, Typography } from '@mui/material';
import './HomePage.css';

import headerImage from '../assets/headerPic.jpg';
import { iconMap, sectionColors } from '../constants/sectionMeta';
import { FaStar } from 'react-icons/fa';

function HomePage({ sections }) {
  if (!sections || sections.length === 0) {
    return <p style={{ textAlign: 'center' }}>جاري تحميل الأقسام...</p>;
  }

  return (
    <div className="main-page">
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${headerImage})` }}
      >
        {/* هنا يمكنك إضافة Overlay مستقبلا لو أردتِ */}
      </div>

      {/* Sections Title */}
      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: 4 }}>
        الأقسام
      </Typography>

      {/* Sections Grid */}
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          {sections.map((section) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={section.id}>
              <Link to={`/sections/${section.id}`} style={{ textDecoration: 'none' }}>
                <div
                  className="section-circle"
                  style={{ backgroundColor: sectionColors[section.id] || '#ccc' }}
                >
                  <div className="icon">
                    {iconMap[section.id] || <FaStar />}
                  </div>
                  <div className="label">{section.title}</div>
                </div>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default HomePage;
