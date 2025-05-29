import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Box, Container, Typography, Dialog, DialogTitle,
  DialogContent, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { db, auth } from "../components/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "@fullcalendar/core/locales/ar";

export default function CalendarSection() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [user, loading] = useAuthState(auth);
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "EventsCalender"), (snapshot) => {
      const formatted = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          start: data.time?.toDate?.() || new Date(data.time),
          description: data.description || "",
          location: data.location || ""
        };
      });
      setEvents(formatted);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL?.toLowerCase();

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Typography>...جار التحميل</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, fontFamily: "Cairo, sans-serif" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="primary"
        align="center"
        mb={2}
      >
        التقويم
      </Typography>

      <Box
        sx={{
          direction: "rtl",
          color: "#000",
          backgroundColor: "#f9f9fb",
          p: 1,
          borderRadius: 2,
          "& .fc": {
            fontFamily: "Cairo, sans-serif",
            fontSize: "0.85rem",
            direction: "rtl",
            textAlign: "right",
            color: "#000"
          },
          "& .fc-header-toolbar": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            my: 1
          },
          "& .fc .fc-button": {
            backgroundColor: "#1976d2",
            borderColor: "#1976d2",
            color: "white",
            borderRadius: 1,
            fontWeight: "bold",
            px: 1.5,
            fontSize: "0.75rem",
            "&:hover": {
              backgroundColor: "#0d47a1"
            }
          },
          "& .fc-toolbar-title": {
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#1976d2",
            textAlign: "center",
            flex: 1
          },
          "& .fc-col-header": {
            backgroundColor: "#fff3e0"
          },
          "& .fc-col-header-cell-cushion": {
            color: "#000",
            fontWeight: 500,
            fontSize: "0.9rem"
          },
          "& .fc-daygrid-day-frame": {
            backgroundColor: "#fffaf2",
            border: "1px solid rgba(0,0,0,0.05)",
            padding: "4px"
          },
          "& .fc-daygrid-day": {
            boxShadow: "inset 0 0 3px rgba(0, 0, 0, 0.04)",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "#ffe0b2",
              boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.06)",
              cursor: "pointer"
            }
          },
          "& .fc-day-today .fc-daygrid-day-number": {
            backgroundColor: "#bbdefb",
            color: "#000",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "0.8rem",
            mr: "4px"
          },
          "& .fc-daygrid-day-number": {
            color: "#000"
          },
          "& .fc-event": {
            backgroundColor: "#fff",
            borderLeft: "4px solid #689f38",
            borderRadius: "6px",
            padding: "2px",
            boxShadow: "none",
            mt: 0.5
          }
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="ar"
          firstDay={0}
          headerToolbar={{
            start: "prev,next",
            center: "title",
            end: ""
          }}
          height="auto"
          showNonCurrentDates={false}
          events={events}
          eventDisplay="block"
          eventColor="transparent"
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          eventClick={(info) => {
            setSelectedEvent({
              id: info.event.id,
              title: info.event.title,
              date: info.event.startStr,
              description: info.event.extendedProps.description,
              location: info.event.extendedProps.location
            });
            setShowDetails(true);
          }}
          eventContent={(arg) => (
            <Box sx={{
              display: "flex",
              fontSize: "8px",
              gap: "4px",
              direction: "rtl",
              color: "#000",
              bgcolor: "#ffffff",
              px: 1,
              py: 0.5,
              borderRadius: "10px",
              boxShadow: "none",
              mt: 0.5
            }}>
              <Box sx={{
                width: "6px",
                height: "6px",
                backgroundColor: "#ef9a9a",
                borderRadius: "50%",
                mt: "4px",
                flexShrink: 0
              }} />
              <Typography sx={{
                overflow: "visible",
                wordWrap: "break-word",
                fontSize: "8px",
                lineHeight: "1.2"
              }}>
                {arg.event.title}
              </Typography>
            </Box>
          )}
        />
      </Box>

      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            p: 3,
            fontFamily: "Cairo, sans-serif"
          }
        }}
      >
        <DialogTitle sx={{
          fontSize: "1.4rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#1976d2",
          pb: 2,
          position: "relative"
        }}>
          تفاصيل الفعالية
          <IconButton
            aria-label="إغلاق"
            onClick={() => setShowDetails(false)}
            sx={{
              position: "absolute",
              left: 8,
              top: 8,
              color: "#333"
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mt: 1,
          fontSize: "0.95rem",
          fontWeight: 500,
          color: "#333"
        }}>
          <Typography>📌 <strong>العنوان:</strong> {selectedEvent?.title || "—"}</Typography>
          <Typography>
  📅 <strong>التاريخ:</strong>{" "}
  {selectedEvent?.date
    ? new Date(selectedEvent.date).toLocaleString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    : "—"}
</Typography>
          <Typography>📝 <strong>الوصف:</strong> {selectedEvent?.description || "—"}</Typography>
          <Typography>📍 <strong>الموقع:</strong> {selectedEvent?.location || "—"}</Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}