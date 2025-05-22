import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Box, Container, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, Button
} from "@mui/material";
import { db, auth } from "../components/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "@fullcalendar/core/locales/ar";
import "@fontsource/cairo";

export default function CalendarSection() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, loading] = useAuthState(auth);
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  // ✅ الاستماع للتغييرات في الفعاليات
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
    <Container maxWidth="xl" sx={{ mt: 6, fontFamily: "Cairo, sans-serif" }}>
      <Typography variant="h4" fontWeight="bold" color="primary" mb={3} textAlign="center">
        التقويم
      </Typography>

      <Box
        sx={{
          direction: "rtl",
          "& .fc": { fontFamily: "Cairo, sans-serif", direction: "rtl", textAlign: "right" },
          "& .fc-daygrid-day-frame": { minHeight: "120px" },
          "& .fc-daygrid-day": { minWidth: "140px" },
          "& .fc-col-header-cell": { minWidth: "140px" },
          "& .fc-event-title": { whiteSpace: "normal !important" },
          "& .fc-day-today": {
            backgroundColor: "transparent !important",
            boxShadow: "none !important"
          },
          "& .fc-day-today .fc-daygrid-day-number": {
            border: "2px solid #1e2a78",
            borderRadius: "50%",
            padding: "4px 8px",
            display: "inline-block",
            color: "#1e2a78",
            fontWeight: "bold"
          }
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="ar"
          firstDay={0}
          showNonCurrentDates={false}
          height="auto"
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
            <Box sx={{ display: "flex", fontSize: "9px", gap: 1, direction: "rtl", color: "#000" }}>
              <Box sx={{
                width: 8, height: 8, bgcolor: "#f57c00", borderRadius: "50%",
                flexShrink: 0, mt: "4px"
              }} />
              <Typography sx={{
                overflow: "visible",
                wordWrap: "break-word",
                fontSize: "9px",
                lineHeight: "1.3"
              }}>
                {arg.event.title}
              </Typography>
            </Box>
          )}
        />
      </Box>

      <Dialog open={showDetails} onClose={() => { setShowDetails(false); setIsEditing(false); }}>
        <DialogTitle>تفاصيل الفعالية</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Typography>📌 <strong>العنوان:</strong> {selectedEvent?.title || "—"}</Typography>
          <Typography>📅 <strong>التاريخ:</strong> {selectedEvent?.date ? new Date(selectedEvent.date).toLocaleDateString("ar-EG", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
          }) : "—"}</Typography>
          <Typography>📝 <strong>الوصف:</strong> {selectedEvent?.description || "—"}</Typography>
          <Typography>📍 <strong>الموقع:</strong> {selectedEvent?.location || "—"}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
