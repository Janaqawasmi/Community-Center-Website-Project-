import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Grid, List, ListItem, ListItemText } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebase";

export default function About() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, "siteInfo", "about us");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    fetchAboutData();
  }, []);

  if (!aboutData) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography>جاري تحميل معلومات عن المركز...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      {/* Main image */}
      {aboutData.image_url && (
        <Box
          component="img"
          src={aboutData.image_url}
          alt="عن المركز"
          sx={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover",
            borderRadius: 2,
            mb: 4,
          }}
        />
      )}

      {/* Title */}
      <Typography variant="h4" gutterBottom textAlign="center">
        {aboutData.title}
      </Typography>

      {/* About Us Text */}
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
        {aboutData.about_us_text}
      </Typography>

      {/* Slogan / Vision / Message */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>{aboutData.slogan_title}</Typography>
          <List dense>
            {aboutData.slogan?.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={`• ${item}`} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>{aboutData.vision_title}</Typography>
          <Typography variant="body1" color="text.secondary">
            {aboutData.vision}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>{aboutData.message_title}</Typography>
          <Typography variant="body1" color="text.secondary">
            {aboutData.message}
          </Typography>
        </Grid>
      </Grid>

      {/* Justifications */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>{aboutData.justifications_title}</Typography>
        <Typography variant="body1" color="text.secondary">{aboutData.justifications}</Typography>
      </Box>

      {/* Goals */}
      <Box>
        <Typography variant="h5" gutterBottom>{aboutData.goals_title}</Typography>
        <List dense>
          {aboutData.goals?.map((goal, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText primary={`• ${goal}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
