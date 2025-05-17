import { Card, Typography, Box, Button } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RepeatIcon from '@mui/icons-material/Repeat';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

function InfoRow({ icon, label, value }) {
  return (
    <Box display="flex" alignItems="center" mb={1}>
      <Box sx={{ color: "text.secondary", mr: 1 }}>{icon}</Box>
      <Typography variant="body2"><strong>{label}:</strong> {value}</Typography>
    </Box>
  );
}

export default function ProgramCardBack({ prog, onRegister, onFlipBack }) {
  return (
    <Card sx={{ height: "100%", borderRadius: 3, p: 2 }}>
      <Typography variant="h6" color="#0d47a1" fontWeight="bold" gutterBottom>
        {prog.name}
      </Typography>

      <InfoRow icon={<CalendarTodayIcon />} label="الأيام" value={Array.isArray(prog.days) ? prog.days.join("، ") : prog.days} />
      <InfoRow icon={<AccessTimeIcon />} label="الوقت" value={prog.time} />
      <InfoRow icon={<RepeatIcon />} label="عدد اللقاءات" value={prog.sessions} />
      <InfoRow icon={<PersonIcon />} label="اسم المدرب" value={prog.instructor} />
      <InfoRow icon={<AttachMoneyIcon />} label="السعر" value={`${prog.price} ₪`} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
        <Button variant="outlined" onClick={(e) => { e.stopPropagation(); onRegister(prog.name); }} sx={{ width: "70%", mx: "auto", borderRadius: "40px", border: "2px solid #0d47a1", color: "#0d47a1", fontWeight: "bold", px: 4, textTransform: "none", ":hover": { backgroundColor: "#0d47a1", borderColor: "#0288d1", color: "white" } }}>
          سجل الآن
        </Button>

        <Button variant="text" onClick={(e) => { e.stopPropagation(); onFlipBack(); }} sx={{ mt: 0.5, color: "#0d47a1", textDecoration: "underline", fontWeight: "bold" }}>
          العودة
        </Button>
      </Box>
    </Card>
  );
}
