import { Card, Typography, Box, Button } from "@mui/material";

export default function ProgramCardFront({ prog, onFlip }) {
  const date = prog.startDate instanceof Date ? prog.startDate : prog.startDate?.toDate?.() ?? new Date();
  const day = date.getDate();
  const monthName = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"][date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const isPM = hours >= 12;
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  const meridiem = isPM ? "م" : "ص";
  const arabicTime = `${hours}:${minutes} ${meridiem}`;

  return (
    <Card sx={{ width: "100%", height: "100%", borderRadius: 5, overflow: "hidden", border: "1px solid #ccc", 
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", 
    alignItems: "center", textAlign: "center", fontFamily: "Arial, sans-serif", position: "relative" }}>
<Box sx={{ position: "relative", width: "100%", height: 150 }}>
  {/* Thin colored shape at the back */}
  <Box
    sx={{
      position: "absolute",
      width: "100%",
      height: "100%",
      clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)",
background: prog.lineColor,
      zIndex: 0,
    }}
  />

  {/* Image shape over the colored shape, slightly smaller height to expose "border" */}
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
      backgroundColor: prog.lineColor || "#004e92", // use fallback if missing
    }}
  >
    <Box
      component="img"
      src={prog.imageUrl}
      alt={prog.name}
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
  gutterBottom
  sx={{ mt: 1 }} 
>
  {prog.name}
</Typography>
      <Typography sx={{ fontSize: "14px", color: "#666", mt: 1 }}>{prog.description || "لا توجد تفاصيل إضافية"}</Typography>

      <Box sx={{ display: "flex", alignItems: "baseline", mt: 1 }}>
        <Typography sx={{ fontSize: "48px", fontWeight: "bold", color: "#0d47a1" }}>{day}</Typography>
        <Box sx={{ textAlign: "left", ml: 1 }}>
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", color: "#0d47a1" }}>{monthName}</Typography>
          <Typography sx={{ fontSize: "12px", color: "#0d47a1" }}>{year}</Typography>
        </Box>
      </Box>

      <Button variant="outlined" onClick={(e) => { e.stopPropagation(); onFlip(); }} sx={{ mt: 2, mb: 1, width: "70%", mx: "auto", borderRadius: "40px", border: "2px solid #0d47a1", color: "#0d47a1", fontWeight: "bold", px: 4, textTransform: "none", ":hover": { backgroundColor: "#0d47a1", borderColor: "#0288d1", color: "white" } }}>
        عرض التفاصيل
      </Button>
    </Card>
  );
}
