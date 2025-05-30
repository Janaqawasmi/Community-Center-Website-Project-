import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // ✅ adjust path if needed
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Helper to darken color (copied from SectionPage)
function darkenColor(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) - amount * 255;
  let g = ((num >> 8) & 0x00ff) - amount * 255;
  let b = (num & 0x0000ff) - amount * 255;

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export default function AboutUsSection() {
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sectionColor = "#c55e18"; // you can adjust the badge color here

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const docRef = doc(db, "siteInfo", "about us"); // ✅ confirm document ID
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutText(docSnap.data().about_us_text);
        } else {
          console.warn("No such document!");
        }
      } catch (error) {
        console.error("Error fetching About Us:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, []);

  if (loading) return null;

  const previewText =
    aboutText.length > 300 ? `${aboutText.substring(0, 300)}...` : aboutText;

  return (
<Box sx={{ px: { xs: 2, md: 6 }, pt: 4, pb: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            position: "relative",
            borderRadius: "28px",
            p: { xs: 3, sm: 4 },
            mt: 5,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            direction: "rtl",
            fontFamily: "Cairo, sans-serif",
          }}
        >
          {/* Top-Right Title Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              height: { xs: "40px", sm: "40px" },
              minWidth: "fit-content",
              padding: "0 20px",
             background: "linear-gradient(180deg, #00b0f0 0%, #003366 100%)",
              borderBottomLeftRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              zIndex: 2,
              textAlign: "center",
              whiteSpace: "nowrap",
              boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
            }}
          >
            من نحن
          </Box>

          {/* Card Body */}
          <Box
            sx={{
              textAlign: "right",
              fontSize: "1rem",
              color: "#444",
              pt: { xs: 5, sm: 6 },
            }}
          >
            <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }
, lineHeight: 2 }}>
              {previewText}
            </Typography>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/about")}
                sx={{
                  backgroundColor: sectionColor,
                  borderRadius: "20px",
                  px: 4,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#fff",
                    color: "#000",
                  },
                }}
              >
                اقرأ المزيد
              </Button>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
