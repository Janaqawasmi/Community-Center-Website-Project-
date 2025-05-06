import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Box,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebase";

export default function HomePage() {
  const location = useLocation();
  // const scrollTarget = location.state?.scrollTo;
  // const aboutUsRef = useRef(null);
  const [heroSection, setHeroSection] = useState('');
  // const [aboutUsText, setAboutUsText] = useState('');


  // useEffect(() => {
  //   if (scrollTarget === 'about') {
  //     const scroll = () => {
  //       if (aboutUsRef.current) {
  //         aboutUsRef.current.scrollIntoView({ behavior: 'smooth' });
  //       }
  //     };
  
  //     // Wait for layout
  //     setTimeout(scroll, 300);
  //   }
  // }, [scrollTarget]);
  
  // useEffect(() => {
  //   const scrollHandler = () => {
  //     if (aboutUsRef.current) {
  //       aboutUsRef.current.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   };
  
  //   window.addEventListener('scroll-to-about', scrollHandler);
  //   return () => window.removeEventListener('scroll-to-about', scrollHandler);
  // }, []);
  
  

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const siteInfoRef = doc(db, 'siteInfo', '9ib8qFqM732MnTlg6YGz');
        const siteInfoSnap = await getDoc(siteInfoRef);

        if (siteInfoSnap.exists()) {
          const data = siteInfoSnap.data();
    
          setHeroSection(data.heroSection || '');
          setAboutUsText(data.about_us_text || '');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching site info:', error);
      }
    };

    fetchSiteInfo();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: "300px", md: "450px" },
          backgroundImage: heroSection ? `url('${heroSection}')` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          textAlign: "center",
          backgroundColor: heroSection ? "transparent" : "#acc",
        }}
      />


      {/* Our Programs Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>Our Programs</Typography>
        <Grid container spacing={4}>
          {["Education", "Recreation", "Workshops"].map((program, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  image={`/program${index + 1}.jpg`}
                  alt={program}
                  height="200"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {program}
                  </Typography>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>Learn More</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Upcoming Events Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>Upcoming Events</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Community Event</Typography>
            <Typography variant="subtitle1">June 10th</Typography>
            <Typography variant="body2">2:00 PM - 4:00 PM</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Art Class</Typography>
            <Typography variant="subtitle1">July 5th at 11 AM</Typography>
            <Typography variant="body2">Art Class Join...</Typography>
            <Button variant="contained" color="primary" sx={{ mt: 1 }}>Register</Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
