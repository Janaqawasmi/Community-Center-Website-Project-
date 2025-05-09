import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { useSectionContext } from "../components/SectionContext";
import { programCategories } from '../constants/sectionMeta';

export default function HomePage() {
  const [heroSection, setHeroSection] = useState("");
  const [categories, setCategories] = useState([]);
  const eventsRef = useRef(null);
  const coursesRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setActiveSection } = useSectionContext();

  // Scroll to section on nav click
  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (scrollTo === "courses") {
      coursesRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (scrollTo === "events") {
      eventsRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (scrollTo) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);



  // Fetch hero section image
  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const siteInfoRef = doc(db, "siteInfo", "9ib8qFqM732MnTlg6YGz");
        const siteInfoSnap = await getDoc(siteInfoRef);
        if (siteInfoSnap.exists()) {
          const data = siteInfoSnap.data();
          setHeroSection(data.heroSection || "");
        }
      } catch (error) {
        console.error("Error fetching site info:", error);
      }
    };
    fetchSiteInfo();
  }, []);




  // Detect visible section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleSection = "";

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === coursesRef.current) {
              visibleSection = "courses";
            } else if (entry.target === eventsRef.current) {
              visibleSection = "events";
            }
          }
        });

        if (visibleSection) {
          setActiveSection(visibleSection);
          console.log(">> activeSection =", visibleSection);

        }              
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.7,
      }
    );

    if (coursesRef.current) observer.observe(coursesRef.current);
    if (eventsRef.current) observer.observe(eventsRef.current);

    return () => {
      if (coursesRef.current) observer.unobserve(coursesRef.current);
      if (eventsRef.current) observer.unobserve(eventsRef.current);
    };
  }, []);




  // Fetch unique categories from programs collection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "programs"));
        const allPrograms = snapshot.docs.map((doc) => doc.data());

        const unique = Array.from(
          new Set(allPrograms.map((p) => p.category).filter(Boolean))
        );

        setCategories(unique);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${heroSection})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: 150, md: 300 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color={"black"}>
          بدء التسجيل في المخيم الصيفي!
        </Typography>
        <Button variant="contained" sx={{ mt: 2, bgcolor: "#2e3b55" }}>
          سجلوا الآن
        </Button>
      </Box>

      {/* Course Categories */}
      <Container
        sx={{
          py: 4,
          scrollMarginTop: { xs: "100px", md: "120px" },
                 }}
        ref={coursesRef}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          الدورات
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
         {categories.map((label) => {
  const catObj = programCategories.find(c => c.label === label);
  const color = catObj?.color || '#ccc'; // fallback color if not found

            return (
              <Box
                key={label}
                sx={{
                  bgcolor: color,
                  px: 6,
                  py: 2,
                  borderRadius: "20px",
                  fontWeight: "bold",
                  fontSize: "20px",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { opacity: 0.9 },
                }}
                onClick={() => navigate(`/programs/${encodeURIComponent(label)}`)}
              >
                {label}
              </Box>
            );
          })}
        </Box>
      </Container>








      {/* Events Section */}
      <Container
        ref={eventsRef}
        sx={{
          py: 4,
          scrollMarginTop: { xs: "100px", md: "120px" },
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          الفعاليات
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              title: "يوم التطوع",
              date: "5 فبراير 2024",
              place: "مركز الجماهيري",
              image: "/event1.jpg",
            },
            {
              title: "مهرجان العائلة",
              date: "10 حزيران",
              place: "مركز الجماهيري",
              image: "/event2.jpg",
            },
            {
              title: "محاضرة تثقيفية",
              date: "25 تموز",
              place: "مركز الجماهيري",
              image: "/event3.jpg",
            },
          ].map((event, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardMedia component="img" image={event.image} height="180" />
                <CardContent>
                  <Typography fontWeight="bold">{event.title}</Typography>
                  <Typography fontSize="14px" color="text.secondary">
                    {event.date}
                  </Typography>
                  <Typography fontSize="14px" color="text.secondary">
                    {event.place}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" mt={3}>
          <Button variant="outlined" sx={{ borderRadius: 20, px: 4 }}>
            كل الفعاليات
          </Button>
        </Box>
      </Container>

      {/* Calendar Section */}
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          أبريل 2024
        </Typography>
        <Grid container spacing={1} justifyContent="center">
          {[
            "الأحد",
            "الاثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
          ].map((day) => (
            <Grid item xs={1} key={day}>
              <Typography fontWeight="bold">{day}</Typography>
            </Grid>
          ))}
          {[...Array(30)].map((_, i) => (
            <Grid item xs={1} key={i + 1}>
              <Typography>{i + 1}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
