import { useState } from "react";
import { Card, Typography, Box, Button, Alert } from "@mui/material";

function formatValue(value) {
  if (value instanceof Date) {
    return value.toLocaleString('ar-EG', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
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
  const [fullMsg, setFullMsg] = useState("");

  // عدل اسم الحقل حسب بياناتك
  const isFull = item.capacity === 0 || item.capacity === "0";

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 4,
        p: 2,
        mx: "auto",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transform: "none",
        transition: "none",
        border: "1.5px solid #dbeafe",
        overflow: "hidden",
        position: "relative", // مهم لإظهار الشريط
      }}
    >
      {/* الشريط العلوي الأيسر عند الامتلاء */}
      {isFull && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: -32,
            background: "#ef4444",
            color: "#fff",
            fontWeight: "bold",
            px: 13,
            py: 0.5,
            fontSize: "0.95rem",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.12)",
            transform: "rotate(-16deg)",
            zIndex: 1,
            letterSpacing: "1px"
          }}
        >
          العدد ممتلئ
        </Box>
      )}

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

      {fullMsg && (
        <Alert severity="warning" sx={{ my: 1, fontWeight: "bold", textAlign: "center" }}>
          {fullMsg}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
        <Button
          variant="outlined"
          disabled={isFull}
          onClick={e => {
            e.stopPropagation();
            if (isFull) {
              setFullMsg("الأماكن ممتلئة، لا يمكن التسجيل في الوقت الحالي.");
              return;
            }
            setFullMsg("");
            onRegister(item.name);
          }}
          sx={{
            width: "70%",
            mx: "auto",
            borderRadius: "28px",
            border: "2px solid #0d47a1",
            color: "#0d47a1",
            fontWeight: "bold",
            px: 4,
            textTransform: "none",
            ":hover": {
              backgroundColor: "#0d47a1",
              borderColor: "#0288d1",
              color: "white"
            },
            ...(isFull && {
              borderColor: "#ccc",
              color: "#999",
              cursor: "not-allowed",
              backgroundColor: "#f9fafb",
            }),
          }}
        >
          سجل الآن
        </Button>

        <Button
          variant="text"
          onClick={e => { e.stopPropagation(); onFlipBack(); }}
          sx={{
            mt: 0.5,
            color: "#0d47a1",
            textDecoration: "underline",
            fontWeight: "bold"
          }}
        >
          العودة
        </Button>
      </Box>
    </Card>
  );
}
