import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import arSA from 'date-fns/locale/ar-SA';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../components/firebase';

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';

const locales = {
  'ar-SA': arSA,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }),
  getDay,
  locales,
});

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    description: '',
    location: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // ✅ جلب الفعاليات من الفايربيز
  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'EventsCalender'));
      const data = snapshot.docs
        .map(doc => {
          const raw = doc.data();
          if (!raw.time) return null;
          const time = raw.time.toDate();
          return {
            id: doc.id,
            title: raw.title,
            start: time,
            end: time,
            date: time,
            description: raw.description || '',
            location: raw.location || '',
          };
        })
        .filter(Boolean);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectSlot = ({ start }) => {
    setFormData({
      title: '',
      time: format(start, "yyyy-MM-dd'T'HH:mm"),
      description: '',
      location: ''
    });
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleSelectEvent = (event) => {
    setFormData({
      title: event.title,
      time: format(event.date, "yyyy-MM-dd'T'HH:mm"),
      description: event.description || '',
      location: event.location || ''
    });
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      title: '',
      time: '',
      description: '',
      location: ''
    });
    setSelectedEvent(null);
  };

  const handleSave = async () => {
    try {
      const data = {
        title: formData.title,
        time: new Date(formData.time),
        description: formData.description,
        location: formData.location,
        createdAt: serverTimestamp()
      };

      if (selectedEvent) {
        await updateDoc(doc(db, 'EventsCalender', selectedEvent.id), data);
        setSnackbar({
          open: true,
          message: '✅ تم تحديث الحدث بنجاح',
          severity: 'success',
        });
      } else {
        await addDoc(collection(db, 'EventsCalender'), data);
        setSnackbar({
          open: true,
          message: '✅ تم إضافة الحدث بنجاح',
          severity: 'success',
        });
      }

      fetchEvents();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving event:', error);
      setSnackbar({
        open: true,
        message: '❌ حدث خطأ أثناء حفظ الحدث',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'EventsCalender', selectedEvent.id));
      setSnackbar({
        open: true,
        message: '🗑️ تم حذف الحدث بنجاح',
        severity: 'success',
      });
      fetchEvents();
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting event:', error);
      setSnackbar({
        open: true,
        message: '❌ حدث خطأ أثناء حذف الحدث',
        severity: 'error',
      });
    }
  };

  return (
    <Box p={4} sx={{ direction: 'rtl' }}>
      <Typography variant="h4" mb={3} color="primary" fontWeight="bold" textAlign="center">
        إدارة التقويم
      </Typography>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        messages={{
          next: 'التالي',
          previous: 'السابق',
          today: 'اليوم',
          month: 'شهر',
          week: 'أسبوع',
          day: 'يوم',
          agenda: 'أجندة',
          date: 'تاريخ',
          time: 'الوقت',
          event: 'حدث',
          noEventsInRange: 'لا توجد أحداث في هذا النطاق.',
        }}
      />

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedEvent ? 'تعديل الحدث' : 'إضافة حدث جديد'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="عنوان الحدث" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} fullWidth />
          <TextField label="تاريخ ووقت الحدث" type="datetime-local" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="الوصف" multiline rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} fullWidth />
          <TextField label="الموقع" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          {selectedEvent && <Button onClick={handleDelete} color="error">حذف</Button>}
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleSave} variant="contained" color="primary">حفظ</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
