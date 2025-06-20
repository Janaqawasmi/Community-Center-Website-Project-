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
        width: "104%",
        height: "100%",
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
      <Box sx={{ position: "relative", width: "100%", height: 151 }}>
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)",
            background: "#0d47a1",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "98%",
            top: 0,
            left: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)",
            overflow: "hidden",
            zIndex: 1,
            backgroundColor: "#0d47a1",
          }}
        >
          <Box
            component="img"
            src={data.image}
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
        color="#0d47a1"
        fontWeight="bold"
        
         gutterBottom={false} // remove extra spacing
  sx={{ mt: 0.5, px: 2 }} // reduce top margin
        //sx={{ mt: 1, px: 2}}
      >
        {data.title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "baseline", mt: 1 }}>
  <Typography sx={{ fontSize: "36px", fontWeight: "bold", color: "#0d47a1" }}>{day}</Typography>
  <Box sx={{ textAlign: "left", ml: 1 }}>
    <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: "#0d47a1" }}>{monthName}</Typography>
    <Typography sx={{ fontSize: "12px", color: "#0d47a1" }}>{year}</Typography>
  </Box>
</Box>

{/* ✅ Description below date */}
<Typography
  sx={{
    fontSize: "14px",
    color: "#666",
    mt: 1,
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
          mt: 2,
          mb: 2,
          width: "70%",
          mx: "auto",
          borderRadius: "40px",
          border: "2px solid #0d47a1",
          color: "#0d47a1",
          fontWeight: "bold",
          px: 4,
          textTransform: "none",
          ":hover": {
            backgroundColor: "#0d47a1",
            borderColor: "#0288d1",
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
