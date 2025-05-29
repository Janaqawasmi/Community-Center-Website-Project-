import { Card, Typography, Box, Button } from "@mui/material";

function formatValue(value) {
  // لو القيمة وقت، أو تاريخ، حولها لنص عربي
  if (value instanceof Date) {
    return value.toLocaleString('ar-EG', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
  // لو القيمة غير معرفة أو نص فارغ
  if (value === undefined || value === null) return "—";
  return value;
}

function InfoRow({ icon, label, value }) {
  return (
    <Box display="flex" alignItems="center" mb={1}>
      <Box sx={{ color: "text.secondary", mr: 1 }}>{icon}</Box>
      <Typography variant="body2"><strong>{label}:</strong> {formatValue(value)}</Typography>
    </Box>
  );
}

export default function ItemCardBack({ item, fields, onRegister, onFlipBack, highlight }) {
  return (
<Card
  sx={{
    height: "100%",
    borderRadius: 4,
    p: 2,
    backgroundColor: " #ffffff",
    bboxShadow: highlight
      ? "0 0 15px #0d47a1"  // soft glowing shadow on highlight
      : "0 4px 12px rgba(0,0,0,0.1)",       // normal subtle shadow
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ...(highlight && {
      animation: "pulseShadow 1.5s infinite",
    }),
    border: "1.5px solid #dbeafe"
  }}
>
    <Typography variant="h6" color="#0d47a1" fontWeight="bold" gutterBottom>
        {item.name}
      </Typography>
      {fields.map((field) => (
        <InfoRow
          key={field.key}
          icon={field.icon}
          label={field.label}
          value={item[field.key]}
        />
      ))}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
        <Button
          variant="outlined"
          onClick={e => { e.stopPropagation(); onRegister(item.name); }}
          sx={{
            width: "70%", mx: "auto", borderRadius: "40px", border: "2px solid #0d47a1",
            color: "#0d47a1", fontWeight: "bold", px: 4, textTransform: "none",
            ":hover": { backgroundColor: "#0d47a1", borderColor: "#0288d1", color: "white" }
          }}
        >
          سجل الآن
        </Button>
        <Button
          variant="text"
          onClick={e => { e.stopPropagation(); onFlipBack(); }}
          sx={{ mt: 0.5, color: "#0d47a1", textDecoration: "underline", fontWeight: "bold" }}
        >
          العودة
        </Button>
      </Box>
    </Card>
  );
}
