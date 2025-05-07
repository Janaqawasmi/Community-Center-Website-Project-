import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EventCalendar.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { Modal, Box, Typography, IconButton, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function EventCalendar() {
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const app = getApp();
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, "Events"));
      const fetchedEvents = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.time) {
          fetchedEvents.push({
            id: doc.id,
            date: data.time.toDate(),
            title: data.title,
            description: data.description,
            location: data.location
          });
        }
      });
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, []);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const handleDateClick = (date) => {
    const dayEvents = events.filter(event => isSameDay(event.date, date));
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
      setOpenModal(true);
    } else {
      setSelectedDayEvents([]);
    }
    setValue(date);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatTime = (date) => {
    if (!date) return "";
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ direction: 'rtl', textAlign: 'center', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>لائحة الفعاليات</h2>

      <Calendar
        onClickDay={handleDateClick}
        onChange={setValue}
        value={value}
        locale="ar"
        tileContent={({ date, view }) => {
          if (view === 'month') {
            const dayEvents = events.filter(event => isSameDay(event.date, date));
            if (dayEvents.length > 0) {
              return (
                <div style={{ fontSize: '0.5rem', color: 'black', marginTop: '4px' }}>
                  {dayEvents.map((event, idx) => (
                    <div key={idx}>
                      {event.title ? event.title : ""}
                    </div>
                  ))}
                </div>
              );
            }
          }
          return null;
        }}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            if (events.find(event => isSameDay(event.date, date))) {
              return 'event-day';
            }
          }
        }}
      />

      {/* Modal for event details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'right',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            {/* Close Button */}
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                left: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Event Details */}
            {selectedDayEvents.map((event, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Typography variant="h6">{event.title || "لا يوجد عنوان"}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>التاريخ:</strong> {formatDate(event.date)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>الوقت:</strong> {formatTime(event.date)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>الوصف:</strong> {event.description || "لا يوجد وصف."}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>الموقع:</strong> {event.location || "لا يوجد موقع."}
                </Typography>
              </Box>
            ))}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
