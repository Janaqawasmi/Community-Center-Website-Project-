import { useEffect, useState } from 'react';
import { fetchNews } from '../utils/fetchNews';
import NewsCard from './NewsCard';
import GradientSearchBar from "../components/layout/common/GradientSearchBar";
import { trackPageView } from '../components/Data Analysis/utils/trackPageView';
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
  
  useEffect(() => {
    trackPageView('/news');
  }, []);


  useEffect(() => {
    const getNews = async () => {
  const data = await fetchNews();

  // ✅ Sort from earliest to latest (sooner at top)
  const sorted = [...data].sort((a, b) => {
    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
    return dateA - dateB; // ascending: earliest to latest
  });

  setNewsItems(sorted);
};

    getNews();
  }, []);

const [filter, setFilter] = useState('الكل');
const [searchTerm, setSearchTerm] = useState('');

const filteredItems = newsItems
  .filter((item) => filter === 'الكل' || item.category === filter)
  .filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );



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
<Box sx={{ mt: 2, mb: 2 }}>
  <GradientSearchBar
    label="بحث سريع"
    placeholder="ابحث عن خبر"
    searchQuery={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</Box>


      {/* 🗂 News Cards Grid */}
      <Container>
          {newsItems.length === 0 ? (
    <Typography textAlign="center" mt={4}>
      لا توجد أخبار حالياً
    </Typography>
  ) : filteredItems.length === 0 ? (
    <Typography textAlign="center" mt={4}>
      لا توجد نتائج مطابقة لبحثك.
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