import { Box, Typography, Card, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NewsCard({ data }) {
  const navigate = useNavigate();
  const date = new Date(data.date);
  const day = date.getDate();
  const monthName = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ][date.getMonth()];
  const year = date.getFullYear();

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 450,
        borderRadius: 5,
        overflow: "hidden",
        border: "1px solid #ccc",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        mx: 'auto'
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: 170 }}>
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)",
            background: " #003366",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "99%",
            top: 0,
            left: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)",
            overflow: "hidden",
            zIndex: 1,
            backgroundColor: " #003366",
          }}
        >
          <Box
            component="img"
            src={data.mainImage}
            alt={data.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>
      </Box>

      <Typography
        variant="h6"
        color=" #003366"
        fontWeight="bold"
        
         gutterBottom={false} // remove extra spacing
  sx={{ mt: 0.5, px: 2 }} // reduce top margin
        //sx={{ mt: 1, px: 2}}
      >
        {data.title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "baseline", mt: 1 }}>
  <Typography sx={{ fontSize: "36px", fontWeight: "bold", color: " #003366" }}>{day}</Typography>
  <Box sx={{ textAlign: "left", ml: 1 }}>
    <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: "#003366" }}>{monthName}</Typography>
    <Typography sx={{ fontSize: "12px", color: "#003366" }}>{year}</Typography>
  </Box>
</Box>

{/* ✅ Description below date */}
<Typography
  sx={{
    fontSize: "14px",
    color: " #666",
    mt: 0.5,
    px: 2,
    textAlign: 'right',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  }}
>
  {data.full_description || "لا توجد تفاصيل إضافية"}
</Typography>

      <Button
        variant="outlined"
        onClick={() => navigate(`/news/${data.id}`)}
        sx={{
          mt: 1.5,
          mb: 1,
          width: "70%",
          mx: "auto",
          borderRadius: "40px",
          border: "2px solid #003366",
          color: " #003366",
          fontWeight: "bold",
          px: 4,
          textTransform: "none",
          ":hover": {
            backgroundColor: " #003366",
            borderColor: " #003366",
            color: "white"
          }
        }}
      >
        اقرأ المزيد
      </Button>
    </Card>
  );
}

export default NewsCard;