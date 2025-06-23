// src/components/HeroSection.jsx
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function HeroSection({ pageId, title  }) {
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
          height: { xs:60, md: 70},
          display: "flex",
          flexDirection: "row-reverse",
          width: "100%",
        }}
      >

  {/* Image  */}
          <Box
          component="img"
          src={heroData.imageURL}
          alt="Hero"
          sx={{
            width: { xs: "46%", md: "50%" },
            height: "100%",
            zIndex: 0,
            objectFit: "contain", // Ensures full coverage
          }}
        />

        {/* Text area */}
        <Box
          sx={{
            width: { xs: "64%", md: "50%" },
            height: "100%",
            background: heroData.bgGradient || "linear-gradient(180deg, #00b0f0 0%, #003366 100%)",
            clipPath: "polygon(100% 0%, 20% 0%, 11% 50%, 20% 100%, 100% 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            px: { xs: 1, md: 4 },
            zIndex: 1,
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff", mb: 1, fontSize: { xs: '1.1rem', md: '2rem' }, }}>
                 {title || heroData.title}  </Typography>
                   

        </Box>
      </Box>
    </Box>
  );
}
