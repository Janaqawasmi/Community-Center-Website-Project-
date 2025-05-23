import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Button,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import {
  FaEye,
  FaEnvelope,
  FaLightbulb,
  FaBullseye,
  FaGlobe,
  FaUserAlt,
  FaUsers,
} from "react-icons/fa";

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, "siteInfo", "about us");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    fetchAboutData();
  }, []);

  const SectionTitle = ({ title, icon, color }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: color,
        color: "#fff",
        px: 3,
        py: 2,
        borderRadius: "10px 10px 0 0",
        fontWeight: "bold",
        fontSize: "1.2rem",
        gap: 1.5,
        direction: "rtl",
        mt: 4
      }}
    >
      <Box sx={{ fontSize: 22 }}>{icon}</Box>
      {title}
    </Box>
  );

  if (!aboutData) {
    return (
      <Box sx={{ py: 10, backgroundColor: "#fdf6ee" }}>
        <Typography align="center">جاري تحميل معلومات عن المركز...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#fdf6ee", minHeight: "100vh", fontFamily: "'Noto Kufi Arabic', sans-serif", direction: "rtl" }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mb: 4 }}>
        {aboutData.title}
      </Typography>

      {/* فقرة التعريف */}
      <Box sx={{ backgroundColor: "#00838f	", color: "white", borderRadius: 3, p: 4, mb: 3 }}>
        <Typography variant="body1" sx={{ fontSize: "1.2rem", lineHeight: 2, textAlign: "justify" }}>
          {aboutData.about_us_text}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Button
          variant="outlined"
          onClick={() => setShowMore(!showMore)}
          sx={{
            color: "#d6ae7b",
            borderColor: "#e6ccb2",
            fontWeight: "bold",
            px: 4,
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#f0e5d8",
              color: "white",
            },
          }}
        >
          {showMore ? "عرض أقل" : "اقرأ المزيد"}
        </Button>
      </Box>

      {showMore && (
        <>
          {/* شعار المركز */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: "#4682B4", fontSize: "1.7rem" }}>
              شعار المركز الجماهيري
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={4} sm={3} md={2}>
                <FaUsers size={50} style={{ color: "#4682B4" }} />
                <Typography fontWeight="bold" sx={{ mt: 1 }}>جمهور</Typography>
              </Grid>
              <Grid item xs={4} sm={3} md={2}>
                <FaUserAlt size={50} style={{ color: "#4682B4" }} />
                <Typography fontWeight="bold" sx={{ mt: 1 }}>انسان</Typography>
              </Grid>
              <Grid item xs={4} sm={3} md={2}>
                <FaGlobe size={50} style={{ color: "#4682B4" }} />
                <Typography fontWeight="bold" sx={{ mt: 1 }}>أرض</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* الرؤية والرسالة */}
          <Grid container spacing={4} mb={6}>
            <Grid item xs={12} md={6}>
              <SectionTitle title={aboutData.vision_title} icon={<FaEye />} color="#fdd835" />
              <Typography sx={{ mt: 2, fontSize: "1.1rem", lineHeight: 2, textAlign: "justify" }}>
                {aboutData.vision}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionTitle title={aboutData.message_title} icon={<FaEnvelope />} color="#26c6da	" />
              <Typography sx={{ mt: 2, fontSize: "1.1rem", lineHeight: 2, textAlign: "justify" }}>
                {aboutData.message}
              </Typography>
            </Grid>
          </Grid>

          {/* المبررات والأهداف */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <SectionTitle title={aboutData.justifications_title} icon={<FaLightbulb />} color="#b91c1c" />
              <Typography sx={{ mt: 2, fontSize: "1.1rem", lineHeight: 2, textAlign: "justify" }}>
                {aboutData.justifications}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionTitle title={aboutData.goals_title} icon={<FaBullseye />} color="#2E7D32" />
              <Box component="ul" sx={{ mt: 2, pr: 2 }}>
                {aboutData.goals?.map((goal, index) => (
                  <li key={index}>
                    <Typography sx={{ fontSize: "1.1rem", mb: 1 }}>
                      {goal}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
