import { useEffect, useState } from 'react';
import { fetchNews } from '../utils/fetchNews';
import NewsCard from './NewsCard';
import HeroSection from "../components/HeroSection";

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
        fontFamily: 'Cairo, sans-serif',
        backgroundColor: '#f8f9fb',
        minHeight: '100vh',
        pb: 8,
      }}
    >
   <HeroSection pageId="news" />
      
      {/* 🟢 Filter Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 2,
          py: 3,
          mb: 4,
        }}
      >
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setFilter(cat)}
            variant={filter === cat ? 'contained' : 'outlined'}
            sx={{
              borderRadius: '30px',
              px: 3,
              py: 1.5,
              fontWeight: 'bold',
              color: filter === cat ? 'white' : '#003366',
              backgroundColor: filter === cat ? '#003366' : 'white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              '&:hover': {
                backgroundColor: filter === cat ? '#002b5c' : '#ddd',
              },
            }}
          >
            {cat === 'دورة' ? 'الدورات' :
             cat === 'أمسية' ? 'الأمسيات' :
             cat === 'فعالية' ? 'الفعاليات' :
             cat === 'برنامج' ? 'البرامج' : 'الكل'}
          </Button>
        ))}
      </Box>

      {/* 🗂 News Cards Grid */}
      <Container>
        {filteredItems.length === 0 ? (
          <Typography textAlign="center" mt={4}>
            لا توجد أخبار حالياً
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {filteredItems.map((item) => (
              <Grid item xs={12} md={4} key={item.id}>
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
