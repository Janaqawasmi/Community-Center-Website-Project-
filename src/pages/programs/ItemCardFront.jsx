import { Card, Typography, Box, Button } from "@mui/material";

/**
 * fields: { imageUrl, name, description, startDate, ... }
 * config: { getDate, getLineColor, ... } // Optional functions for customization
 */
export default function ItemCardFront({ item, onFlip, config = {} , highlight}) {
  // Get date for display, or fallback to today
  const date = config.getDate ? config.getDate(item) : (item.startDate instanceof Date ? item.startDate : new Date());
  const day = date.getDate();
  const monthName = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"][date.getMonth()];
  const year = date.getFullYear();

  return (
  <Card
  sx={{
    width: "100%",
    height: "100%", // 🔁 FIXED: fills FlipCard height
    borderRadius: 5,
    border: "1px solid #ccc",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // same for all
    transform: "none", // no scale
    transition: "none", // no animation
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
    mx: "auto", // center horizontally
    overflow: "hidden",

  }}
>
      <Box sx={{ position: "relative", width: "100%", height: 170 }}>
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)",
            background: config.getLineColor ? config.getLineColor(item) : item.lineColor || "#004e92",
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
            //overflow: "hidden",
            zIndex: 1,
            backgroundColor: config.getLineColor ? config.getLineColor(item) : item.lineColor || "#004e92",
          }}
        >
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.name}
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
        gutterBottom
        sx={{ mt: 1 }}
      >
        {item.name}
      </Typography>

      

      <Typography sx={{ fontSize: "14px", color: " #666", mt: 1 }}>{item.description || "لا توجد تفاصيل إضافية"}</Typography>

      <Box sx={{ display: "flex", alignItems: "baseline", mt: 1 }}>
        <Typography sx={{ fontSize: "48px", fontWeight: "bold", color: " #003366" }}>{day}</Typography>
        <Box sx={{ textAlign: "left", ml: 1 }}>
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", color: " #003366" }}>{monthName}</Typography>
          <Typography sx={{ fontSize: "12px", color: " #003366" }}>{year}</Typography>
        </Box>
      </Box>

      <Button variant="outlined" onClick={(e) => { e.stopPropagation(); onFlip(); }} sx={{ mt: 2, mb: 1, width: "70%", mx: "auto", borderRadius: "40px", 
        border: "2px solid #003366", color: " #003366", 
        fontWeight: "bold", px: 4, textTransform: "none", ":hover": { backgroundColor: "#003366", borderColor: " #003366", color: "white" } }}>
        عرض التفاصيل
      </Button>
    </Card>
  );
}
