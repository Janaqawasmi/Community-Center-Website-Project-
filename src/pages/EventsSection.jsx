// src/components/EventsSection.jsx

import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
} from "@mui/material";

export default function EventsSection({ eventsRef }) {
  const events = [
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
  ];

  return (
    <Container
      ref={eventsRef}
      sx={{ py: 4, scrollMarginTop: { xs: "100px", md: "120px" } }}
    >
      <Typography variant="h4" gutterBottom fontWeight="bold">
        الفعاليات
      </Typography>

      <Grid container spacing={3}>
        {events.map((event, index) => (
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
  );
}
