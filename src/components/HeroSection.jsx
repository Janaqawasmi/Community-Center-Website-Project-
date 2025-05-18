// src/components/HeroSection.jsx
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function HeroSection({ pageId }) {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, 'heroSection', pageId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroData(docSnap.data());
        }
      } catch (err) {
        console.error("Failed to load hero data:", err);
      }
    };

    fetchHeroData();
  }, [pageId]);

  if (!heroData) return null;

  return (
    <Box sx={{ py: 0, px: 0 }}>
      <Box
        sx={{
          position: "relative",
          height: { xs: 100, md: 200 },
          display: "flex",
          flexDirection: "row-reverse",
          overflow: "hidden",
        }}
      >
          {/* Add the HeroSection */}

        {/* Image */}
        <Box
          component="img"
          src={heroData.imageURL}
          alt="Hero"
          sx={{
            position: "absolute",
            top: "50px",
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            paddingLeft: { xs: 0, md: "35%" },
            zIndex: 0,
          }}
        />

        {/* Text area */}
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
            height: "100%",
            background: heroData.bgGradient || "linear-gradient(180deg, #00b0f0 0%, #003366 100%)",
            clipPath: "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            px: { xs: 3, md: 8 },
            zIndex: 1,
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff", mb: 1 }}>
            {heroData.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "#fff", fontSize: "1rem" }}>
            {heroData.subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
