//src\pages\ProgramCategoryPage.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import { programCategories } from '../constants/sectionMeta';

import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";

export default function ProgramCategoryPage() {
  const { categoryName } = useParams();
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      const snapshot = await getDocs(
        query(collection(db, "programs"), where("category", "==", categoryName))
      );
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPrograms(data);
    };

    fetchPrograms();
  }, [categoryName]);

  // Get color for the header
  const catObj = programCategories.find(c => c.label === categoryName);
  const color = catObj?.color || "#2e3b55"; // default color if not found

  return (
    <Box sx={{ direction: "rtl", fontFamily: "Cairo, sans-serif" }}>
      
      {/* Colored header section */}
      <Box
        sx={{
          backgroundColor: color,
          py: 4,
          textAlign: "center",
          color: "black",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {categoryName}
        </Typography>
      </Box>

      {/* Program cards section */}
      <Box sx={{ px: 2, py: 4 }}>
        <Grid container spacing={3}>
          {programs.map((prog) => (
            <Grid item key={prog.id} xs={12} md={4}>
              <Card sx={{ minHeight: 400 }}>
                <CardMedia
                  component="img"
                  image={prog.imageUrl}
                  height="180"
                  alt={prog.name}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {prog.name}
                  </Typography>
                  <Typography fontSize="14px" color="text.secondary" gutterBottom>
                    {prog.description}
                  </Typography>
                  <Typography fontSize="14px">
                    <strong>الأيام:</strong>{" "}
                    {Array.isArray(prog.days) ? prog.days.join("، ") : prog.days}
                  </Typography>
                  <Typography fontSize="14px">
                    <strong>الوقت:</strong> {prog.time}
                  </Typography>
                  <Typography fontSize="14px" gutterBottom>
                    <strong>التصنيف:</strong> {prog.category}
                  </Typography>

                  {/* ✅ Registration Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      mt: 2,
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '14px',
                      borderRadius: 20,
                    }}
                    onClick={() => navigate(`/RegistrationForm?program=${encodeURIComponent(prog.name)}`)}
                  >
                    استمارة التسجيل
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {programs.length === 0 && (
          <Typography sx={{ mt: 4, textAlign: "center" }}>
            لا توجد برامج حالياً تحت هذا التصنيف.
          </Typography>
        )}
      </Box>
    </Box>
  );
}



  {/* Registration Button */}
  <Button
    variant="contained"
    color="primary"
    sx={{
      fontFamily: 'Cairo, sans-serif',
      fontSize: '14px',
    }}
    onClick={() => navigate('/RegistrationForm')}
  >
    טופס הרשמה
  </Button>