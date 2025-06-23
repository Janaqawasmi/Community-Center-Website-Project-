import { useEffect, useState } from 'react';
import { fetchNews } from '../utils/fetchNews';
import NewsCard from './NewsCard';

import HeroSection from "../components/HeroSection"; // ⬅️ (already imported)
import {
  Box,
  Container,
  Typography,
  Grid,
  Button
} from '@mui/material';

function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [filter, setFilter] = useState('الكل');

  useEffect(() => {
    const getNews = async () => {
      const data = await fetchNews();
      setNewsItems(data);
    };
    getNews();
  }, []);

  const filteredItems =
    filter === 'الكل' ? newsItems : newsItems.filter((item) => item.category === filter);

  const categories = ['الكل', 'دورة', 'أمسية', 'فعالية', 'برنامج'];

  return (
    <Box
      sx={{
        direction: 'rtl',
         //backgroundColor: '#f8f9fb',
        minHeight: '100vh',
        pb: 4,
      }}
    >
      {/* 🟦 Hero Banner - replaced with HeroSection for consistency */}
      {/* --------- START NEW: HERO SECTION HEADER --------- */}
      <HeroSection pageId="news" /> {/* ⬅️ ADDED: Use HeroSection like Programs page */}
      {/* --------- END NEW: HERO SECTION HEADER --------- */}

      {/* 🟢 Filter Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          py: 2,
        }}
      >
       
      </Box>

      {/* 🗂 News Cards Grid */}
      <Container>
        {filteredItems.length === 0 ? (
          <Typography textAlign="center" mt={4}>
            لا توجد أخبار حالياً
          </Typography>
        ) : (
          <Grid container spacing={8} justifyContent="center">
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id} 
                display="flex"
                justifyContent="center">
                <NewsCard data={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default News;