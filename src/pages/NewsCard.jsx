import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HeroSection from "../components/HeroSection";
function NewsCard({ data }) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        fontFamily: 'Cairo, sans-serif',
        minHeight: 410,
        width: 340,  
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: '0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
        },
      }}
    >
      {/* V-shaped image container with ONLY bottom V frame */}
      <Box sx={{ position: 'relative', height: 180, width: '100%' }}>
  <Box
    sx={{
      clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }}
  >
    <Box
      component="img"
      src={data.image}
      alt={data.title}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  </Box>
  {/* Sharper V border line */}
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 400 180"
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 2,
      pointerEvents: 'none',
    }}
    preserveAspectRatio="none"
  >
    <polyline
      points="0,135 200,179 400,135"
      fill="none"
      stroke="#003366"
      strokeWidth="4"
    />
  </svg>
</Box>


      {/* Text and Button */}
      <CardContent sx={{ textAlign: 'center', color: '#003366' }}>
        <Typography fontSize="13px" color="text.secondary" mb={1}  sx={{
    fontStyle: 'italic',
    textAlign: 'center' // Optional: center if you want
  }}>
          {data.date} 
        </Typography>
        <Typography variant="h4" fontWeight="bold" gutterBottom >
          {data.title}
        </Typography>
        <Typography fontSize="14px" color="text.secondary" sx={{ minHeight: '60px' }}>
          {data.description}
        </Typography>
      </CardContent>

      <Box sx={{ px: 2, pb: 2 }}>
      <Button
  onClick={() => navigate(`/news/${data.id}`)}
  fullWidth
  sx={{
    mt: 2,
    fontWeight: 'bold',
    fontSize: '16px',
    borderRadius: '30px',
    border: '2px solid #003366',   // Dark blue border
    color: '#003366',              // Blue text by default
    backgroundColor: '#fff',       // White background by default
    transition: '0.2s',
    boxShadow: '0 1.5px 6px rgba(0,51,102,0.08)',
    '&:hover': {
      backgroundColor: '#003366',  // Dark blue background on hover
      color: '#fff',               // White text on hover
      borderColor: '#003366',      // Keep border dark blue
    },
    '&:active': {
      backgroundColor: '#00234c',  // Even darker on active/click, optional
      color: '#fff',
      borderColor: '#00234c',
    },
  }}
>
  اقرأ المزيد
</Button>

      

      </Box>
    </Card>
  );
}

export default NewsCard;
