import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box, Container, Typography, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Button,
  Snackbar, Alert
} from "@mui/material";
import { db, auth } from "../components/firebase";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "@fullcalendar/core/locales/ar";
import "@fontsource/cairo";

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "", time: "", description: "", location: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [user, loading] = useAuthState(auth);

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

  const handleDateClick = (arg) => {
    const selectedDate = new Date(arg.dateStr);
    const now = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      setSnackbar({ open: true, message: "❌ لا يمكن إضافة فعالية في يوم ماضٍ", severity: "error" });
      return;
    }

    const defaultTime = new Date(arg.dateStr);
    defaultTime.setHours(9); // وقت افتراضي
    const formatted = defaultTime.toISOString().slice(0, 16);

    setFormData({ title: "", time: formatted, description: "", location: "" });
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleEventClick = (info) => {
    const rawTime = info.event.start;
    const formattedTime = new Date(rawTime).toISOString().slice(0, 16);

    setFormData({
      title: info.event.title,
      time: formattedTime,
      description: info.event.extendedProps.description,
      location: info.event.extendedProps.location
    });
    setSelectedEvent({ id: info.event.id });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const date = new Date(formData.time);

      const data = {
        title: formData.title,
        time: date,
        description: formData.description,
        location: formData.location,
        createdAt: serverTimestamp()
      };

      if (selectedEvent) {
        await updateDoc(doc(db, "EventsCalender", selectedEvent.id), data);
        setSnackbar({ open: true, message: "✅ تم التحديث بنجاح", severity: "success" });
      } else {
        await addDoc(collection(db, "EventsCalender"), data);
        setSnackbar({ open: true, message: "✅ تم إضافة الفعالية", severity: "success" });
      }

      setDialogOpen(false);
    } catch (error) {
      setSnackbar({ open: true, message: "❌ حدث خطأ بالحفظ", severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "EventsCalender", selectedEvent.id));
      setSnackbar({ open: true, message: "🗑️ تم حذف الفعالية", severity: "success" });
      setDialogOpen(false);
    } catch (error) {
      setSnackbar({ open: true, message: "❌ حدث خطأ بالحذف", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Typography>...جار التحميل</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, fontFamily: "Cairo, sans-serif" }}>
      <Typography variant="h5" fontWeight="bold" color="primary" align="center" mb={2}>
        التقويم
      </Typography>

      <Box sx={{
        direction: "rtl", color: "#000", backgroundColor: "#f9f9fb", p: 1, borderRadius: 2,
        "& .fc": {
          fontFamily: "Cairo, sans-serif", fontSize: "0.85rem", direction: "rtl", textAlign: "right", color: "#000"
        },
        "& .fc-header-toolbar": {
          display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, my: 1
        },
        "& .fc .fc-button": {
          backgroundColor: "#1976d2", borderColor: "#1976d2", color: "white", borderRadius: 1, fontWeight: "bold", px: 1.5, fontSize: "0.75rem",
          "&:hover": { backgroundColor: "#0d47a1" }
        },
        "& .fc-toolbar-title": {
          fontSize: "1.2rem", fontWeight: "bold", color: "#1976d2", textAlign: "center", flex: 1
        },
        "& .fc-col-header": { backgroundColor: "#fff3e0" },
        "& .fc-col-header-cell-cushion": { color: "#000" },
        "& .fc-daygrid-day-frame": {
          backgroundColor: "#fffaf2", border: "1px solid rgba(0,0,0,0.05)", padding: "4px"
        },
        "& .fc-daygrid-day": {
          boxShadow: "inset 0 0 3px rgba(0, 0, 0, 0.04)", "&:hover": {
            backgroundColor: "#ffe0b2", boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.06)", cursor: "pointer"
          }
        },
        "& .fc-day-today .fc-daygrid-day-number": {
          backgroundColor: "#bbdefb", color: "#000", borderRadius: "50%", width: "20px", height: "20px",
          display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem", mr: "4px"
        },
        "& .fc-daygrid-day-number": { color: "#000" },
        "& .fc-event": {
          backgroundColor: "#fff", borderLeft: "4px solid #689f38", borderRadius: "6px", padding: "2px", boxShadow: "none", mt: 0.5
        }
      }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ar"
          firstDay={0}
          headerToolbar={{ start: "prev,next", center: "title", end: "" }}
          height="auto"
          showNonCurrentDates={false}
          events={events}
          eventDisplay="block"
          eventColor="transparent"
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{selectedEvent ? "تعديل الحدث" : "إضافة حدث جديد"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="عنوان الحدث" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} fullWidth />
          <TextField
            label="تاريخ ووقت الحدث"
            type="datetime-local"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 900 }}
          />
          <TextField label="الوصف" multiline rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} fullWidth />
          <TextField label="الموقع" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          {selectedEvent && <Button onClick={handleDelete} color="error">حذف</Button>}
          <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave} variant="contained" color="primary">حفظ</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
