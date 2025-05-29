import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import { useFetchPrograms } from "./useFetchPrograms";
import ProgramCard from "./ProgramCard";
import HeroSection from "../../components/HeroSection"; // ✅ fixed relative path
import { useSearchParams } from "react-router-dom";
import { useRef, useEffect } from "react";

export default function ProgramCategoryPage() {
  const { categoryName } = useParams();// save the category name from the URL
  const navigate = useNavigate();
  const programs = useFetchPrograms(categoryName);
const [searchParams] = useSearchParams();
const highlightId = searchParams.get("highlight");

// store refs
const cardRefs = useRef({});

// after programs are loaded, scroll to highlighted one
useEffect(() => {
  if (highlightId && cardRefs.current[highlightId]) {
    cardRefs.current[highlightId].scrollIntoView({ behavior: "smooth", block: "center" });
  }
}, [programs, highlightId]);


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
 <Grid container spacing={0.3}

 >
  {programs.map((prog) => (
    <Grid
      item
      key={prog.id}
      xs={12}
      sm={6}
      md={4}
      ref={(el) => (cardRefs.current[prog.id] = el)}
    >
      <ProgramCard
        prog={prog}
        onRegister={handleRegister}
        highlight={prog.id === highlightId}
      />
    </Grid>
  ))}
</Grid>

</Container>

  </Box>
);

}
