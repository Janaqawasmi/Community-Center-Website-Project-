// src/components/CalendarSection.jsx

import React from "react";
import { Container, Typography, Grid } from "@mui/material";

export default function CalendarSection() {
  const days = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  return (
    <Container sx={{ py: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        أبريل 2024
      </Typography>

      <Grid container spacing={1} justifyContent="center">
        {days.map((day) => (
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
  );
}
