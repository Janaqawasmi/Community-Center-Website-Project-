import { Card, Typography, Box, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RepeatIcon from "@mui/icons-material/Repeat";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

function InfoRow({ icon, label, value }) {
  return (
    <Box display="flex" alignItems="center" mb={1}>
      <Box sx={{ color: "text.secondary", mr: 1 }}>{icon}</Box>
      <Typography variant="body2">
        <strong>{label}:</strong> {value}
      </Typography>
    </Box>
  );
}

export default function ProgramCardBack({ prog, onRegister, onFlipBack, highlight }) {
  return (
 <Card
  sx={{
    width: "100%",
    height: "100%",
    borderRadius: 3,
    p: 2,
    border: "1px solid #ccc",  // keep consistent thin border
    boxShadow: highlight
      ? "0 0 15px #0d47a1"  // soft glowing shadow on highlight
      : "0 4px 12px rgba(0,0,0,0.1)",       // normal subtle shadow
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ...(highlight && {
      animation: "pulseShadow 1.5s infinite",
    }),
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: highlight
        ? "0 0 20px #0d47a1"
        : "0 12px 24px rgba(0, 0, 0, 0.4)",
    },
  }}
>


      <Typography variant="h6" color="#0d47a1" fontWeight="bold" gutterBottom>
        {prog.name}
      </Typography>

      <InfoRow
        icon={<CalendarTodayIcon />}
        label="الأيام"
        value={Array.isArray(prog.days) ? prog.days.join("، ") : prog.days}
      />
      <InfoRow icon={<AccessTimeIcon />} label="الوقت" value={prog.time} />
      <InfoRow icon={<RepeatIcon />} label="عدد اللقاءات" value={prog.sessions} />
      <InfoRow icon={<PersonIcon />} label="اسم المدرب" value={prog.instructor} />
      <InfoRow icon={<AttachMoneyIcon />} label="السعر" value={`${prog.price} ₪`} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            onRegister(prog.name);
          }}
          sx={{
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
              color: "white",
            },
          }}
        >
          سجل الآن
        </Button>

        <Button
          variant="text"
          onClick={(e) => {
            e.stopPropagation();
            onFlipBack();
          }}
          sx={{
            mt: 0.5,
            color: "#0d47a1",
            textDecoration: "underline",
            fontWeight: "bold",
          }}
        >
          العودة
        </Button>
      </Box>
    </Card>
  );
}
