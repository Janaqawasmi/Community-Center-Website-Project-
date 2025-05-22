import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Box, Container, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress
} from "@mui/material";
import { db, auth } from "../components/firebase";
import {
  collection, getDocs, addDoc, serverTimestamp,
  doc, updateDoc, deleteDoc
} from "firebase/firestore";
import "@fontsource/cairo";
import "@fullcalendar/core/locales/ar";
import { useAuthState } from "react-firebase-hooks/auth";

export default function CalendarSection() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "", location: "" });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, loading] = useAuthState(auth);
  const ADMIN_EMAIL = "ddwayat95@gmail.com";

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "EventsCalender"));
      const formatted = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          start: data.time?.toDate?.() || new Date(data.time),
          description: data.description || "",
          location: data.location || "",
        };
      });
      setEvents(formatted);
    };

    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;

    const docRef = await addDoc(collection(db, "EventsCalender"), {
      title: newEvent.title,
      time: new Date(newEvent.date),
      description: newEvent.description,
      location: newEvent.location,
      createdAt: serverTimestamp(),
    });

    setEvents([...events, {
      id: docRef.id,
      title: newEvent.title,
      start: new Date(newEvent.date),
      description: newEvent.description,
      location: newEvent.location,
    }]);

    setNewEvent({ title: "", date: "", description: "", location: "" });
    setOpen(false);
  };

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>جارٍ التحقق من الصلاحيات...</Typography>
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
          "& .fc": {
            fontFamily: "Cairo, sans-serif",
            direction: "rtl",
            textAlign: "right",
          },
          "& .fc-daygrid-day-frame": {
            minHeight: "120px",
          },
          "& .fc-daygrid-day": {
            minWidth: "140px",
          },
          "& .fc-col-header-cell": {
            minWidth: "140px",
          },
          "& .fc-event-title": {
            whiteSpace: "normal !important",
          },
          "& .fc-day-today": {
            backgroundColor: "transparent !important",
            boxShadow: "none !important",
          },
          "& .fc-day-today .fc-daygrid-day-number": {
            border: "2px solid #1e2a78",
            borderRadius: "50%",
            padding: "4px 8px",
            display: "inline-block",
            minWidth: "24px",
            textAlign: "center",
            color: "#1e2a78",
            fontWeight: "bold",
          },
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
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                fontSize: "9px",
                fontWeight: 400,
                gap: 1,
                mb: "2px",
                direction: "rtl",
                color: "#000",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: "#f57c00",
                  borderRadius: "50%",
                  flexShrink: 0,
                  mt: "4px",
                }}
              />
              <Typography
                sx={{
                  overflow: "visible",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  fontSize: "9px",
                  lineHeight: "1.3",
                  color: "#000",
                }}
              >
                {arg.event.title}
              </Typography>
            </Box>
          )}
        />
      </Box>

      {user && user.email === ADMIN_EMAIL && (
        <Box mt={4} textAlign="center">
          <Button variant="contained" onClick={() => setOpen(true)} color="primary">
            ➕ إضافة فعالية جديدة
          </Button>
        </Box>
      )}

      {/* Dialog الإضافة */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>إضافة فعالية جديدة</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="عنوان الفعالية"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="تاريخ الفعالية"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            fullWidth
          />
          <TextField
            label="الوصف"
            multiline
            rows={2}
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            fullWidth
          />
          <TextField
            label="الموقع"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={handleAddEvent} variant="contained" color="primary">حفظ</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog عرض التفاصيل */}
      <Dialog open={showDetails} onClose={() => { setShowDetails(false); setIsEditing(false); }}>
        <DialogTitle>{isEditing ? "تعديل الفعالية" : "تفاصيل الفعالية"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {isEditing ? (
            <>
              <TextField
                label="عنوان الفعالية"
                value={selectedEvent?.title || ""}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                fullWidth
              />
              <TextField
                label="تاريخ الفعالية"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={selectedEvent?.date || ""}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
                fullWidth
              />
              <TextField
                label="الوصف"
                multiline
                rows={2}
                value={selectedEvent?.description || ""}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                fullWidth
              />
              <TextField
                label="الموقع"
                value={selectedEvent?.location || ""}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
                fullWidth
              />
            </>
          ) : (
            <>
              <Typography>📌 <strong>العنوان:</strong> {selectedEvent?.title}</Typography>
              <Typography>📅 <strong>التاريخ:</strong> {selectedEvent?.date}</Typography>
              <Typography>📝 <strong>الوصف:</strong> {selectedEvent?.description || "—"}</Typography>
              <Typography>📍 <strong>الموقع:</strong> {selectedEvent?.location || "—"}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowDetails(false); setIsEditing(false); }}>إغلاق</Button>
          {user?.email === ADMIN_EMAIL && (
            isEditing ? (
              <Button
                onClick={async () => {
                  const docRef = doc(db, "EventsCalender", selectedEvent.id);
                  await updateDoc(docRef, {
                    title: selectedEvent.title,
                    time: new Date(selectedEvent.date),
                    description: selectedEvent.description,
                    location: selectedEvent.location,
                  });
                  setEvents(events.map(ev => ev.id === selectedEvent.id ? {
                    ...ev,
                    title: selectedEvent.title,
                    start: new Date(selectedEvent.date),
                    description: selectedEvent.description,
                    location: selectedEvent.location
                  } : ev));
                  setIsEditing(false);
                  setShowDetails(false);
                }}
                variant="contained"
                color="primary"
              >
                حفظ التعديلات
              </Button>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)}>✏️ تعديل</Button>
                <Button
                  color="error"
                  onClick={async () => {
                    await deleteDoc(doc(db, "EventsCalender", selectedEvent.id));
                    setEvents(events.filter(ev => ev.id !== selectedEvent.id));
                    setShowDetails(false);
                  }}
                >
                  🗑️ حذف
                </Button>
              </>
            )
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
