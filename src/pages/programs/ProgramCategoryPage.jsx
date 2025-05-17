import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import { useFetchPrograms } from "./useFetchPrograms";
import ProgramCard from "./ProgramCard";
import HeroSection from "../../components/HeroSection"; // ✅ fixed relative path

export default function ProgramCategoryPage() {
  const { categoryName } = useParams();// save the category name from the URL
  const navigate = useNavigate();
  const programs = useFetchPrograms(categoryName);




  const handleRegister = (programName) => {
    navigate(`/RegistrationForm?program=${encodeURIComponent(programName)}`);
  };

  return (
  <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
    {/* Header Section */}
    <Box mb={4}>
      <HeroSection pageId={categoryName} />
    </Box>

    {/* White Box Container - Matches About Page */}
   <Container
  sx={{
    backgroundColor: "#fff", // or rgba(255,255,255,0.95) for semi-transparent
    borderRadius: 4,
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    py: 4,
    px: { xs: 2, md: 6 },
    direction: "rtl",
    fontFamily: "'Noto Kufi Arabic', sans-serif",
  }}
>
  <Grid container spacing={0.3}>
    {programs.map((prog) => (
      <Grid item key={prog.id} xs={12} sm={6} md={4}>
        <ProgramCard prog={prog} onRegister={handleRegister} />
      </Grid>
    ))}
    {programs.length === 0 && (
      <Typography sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
        لا توجد برامج حالياً تحت هذا التصنيف.
      </Typography>
    )}
  </Grid>
</Container>

  </Box>
);

}
