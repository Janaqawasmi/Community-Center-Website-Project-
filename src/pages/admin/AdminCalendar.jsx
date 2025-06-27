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
import { withProgress } from "../../utils/withProgress";

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [centerEvents, setCenterEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDayEvents, setShowDayEvents] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "", time: "", description: "", location: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // جلب فعاليات التقويم (EventsCalender) - قابلة للتعديل
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "EventsCalender"), (snapshot) => {
      const formatted = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          start: data.time?.toDate?.() || new Date(data.time),
          description: data.description || "",
          location: data.location || "",
          type: "calendar"
        };
      });
      setEvents(formatted);
    });

    return () => unsubscribe();
  }, []);

  // جلب فعاليات المركز (Events) - للعرض فقط
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Events"), (snapshot) => {
      console.log("=== تحليل فعاليات المركز ===");
      
      const formatted = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log(`الفعالية: ${data.name}`);
        console.log(`التاريخ الخام:`, data.date);
        console.log(`الوقت الخام:`, data.time);
        
        let eventDate = new Date(); // قيمة افتراضية
        
        try {
          // إذا كان التاريخ string مثل "2025-06-11"
          if (typeof data.date === 'string' && data.date.includes('-')) {
            if (data.time && typeof data.time === 'string') {
              // دمج التاريخ والوقت: "2025-06-11" + "01:00" = "2025-06-11T01:00:00"
              const dateTimeString = `${data.date}T${data.time}:00`;
              eventDate = new Date(dateTimeString);
              console.log(`تم دمج التاريخ والوقت: ${dateTimeString} -> ${eventDate}`);
            } else {
              // تاريخ فقط بدون وقت
              eventDate = new Date(data.date + 'T09:00:00');
              console.log(`تاريخ فقط: ${data.date} -> ${eventDate}`);
            }
          }
          // إذا كان التاريخ Firestore Timestamp
          else if (data.date && typeof data.date === 'object' && data.date.toDate) {
            eventDate = data.date.toDate();
            if (data.time && typeof data.time === 'string') {
              const [hours, minutes] = data.time.split(':');
              eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            }
            console.log(`Firestore Timestamp: ${eventDate}`);
          }
          // إذا كان التاريخ بصيغة أخرى
          else if (data.date) {
            eventDate = new Date(data.date);
            console.log(`صيغة أخرى: ${data.date} -> ${eventDate}`);
          }
          
          // التحقق من صحة التاريخ
          if (isNaN(eventDate.getTime())) {
            console.error(`تاريخ غير صحيح للفعالية: ${data.name}`);
            eventDate = new Date(); // استخدام التاريخ الحالي كبديل
          }
          
          console.log(`النتيجة النهائية: اليوم ${eventDate.getDate()}, الشهر ${eventDate.getMonth() + 1}, السنة ${eventDate.getFullYear()}`);
          console.log("---");
          
        } catch (error) {
          console.error("خطأ في معالجة التاريخ:", error);
          eventDate = new Date();
        }

        return {
          id: doc.id,
          title: data.name || "فعالية المركز",
          start: eventDate,
          description: data.description || "",
          location: data.location || "",
          capacity: data.capacity || "",
          price: data.price || 0,
          imageUrl: data.imageUrl || "",
          isActive: data.isActive !== false,
          type: "center"
        };
      });
      
      const activeEvents = formatted.filter(event => event.isActive);
      console.log("الفعاليات النشطة النهائية:", activeEvents);
      setCenterEvents(activeEvents);
    });

    return () => unsubscribe();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    
    const allEvents = [...events, ...centerEvents];
    
    return allEvents.filter(event => {
      const eventDate = new Date(event.start);
      const eventDay = eventDate.getDate();
      const eventMonth = eventDate.getMonth();
      const eventYear = eventDate.getFullYear();
      
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      return (
        eventDay === day &&
        eventMonth === currentMonth &&
        eventYear === currentYear
      );
    });
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDayClick = (day, dayEvents = []) => {
    if (!day) return;
    
    // للأدمن: السماح بإضافة فعاليات دون حد أقصى
    // فقط إذا ضغط على المنطقة الفارغة من الخلية (وليس على فعالية)
    
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const now = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      setSnackbar({ open: true, message: "❌ لا يمكن إضافة فعالية في يوم ماضٍ", severity: "error" });
      return;
    }

    const defaultTime = new Date(selectedDate);
    defaultTime.setHours(9);
    const formatted = defaultTime.toISOString().slice(0, 16);

    setFormData({ title: "", time: formatted, description: "", location: "" });
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleEventClick = (event) => {
    if (event.type === "center") {
      setSelectedEvent({
        id: event.id,
        title: event.title,
        date: event.start.toISOString(),
        description: event.description,
        location: event.location,
        capacity: event.capacity || "",
        price: event.price || 0,
        imageUrl: event.imageUrl || "",
        type: event.type
      });
      setShowDetails(true);
      return;
    }

    const rawTime = event.start;
    const formattedTime = new Date(rawTime).toISOString().slice(0, 16);

    setFormData({
      title: event.title,
      time: formattedTime,
      description: event.description,
      location: event.location
    });
    setSelectedEvent({ id: event.id, type: event.type });
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

      if (selectedEvent && selectedEvent.type === "calendar") {
       await withProgress(() =>
  updateDoc(doc(db, "EventsCalender", selectedEvent.id), data)
);

        setSnackbar({ open: true, message: "✅ تم التحديث بنجاح", severity: "success" });
      } else {
       await withProgress(() =>
  addDoc(collection(db, "EventsCalender"), data)
);

        setSnackbar({ open: true, message: "✅ تم إضافة الفعالية", severity: "success" });
      }

      setDialogOpen(false);
    } catch (error) {
      setSnackbar({ open: true, message: "❌ حدث خطأ بالحفظ", severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedEvent && selectedEvent.type === "calendar") {
       await withProgress(() =>
  deleteDoc(doc(db, "EventsCalender", selectedEvent.id))
);

        setSnackbar({ open: true, message: "🗑️ تم حذف الفعالية", severity: "success" });
        setDialogOpen(false);
      }
    } catch (error) {
      setSnackbar({ open: true, message: "❌ حدث خطأ بالحذف", severity: "error" });
    }
  };

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <style jsx>{`
          .calendar-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem;
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
          }
          
          .nav-button {
            background: linear-gradient(45deg, #ea580c, #f97316);
            border: none;
            color: white;
            border-radius: 8px;
            font-weight: bold;
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
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

          .event-item.center-event {
            background: linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%);
            border: 1px solid #7dd3fc;
            border-right: 4px solid #0369a1;
            color: #0c4a6e;
          }
          
          .event-item.center-event:hover {
            background: linear-gradient(135deg, #f0f9ff 0%, #38bdf8 100%);
            border-color: #0369a1;
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

          .center-badge {
            position: absolute;
            top: 2px;
            left: 2px;
            background: #0369a1;
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
          
          .more-events {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 0.3rem;
            margin-top: 0.25rem;
            border-radius: 6px;
            font-size: 0.65rem;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 6px rgba(245, 158, 11, 0.25);
          }
          
          .more-events:hover {
            background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(245, 158, 11, 0.35);
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            padding: 20px;
          }
          
          .modal-content {
            background: white;
            border-radius: 12px;
            padding: 1rem;
            width: 90%;
            max-width: 380px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
            position: relative;
            border: 1px solid rgba(0, 0, 0, 0.1);
          }
          
          .modal-header {
            text-align: center;
            margin-bottom: 1rem;
            position: relative;
            padding-bottom: 0.8rem;
            border-bottom: 1px solid #f1f5f9;
          }
          
          .modal-title {
            font-size: 1.1rem;
            font-weight: bold;
            color: #1e293b;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          
          .close-button {
            position: absolute;
            right: 0;
            top: -0.3rem;
            background: #f1f5f9;
            border: none;
            border-radius: 50%;
            width: 1.8rem;
            height: 1.8rem;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            color: #64748b;
            font-weight: bold;
          }
          
          .close-button:hover {
            background: #e2e8f0;
            transform: scale(1.1);
            color: #475569;
          }

          .day-events-list {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            max-height: 60vh;
            overflow-y: auto;
          }
          
          .day-event-item {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.8rem;
            background: #fff7ed;
            border-radius: 8px;
            border-right: 3px solid #ea580c;
            cursor: pointer;
            transition: all 0.3s ease;
            border-left: 1px solid #fdba74;
            border-top: 1px solid #fdba74;
            border-bottom: 1px solid #fdba74;
          }
          
          .day-event-item:hover {
            background: #fef3e2;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
          }
          
          .day-event-item.center-event {
            background: #fff7ed;
            border-right-color: #ea580c;
            border-left-color: #fdba74;
            border-top-color: #fdba74;
            border-bottom-color: #fdba74;
          }
          
          .day-event-item.center-event:hover {
            background: #fef3e2;
          }
          
          .event-time {
            background: linear-gradient(45deg, #ea580c, #f97316);
            color: white;
            padding: 0.3rem 0.6rem;
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: bold;
            min-width: 60px;
            text-align: center;
          }
          
          .day-event-item.center-event .event-time {
            background: linear-gradient(45deg, #ea580c, #d97706);
          }
          
          .event-content {
            flex: 1;
          }
          
          .event-title-day {
            font-weight: bold;
            color: #9a3412;
            font-size: 0.8rem;
            margin-bottom: 0.2rem;
          }
          
          .event-desc {
            color: #ea580c;
            font-size: 0.7rem;
            line-height: 1.3;
            opacity: 0.8;
          }
          
          .event-type-badge {
            background: #fff7ed;
            border: 1px solid #fdba74;
            padding: 0.3rem;
            border-radius: 50%;
            font-size: 0.8rem;
            color: #ea580c;
          }
          
          .event-type-badge.center {
            background: #fff7ed;
            border-color: #fdba74;
          }

          .event-details {
            display: flex;
            flex-direction: column;
            gap: 0.7rem;
          }
          
          .event-detail-item {
            padding: 0.7rem;
            background: #fff7ed;
            border-radius: 8px;
            border-right: 3px solid #ea580c;
            transition: all 0.3s ease;
            border-left: 1px solid #fdba74;
            border-top: 1px solid #fdba74;
            border-bottom: 1px solid #fdba74;
          }
          
          .event-detail-label {
            font-weight: bold;
            color: #ea580c;
            margin-bottom: 0.3rem;
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.3rem;
          }
          
          .event-detail-value {
            color: #9a3412;
            line-height: 1.3;
            font-size: 0.7rem;
            margin-right: 0.8rem;
            font-weight: 500;
            word-wrap: break-word;
          }
        `}</style>
        
        <Container maxWidth="xl" sx={{ mt: 3, }}>
          <div className="calendar-container">
            <div className="calendar-header">
              <Typography variant="h5" fontWeight="bold" color="primary" align="center" mb={2}>
                التقويم - لوحة الإدارة
              </Typography>
            </div>

            <div className="calendar-wrapper">
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
                <div className="days-header">
                  {dayNames.map((dayName) => (
                    <div key={dayName} className="day-header">
                      {dayName}
                    </div>
                  ))}
                </div>

                <div className="days-grid">
                  {getDaysInMonth(currentDate).map((day, index) => {
                    const dayEvents = getEventsForDay(day);
                    const todayClass = isToday(day) ? 'today' : '';
                    const maxVisibleEvents = 1; // عرض فعالية واحدة فقط
                    const visibleEvents = dayEvents.slice(0, maxVisibleEvents);
                    const remainingEvents = dayEvents.length - maxVisibleEvents;
                    
                    return (
                      <div
                        key={index}
                        className={`day-cell ${todayClass}`}
                        onClick={() => handleDayClick(day, dayEvents)}
                      >
                        {day && (
                          <>
                            <div className={`day-number ${todayClass}`}>
                              {day}
                            </div>
                            
                            {/* عرض فعالية واحدة فقط */}
                            {visibleEvents.map((event) => (
                              <div
                                key={`${event.type}-${event.id}`}
                                className={`event-item ${event.type === 'center' ? 'center-event' : 'admin-event'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventClick(event);
                                }}
                              >
                                <div className={event.type === 'center' ? 'center-badge' : 'admin-badge'}>
                                  {event.type === 'center' ? '👁' : '✎'}
                                </div>
                                <span className="event-title">{event.title}</span>
                              </div>
                            ))}
                            
                            {/* عرض عدد الفعاليات الإضافية */}
                            {remainingEvents > 0 && (
                              <div 
                                className="more-events"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDayEvents(dayEvents);
                                  setShowDayEvents(true);
                                }}
                              >
                                +{remainingEvents} أخرى
                              </div>
                            )}
                            
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
                direction: 'rtl'
              }
            }}
          >
            <DialogTitle sx={{ 
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#ea580c',
            }}>
              {selectedEvent ? "تعديل الفعالية" : "إضافة فعالية جديدة"}
            </DialogTitle>
            <DialogContent sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 2, 
              mt: 1,
              direction: 'rtl'
            }}>
              <TextField 
                label="عنوان الفعالية" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                fullWidth 
                sx={{ 
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
              {selectedEvent && selectedEvent.type === "calendar" && (
                <Button 
                  onClick={handleDelete} 
                  color="error"
                  variant="outlined"
                >
                  حذف
                </Button>
              )}
              <Button 
                onClick={() => setDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button 
                onClick={handleSave} 
                variant="contained" 
                sx={{ 
                  background: 'linear-gradient(45deg, #ea580c, #f97316)',
                }}
              >
                حفظ
              </Button>
            </DialogActions>
          </Dialog>

          {/* Modal لعرض جميع فعاليات اليوم */}
          {showDayEvents && (
            <div className="modal-overlay" onClick={() => setShowDayEvents(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">
                    📅 فعاليات اليوم ({selectedDayEvents.length} فعالية)
                  </h2>
                  <button 
                    className="close-button"
                    onClick={() => setShowDayEvents(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="day-events-list">
                  {selectedDayEvents.map((event) => (
                    <div
                      key={`${event.type}-${event.id}`}
                      className={`day-event-item ${event.type === 'center' ? 'center-event' : ''}`}
                      onClick={() => {
                        setShowDayEvents(false);
                        handleEventClick(event);
                      }}
                    >
                      <div className="event-time">
                        {event.start.toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false
                        })}
                      </div>
                      <div className="event-content">
                        <div className="event-title-day">{event.title}</div>
                        {event.description && (
                          <div className="event-desc">{event.description}</div>
                        )}
                      </div>
                      <div className={`event-type-badge ${event.type}`}>
                        {event.type === 'center' ? '👁' : '✎'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal لعرض تفاصيل فعاليات المركز */}
          {showDetails && (
            <div className="modal-overlay" onClick={() => setShowDetails(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">
                    📋 تفاصيل فعالية المركز
                  </h2>
                  <button 
                    className="close-button"
                    onClick={() => setShowDetails(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="event-details">
                  <div className="event-detail-item">
                    <div className="event-detail-label">📌 العنوان:</div>
                    <div className="event-detail-value">{selectedEvent?.title || "—"}</div>
                  </div>
                  
                  <div className="event-detail-item">
                    <div className="event-detail-label">⏰ الوقت:</div>
                    <div className="event-detail-value">
                      {selectedEvent?.date
                        ? new Date(selectedEvent.date).toLocaleTimeString("ar-EG", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                          })
                        : "—"}
                    </div>
                  </div>
                  
                  <div className="event-detail-item">
                    <div className="event-detail-label">📝 الوصف:</div>
                    <div className="event-detail-value">{selectedEvent?.description || "—"}</div>
                  </div>
                  
                  <div className="event-detail-item">
                    <div className="event-detail-label">📍 الموقع:</div>
                    <div className="event-detail-value">{selectedEvent?.location || "—"}</div>
                  </div>

                  {selectedEvent?.capacity && (
                    <div className="event-detail-item">
                      <div className="event-detail-label">👥 السعة:</div>
                      <div className="event-detail-value">{selectedEvent.capacity}</div>
                    </div>
                  )}

                  {selectedEvent?.price !== undefined && (
                    <div className="event-detail-item">
                      <div className="event-detail-label">💰 السعر:</div>
                      <div className="event-detail-value">
                        {selectedEvent.price === 0 ? "مجاني" : `${selectedEvent.price} شيكل`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}