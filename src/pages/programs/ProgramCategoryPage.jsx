import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Container } from "@mui/material";
import { useFetchPrograms } from "./useFetchPrograms";
import ProgramCard from "./ProgramCard";

export default function ProgramCategoryPage() {
  const { categoryName } = useParams();// save the category name from the URL
  const navigate = useNavigate();
  const programs = useFetchPrograms(categoryName);

  const backgroundImages = {
    "رياضة": "https://firebasestorage.googleapis.com/v0/b/public-center-website.firebasestorage.app/o/sections%2Fsports%2F475087461_929747379279212_1886752070478974189_n.jpg?alt=media&token=e08a01ef-3aff-47c1-abe7-0be7f4aa64ab",
    "فنون": "https://cdn.pixabay.com/photo/2015/09/17/17/19/paint-942405_1280.jpg",
    "الشبيبة": "https://cdn.pixabay.com/photo/2016/11/29/04/18/boys-1866533_1280.jpg",
    "النساء": "https://cdn.pixabay.com/photo/2019/01/17/08/25/woman-3933001_1280.jpg",
    "المسنين": "https://cdn.pixabay.com/photo/2016/03/27/21/39/grandparents-1289233_1280.jpg",
    "الأطفال": "https://cdn.pixabay.com/photo/2016/03/27/22/22/baby-1289227_1280.jpg",
  };


  const handleRegister = (programName) => {
    navigate(`/RegistrationForm?program=${encodeURIComponent(programName)}`);
  };

  return (
    <Box
      sx={{
        direction: "rtl",
        fontFamily: "Cairo, sans-serif",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        overflow: "hidden",
      }}
    >
     
     

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={0.3}>
            {programs.map((prog) => (
              <Grid item key={prog.id} xs={12} sm={6} md={4}>
                <ProgramCard prog={prog} onRegister={handleRegister} />
              </Grid>
            ))}
          </Grid>

          {programs.length === 0 && (
            <Typography sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
              لا توجد برامج حالياً تحت هذا التصنيف.
            </Typography>
          )}
        </Container>
      </Box>
  );
}
