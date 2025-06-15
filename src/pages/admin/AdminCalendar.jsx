import React, { useEffect, useState } from "react";
import {
  Box, Container, Typography, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Button,
  Snackbar, Alert
} from "@mui/material";
import { db } from '../../components/firebase';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";
import RequireAdmin from '../../components/auth/RequireAdmin';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "", time: "", description: "", location: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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

  // دالة للحصول على الأيام في الشهر
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = الأحد
    
    const days = [];
    
    // إضافة أيام فارغة للأسبوع الأول
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // إضافة أيام الشهر
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // دالة للتنقل بين الشهور
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // دالة للحصول على الفعاليات في يوم معين
  const getEventsForDay = (day) => {
    if (!day) return [];
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  // دالة للتحقق من اليوم الحالي
  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // معالج النقر على اليوم (للأدمن)
  const handleDayClick = (day) => {
    if (!day) return;
    
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const now = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      setSnackbar({ open: true, message: "❌ لا يمكن إضافة فعالية في يوم ماضٍ", severity: "error" });
      return;
    }

    const defaultTime = new Date(selectedDate);
    defaultTime.setHours(9); // وقت افتراضي
    const formatted = defaultTime.toISOString().slice(0, 16);

    setFormData({ title: "", time: formatted, description: "", location: "" });
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  // معالج النقر على الفعالية
  const handleEventClick = (event) => {
    const rawTime = event.start;
    const formattedTime = new Date(rawTime).toISOString().slice(0, 16);

    setFormData({
      title: event.title,
      time: formattedTime,
      description: event.description,
      location: event.location
    });
    setSelectedEvent({ id: event.id });
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

  // أسماء الشهور بالعربية
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // أسماء الأيام بالعربية
  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <style jsx={"true"}>{`
          .calendar-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem;
            font-family: 'Cairo', sans-serif;
          }
          
          .calendar-header {
            text-align: center;
            margin-bottom: 1rem;
          }
          
          .calendar-wrapper {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            direction: rtl;
            overflow: hidden;
          }
          
          .calendar-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            margin-bottom: 1rem;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          
          .month-title {
            font-size: 1.4rem;
            font-weight: bold;
            background: linear-gradient(45deg, #ea580c, #f97316);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            flex: 1;
            font-family: 'Cairo', sans-serif;
          }
          
          .nav-button {
            background: linear-gradient(45deg, #ea580c, #f97316);
            border: none;
            color: white;
            border-radius: 8px;
            font-weight: bold;
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
            font-family: 'Cairo', sans-serif;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .nav-button:hover {
            background: linear-gradient(45deg, #f97316, #ea580c);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(234, 88, 12, 0.4);
          }
          
          .calendar-grid {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            overflow: hidden;
          }
          
          .days-header {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background: rgba(255, 255, 255, 0.95);
            border-bottom: 1px solid rgba(0,0,0,0.1);
          }
          
          .day-header {
            padding: 1rem 0;
            text-align: center;
            color: #374151;
            font-weight: bold;
            font-size: 1rem;
            font-family: 'Cairo', sans-serif;
            border-left: 1px solid rgba(0,0,0,0.1);
            background: rgba(255, 255, 255, 0.98);
          }
          
          .day-header:last-child {
            border-left: none;
          }
          
          .days-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0;
          }
          
          .day-cell {
            min-height: 100px;
            padding: 0.5rem;
            border-left: 1px solid rgba(0,0,0,0.1);
            border-bottom: 1px solid rgba(0,0,0,0.1);
            background: rgba(255, 255, 255, 0.8);
            transition: all 0.3s ease;
            position: relative;
            cursor: pointer;
          }
          
          .day-cell:nth-child(7n) {
            border-left: none;
          }
          
          .day-cell:hover {
            background: rgba(255, 255, 255, 0.95);
            transform: scale(1.02);
            box-shadow: 0 8px 25px rgba(234, 88, 12, 0.15);
            z-index: 1;
          }
          
          .day-cell.today {
            background: linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
          }
          
          .day-number {
            font-weight: bold;
            font-size: 0.9rem;
            color: #374151;
            margin-bottom: 0.5rem;
          }
          
          .day-number.today {
            background: linear-gradient(45deg, #ea580c, #f97316);
            color: white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
            box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4);
          }
          
          .event-item {
            background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
            border: 1px solid #fdba74;
            border-right: 4px solid #ea580c;
            color: #9a3412;
            padding: 0.5rem;
            margin-bottom: 0.25rem;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(234, 88, 12, 0.15);
            overflow: hidden;
            text-align: right;
            position: relative;
          }
          
          .event-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
            border-color: #ea580c;
            background: linear-gradient(135deg, #fff7ed 0%, #fb923c 100%);
            color: white;
          }
          
          .event-item.admin-event {
            /* نفس اللون تماماً كالتقويم الرئيسي */
            background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
            border: 1px solid #fdba74;
            border-right: 4px solid #ea580c;
            color: #9a3412;
          }
          
          .event-item.admin-event:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
            border-color: #ea580c;
            background: linear-gradient(135deg, #fff7ed 0%, #fb923c 100%);
            color: white;
          }
          
          .admin-badge {
            position: absolute;
            top: 2px;
            left: 2px;
            background: #ea580c;
            color: white;
            border-radius: 50%;
            width: 12px;
            height: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            font-weight: bold;
          }
          
          .event-title {
            color: #1f2937;
            line-height: 1.3;
            display: block;
            padding-right: 16px;
          }
          
          .add-event-hint {
            position: absolute;
            bottom: 4px;
            right: 4px;
            background: rgba(234, 88, 12, 0.1);
            color: #ea580c;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            opacity: 0;
            transition: all 0.3s ease;
          }
          
          .day-cell:hover .add-event-hint {
            opacity: 1;
          }
        `}</style>
        
        <Container maxWidth="xl" sx={{ mt: 3, fontFamily: "Cairo, sans-serif" }}>
          <div className="calendar-container">
            {/* Header */}
            <div className="calendar-header">
              <Typography variant="h5" fontWeight="bold" color="primary" align="center" mb={2}>
                التقويم - لوحة الإدارة
              </Typography>
            </div>

            {/* Calendar */}
            <div className="calendar-wrapper">
              {/* Navigation */}
              <div className="calendar-navigation">
                <button className="nav-button" onClick={() => navigateMonth(-1)}>
                  السابق
                </button>
                
                <div className="month-title">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                
                <button className="nav-button" onClick={() => navigateMonth(1)}>
                  التالي
                </button>
              </div>

              <div className="calendar-grid">
                {/* Days Header */}
                <div className="days-header">
                  {dayNames.map((dayName) => (
                    <div key={dayName} className="day-header">
                      {dayName}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="days-grid">
                  {getDaysInMonth(currentDate).map((day, index) => {
                    const dayEvents = getEventsForDay(day);
                    const todayClass = isToday(day) ? 'today' : '';
                    
                    return (
                      <div
                        key={index}
                        className={`day-cell ${todayClass}`}
                        onClick={() => handleDayClick(day)}
                      >
                        {day && (
                          <>
                            <div className={`day-number ${todayClass}`}>
                              {day}
                            </div>
                            {dayEvents.map((event) => (
                              <div
                                key={event.id}
                                className="event-item admin-event"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventClick(event);
                                }}
                              >
                                <div className="admin-badge">✎</div>
                                <span className="event-title">{event.title}</span>
                              </div>
                            ))}
                            <div className="add-event-hint">+</div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Dialog للإضافة/التعديل */}
          <Dialog 
            open={dialogOpen} 
            onClose={() => setDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            sx={{ 
              '& .MuiDialog-paper': { 
                borderRadius: '16px',
                fontFamily: 'Cairo, sans-serif',
                direction: 'rtl'
              }
            }}
          >
            <DialogTitle sx={{ 
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#ea580c',
              fontFamily: 'Cairo, sans-serif'
            }}>
              {selectedEvent ? "تعديل الفعالية" : "إضافة فعالية جديدة"}
            </DialogTitle>
            <DialogContent sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 2, 
              mt: 1,
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl'
            }}>
              <TextField 
                label="عنوان الفعالية" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                fullWidth 
                sx={{ 
                  fontFamily: 'Cairo, sans-serif',
                  '& .MuiInputBase-input': {
                    textAlign: 'right',
                    direction: 'rtl'
                  },
                  '& .MuiInputLabel-root': {
                    right: 24,
                    left: 'auto',
                    transformOrigin: 'top right',
                    top: '-8px',
                    fontSize: '0.85rem'
                  },
                  '& .MuiInputLabel-shrink': {
                    top: '-8px',
                    fontSize: '0.85rem'
                  }
                }}
              />
              <TextField
                label="تاريخ ووقت الفعالية"
                type="datetime-local"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 900 }}
                sx={{ 
                  fontFamily: 'Cairo, sans-serif',
                  '& .MuiInputBase-input': {
                    textAlign: 'right',
                    direction: 'rtl'
                  },
                  '& .MuiInputLabel-root': {
                    right: 24,
                    left: 'auto',
                    transformOrigin: 'top right',
                    top: '-8px',
                    fontSize: '0.85rem'
                  },
                  '& .MuiInputLabel-shrink': {
                    top: '-8px',
                    fontSize: '0.85rem'
                  }
                }}
              />
              <TextField 
                label="الوصف" 
                multiline 
                rows={3} 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                fullWidth 
                sx={{ 
                  fontFamily: 'Cairo, sans-serif',
                  '& .MuiInputBase-input': {
                    textAlign: 'right',
                    direction: 'rtl'
                  },
                  '& .MuiInputLabel-root': {
                    right: 24,
                    left: 'auto',
                    transformOrigin: 'top right',
                    top: '-8px',
                    fontSize: '0.85rem'
                  },
                  '& .MuiInputLabel-shrink': {
                    top: '-8px',
                    fontSize: '0.85rem'
                  }
                }}
              />
              <TextField 
                label="الموقع" 
                value={formData.location} 
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                fullWidth 
                sx={{ 
                  fontFamily: 'Cairo, sans-serif',
                  '& .MuiInputBase-input': {
                    textAlign: 'right',
                    direction: 'rtl'
                  },
                  '& .MuiInputLabel-root': {
                    right: 24,
                    left: 'auto',
                    transformOrigin: 'top right',
                    top: '-8px',
                    fontSize: '0.85rem'
                  },
                  '& .MuiInputLabel-shrink': {
                    top: '-8px',
                    fontSize: '0.85rem'
                  }
                }}
              />
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px' }}>
              {selectedEvent && (
                <Button 
                  onClick={handleDelete} 
                  color="error"
                  variant="outlined"
                  sx={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  حذف
                </Button>
              )}
              <Button 
                onClick={() => setDialogOpen(false)}
                sx={{ fontFamily: 'Cairo, sans-serif' }}
              >
                إلغاء
              </Button>
              <Button 
                onClick={handleSave} 
                variant="contained" 
                sx={{ 
                  background: 'linear-gradient(45deg, #ea580c, #f97316)',
                  fontFamily: 'Cairo, sans-serif'
                }}
              >
                حفظ
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%", fontFamily: 'Cairo, sans-serif' }}
              elevation={6}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}