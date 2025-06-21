import { useEffect, useState } from 'react';
import { fetchNews } from '../utils/fetchNews';
import NewsCard from './NewsCard';
import { trackPageView } from "../components/Data Analysis/utils/trackPageView"; 
import { useLocation } from "react-router-dom";
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

  // Track page view only once per session 
useEffect(() => {
  const path = location.pathname;
  const key = `viewed_${path}`;
  const lastViewed = localStorage.getItem(key);
  const today = new Date().toDateString();

  if (lastViewed !== today) {
    console.log("📊 Tracking view for:", path);
    trackPageView(path);
    localStorage.setItem(key, today);
  } else {
    console.log("⏳ Already tracked today:", path);
  }
}, [location.pathname]);

  const filteredItems =
    filter === 'الكل' ? newsItems : newsItems.filter((item) => item.category === filter);

  const categories = ['الكل', 'دورة', 'أمسية', 'فعالية', 'برنامج'];

  return (
    <Box
      sx={{
        direction: 'rtl',
         //backgroundColor: '#f8f9fb',
        minHeight: '100vh',
        pb: 8,
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
          gap: 2,
          py: 3,
          mb: 4,
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
          <Grid container rowSpacing={7.1} columnSpacing={ 9.5}>
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
