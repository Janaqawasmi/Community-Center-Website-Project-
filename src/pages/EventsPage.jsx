// src/pages/EventsPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import HeroSection from "../components/HeroSection";

export default function EventsPage() {
  return (
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <HeroSection pageId="events" />

      <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
       
        {/* More page content... */}
      </Box>
    </Box>
  );
}
