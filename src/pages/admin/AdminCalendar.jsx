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
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';

// =======================
// Helper Functions
// =======================

const CALENDAR_CONSTANTS = {
  MONTH_NAMES: [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ],
  DAY_NAMES: [
    'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 
    'الخميس', 'الجمعة', 'السبت'
  ],
  MESSAGES: {
    SUCCESS: {
      EVENT_ADDED: "✅ تم إضافة الفعالية",
      EVENT_UPDATED: "✅ تم التحديث بنجاح",
      EVENT_DELETED: "🗑️ تم حذف الفعالية"
    },
    ERROR: {
      PAST_DATE: "❌ لا يمكن إضافة فعالية في يوم ماضٍ",
      SAVE_ERROR: "❌ حدث خطأ بالحفظ",
      DELETE_ERROR: "❌ حدث خطأ بالحذف"
    }
  },
  MAX_VISIBLE_EVENTS: 1
};

// دالة معالجة بيانات Firestore
const processFirestoreEvent = (doc, type) => {
  const data = doc.data();
  
  if (type === "calendar") {
    return {
      id: doc.id,
      type: type,
      title: data.title,
      start: data.time?.toDate?.() || new Date(data.time),
      description: data.description || "",
      location: data.location || ""
    };
  } else if (type === "center") {
    let eventDate = new Date();
    
    try {
      if (typeof data.date === 'string' && data.date.includes('-')) {
        if (data.time && typeof data.time === 'string') {
          const dateTimeString = `${data.date}T${data.time}:00`;
          eventDate = new Date(dateTimeString);
        } else {
          eventDate = new Date(data.date + 'T09:00:00');
        }
      } else if (data.date && typeof data.date === 'object' && data.date.toDate) {
        eventDate = data.date.toDate();
        if (data.time && typeof data.time === 'string') {
          const [hours, minutes] = data.time.split(':');
          eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }
      } else if (data.date) {
        eventDate = new Date(data.date);
      }
      
      if (isNaN(eventDate.getTime())) {
        eventDate = new Date();
      }
    } catch (error) {
      eventDate = new Date();
    }

    return {
      id: doc.id,
      type: type,
      title: data.name || "فعالية المركز",
      start: eventDate,
      description: data.description || "",
      location: data.location || "",
      capacity: data.capacity || "",
      price: data.price || 0,
      imageUrl: data.imageUrl || "",
      isActive: data.isActive !== false
    };
  }
  
  return { id: doc.id, type: type };
};

// دالة الحصول على أيام الشهر
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

// دالة التحقق من اليوم الحالي
const isToday = (day, currentDate) => {
  if (!day) return false;
  const today = new Date();
  return (
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()
  );
};

// دالة الحصول على فعاليات اليوم
const getEventsForDay = (day, currentDate, allEvents) => {
  if (!day) return [];
  
  return allEvents.filter(event => {
    const eventDate = new Date(event.start);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return (
      eventDate.getDate() === day &&
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  });
};

// دالة التحقق من إمكانية إضافة فعالية
const canAddEventOnDate = (selectedDate) => {
  const now = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return selectedDate >= now;
};

// مكون TextField للعربية
const RTLTextField = (props) => {
  return (
    <TextField 
      {...props}
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
        },
        ...props.sx
      }}
    />
  );
};

// =======================
// Main Component
// =======================

import { withProgress } from "../../utils/withProgress";


export default function AdminCalendar() {
  const [programEvents, setProgramEvents] = useState([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState(null);
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
  const [deleteDialog, setDeleteDialog] = useState({ open: false });

  // دالة إظهار الرسائل
  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // جلب فعاليات التقويم
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "EventsCalender"), (snapshot) => {
      const formatted = snapshot.docs.map((doc) => 
        processFirestoreEvent(doc, "calendar")
      );
      setEvents(formatted);
    });

    return () => unsubscribe();
  }, []);

  
  // جلب فعاليات المركز
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Events"), (snapshot) => {
      const formatted = snapshot.docs.map((doc) => 
        processFirestoreEvent(doc, "center")
      );
      
      const activeEvents = formatted.filter(event => event.isActive !== false);
      setCenterEvents(activeEvents);
    });

    return () => unsubscribe();
  }, []);


  // جلب الدورات (Programs)
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "programs"), (snapshot) => {
    const formatted = snapshot.docs.map((doc) => {
      const data = doc.data();
      
      let programDate = new Date();
      
      try {
        if (data.date && typeof data.date === 'object' && data.date.toDate) {
          programDate = data.date.toDate();
          if (data.time && typeof data.time === 'string') {
            const [hours, minutes] = data.time.split(':');
            programDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          }
        }
        else if (typeof data.date === 'string' && data.date.includes('-')) {
          if (data.time && typeof data.time === 'string') {
            const dateTimeString = `${data.date}T${data.time}:00`;
            programDate = new Date(dateTimeString);
          } else {
            programDate = new Date(data.date + 'T09:00:00');
          }
        }
        
        if (isNaN(programDate.getTime())) {
          programDate = new Date();
        }
        
      } catch (error) {
        console.error("خطأ في معالجة تاريخ الدورة:", error);
        programDate = new Date();
      }

      return {
        id: doc.id,
        type: "program",
        title: data.name || "دورة",
        start: programDate,
        description: data.description || "",
        location: data.location || "",
        price: data.price || 0,
        instructor: data.instructor_name || "",
        capacity: data.capacity || 0,
        isActive: data.isActive !== false
      };
    });
    
    setProgramEvents(formatted.filter(program => program.isActive));
  });

  return () => unsubscribe();
}, []);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDayClick = (day, dayEvents = []) => {
    if (!day) return;
    setSelectedDayNumber(day);

    // إذا كانت هناك فعاليات في اليوم، اعرضها
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
      setShowDayEvents(true);
      return;
    }

    // إذا لم تكن هناك فعاليات، اعرض نموذج إضافة فعالية جديدة
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (!canAddEventOnDate(selectedDate)) {
      showMessage(CALENDAR_CONSTANTS.MESSAGES.ERROR.PAST_DATE, "error");
      return;
    }

    const defaultTime = new Date(selectedDate);
    defaultTime.setHours(9);
    const formatted = defaultTime.toISOString().slice(0, 16);

    setFormData({ title: "", time: formatted, description: "", location: "" });
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleEventClick = (event, e) => {
  e.stopPropagation();
  
  if (event.type === "center" || event.type === "program") {
    setSelectedEvent({
      id: event.id,
      title: event.title,
      date: event.start.toISOString(),
      description: event.description,
      location: event.location,
      capacity: event.capacity || "",
      price: event.price || 0,
      imageUrl: event.imageUrl || "",
      instructor: event.instructor || "",
      type: event.type
    });
    setShowDetails(true);
    return;
  }

  const formattedTime = new Date(event.start.getTime() - (event.start.getTimezoneOffset() * 60000))
    .toISOString()
    .slice(0, 16);
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

        showMessage(CALENDAR_CONSTANTS.MESSAGES.SUCCESS.EVENT_ADDED);
      } else {
       await withProgress(() =>
  addDoc(collection(db, "EventsCalender"), data)
);

        showMessage(CALENDAR_CONSTANTS.MESSAGES.SUCCESS.EVENT_UPDATED);
      }

      setDialogOpen(false);
    } catch (error) {
      showMessage(CALENDAR_CONSTANTS.MESSAGES.ERROR.SAVE_ERROR, "error");
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedEvent && selectedEvent.type === "calendar") {
       await withProgress(() =>
  deleteDoc(doc(db, "EventsCalender", selectedEvent.id))
);
        showMessage(CALENDAR_CONSTANTS.MESSAGES.SUCCESS.EVENT_DELETED);
        setDialogOpen(false);
      }
    } catch (error) {
      showMessage(CALENDAR_CONSTANTS.MESSAGES.ERROR.DELETE_ERROR, "error");
    }
  };

  // دمج الفعاليات
  const allEvents = [...events, ...centerEvents, ...programEvents];  const days = getDaysInMonth(currentDate);
  const monthName = CALENDAR_CONSTANTS.MONTH_NAMES[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <style >{`
          .calendar-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0.5rem;
          }
          
          .calendar-header {
            text-align: center;
            margin-bottom: -20px;
          }
          
          .calendar-wrapper {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            padding: 0.8rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            direction: rtl;
            overflow: hidden;
          }
          
          .calendar-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 1rem;
            margin-bottom: 0.5rem;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }
          
          .month-title {
            font-size: 1.1rem;
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
            border-radius: 6px;
            font-weight: bold;
            padding: 0.4rem 0.8rem;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .nav-button:hover {
            background: linear-gradient(45deg, #f97316, #ea580c);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
          }
          
          .calendar-grid {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 6px;
            overflow: hidden;
          }
          
          .days-header {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background: rgba(255, 255, 255, 0.95);
            border-bottom: 1px solid rgba(0,0,0,0.1);
          }
          
          .day-header {
            padding: 0.5rem 0;
            text-align: center;
            color: #374151;
            font-weight: bold;
            font-size: 0.8rem;
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
            min-height: 60px;
            padding: 0.3rem;
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
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.15);
            z-index: 1;
          }
          
          .day-cell.today {
            background: linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
          }
          
          .day-number {
            font-weight: bold;
            font-size: 0.75rem;
            color: #374151;
            margin-bottom: 0.3rem;
          }
          
          .day-number.today {
            background: linear-gradient(45deg, #ea580c, #f97316);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.7rem;
            box-shadow: 0 2px 8px rgba(234, 88, 12, 0.3);
          }
          
          .event-item {
            background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
            border: 1px solid #fdba74;
            border-right: 2px solid #ea580c;
            color: #9a3412;
            padding: 0.25rem;
            margin-bottom: 0.15rem;
            border-radius: 4px;
            font-size: 0.6rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 1px 4px rgba(234, 88, 12, 0.1);
            overflow: hidden;
            text-align: right;
          }
          
          .event-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(234, 88, 12, 0.2);
            border-color: #ea580c;
            background: linear-gradient(135deg, #fff7ed 0%, #fb923c 100%);
            color: white;
          }
          
          .event-item.center-event {
            background: linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%);
            border: 1px solid #7dd3fc;
            border-right: 2px solid #0369a1;
            color: #0c4a6e;
          }
          
          .event-item.center-event:hover {
            background: linear-gradient(135deg, #f0f9ff 0%, #38bdf8 100%);
            border-color: #0369a1;
            color: white;
          }
          
          .event-title {
            color: #1f2937;
            line-height: 1.2;
            display: block;
          }
          
          .more-events {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 0.2rem;
            margin-top: 0.15rem;
            border-radius: 4px;
            font-size: 0.55rem;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 1px 4px rgba(245, 158, 11, 0.2);
          }
          
          .more-events:hover {
            background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
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

          /* أنماط فعاليات المركز في قائمة اليوم - أزرق */
          .day-event-item.center-event {
            background: #f0f9ff;
            border-right-color: #0369a1;
            border-left-color: #7dd3fc;
            border-top-color: #7dd3fc;
            border-bottom-color: #7dd3fc;
          }

          .day-event-item.center-event:hover {
            background: #e0f2fe;
          }

          .day-event-item.center-event .event-title-day {
            color: #0c4a6e;
          }

          .day-event-item.center-event .event-desc {
            color: #0369a1;
          }

          .day-event-item.center-event .event-time {
            background: linear-gradient(45deg, #0369a1, #0284c7);
          }

          .day-event-item.center-event .event-type-badge {
            background: #f0f9ff;
            border-color: #7dd3fc;
            color: #0369a1;
          }

          /* أنماط الفعاليات الإدارية - برتقالي */
          .day-event-item.admin-event {
            background: #fff7ed;
            border-right-color: #ea580c;
            border-left-color: #fdba74;
            border-top-color: #fdba74;
            border-bottom-color: #fdba74;
          }

          .day-event-item.admin-event:hover {
            background: #fef3e2;
          }

          .day-event-item.admin-event .event-title-day {
            color: #9a3412;
          }

          .day-event-item.admin-event .event-desc {
            color: #ea580c;
          }

          .day-event-item.admin-event .event-time {
            background: linear-gradient(45deg, #ea580c, #f97316);
          }

          .day-event-item.admin-event .event-type-badge {
            background: #fff7ed;
            border-color: #fdba74;
            color: #ea580c;
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

          .event-details {
            display: flex;
            flex-direction: column;
            gap: 0.7rem;
          }
          
          /* الأنماط الافتراضية (للفعاليات الإدارية - برتقالي) */
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

          /* الأنماط لفعاليات المركز - أزرق */
          .event-details.center-event .event-detail-item {
            background: #f0f9ff;
            border-right-color: #0369a1;
            border-left-color: #7dd3fc;
            border-top-color: #7dd3fc;
            border-bottom-color: #7dd3fc;
          }

          .event-details.center-event .event-detail-label {
            color: #0369a1;
          }

          .event-details.center-event .event-detail-value {
            color: #0c4a6e;
          }

          /* Media Queries للهواتف والتابلت */
          @media (max-width: 768px) {
            .calendar-container {
              padding: 0.3rem;
            }
            
            .calendar-wrapper {
              padding: 0.5rem;
              border-radius: 8px;
            }
            
            .calendar-navigation {
              padding: 0.4rem 0.6rem;
              margin-bottom: 0.3rem;
            }
            
            .month-title {
              font-size: 1rem;
            }
            
            .nav-button {
              padding: 0.3rem 0.6rem;
              font-size: 0.7rem;
            }
            
            .day-header {
              padding: 0.4rem 0;
              font-size: 0.7rem;
            }
            
            .day-cell {
              min-height: 50px;
              padding: 0.2rem;
            }
            
            .day-number {
              font-size: 0.65rem;
              margin-bottom: 0.2rem;
            }
            
            .day-number.today {
              width: 18px;
              height: 18px;
              font-size: 0.6rem;
            }
            
            .event-item {
              font-size: 0.55rem;
              padding: 0.2rem;
              margin-bottom: 0.1rem;
              border-radius: 3px;
              border-right-width: 2px;
            }
            
            .event-title {
              line-height: 1.1;
            }
            
            .more-events {
              font-size: 0.5rem;
              padding: 0.15rem;
            }
          }
          
          @media (max-width: 480px) {
            .calendar-container {
              padding: 0.2rem;
            }
            
            .calendar-wrapper {
              padding: 0.4rem;
            }
            
            .calendar-navigation {
              padding: 0.3rem 0.5rem;
            }
            
            .month-title {
              font-size: 0.9rem;
            }
            
            .nav-button {
              padding: 0.25rem 0.5rem;
              font-size: 0.65rem;
            }
            
            .day-header {
              padding: 0.3rem 0;
              font-size: 0.65rem;
            }
            
            .day-cell {
              min-height: 45px;
              padding: 0.15rem;
            }
            
            .day-number {
              font-size: 0.6rem;
              margin-bottom: 0.15rem;
            }
            
            .day-number.today {
              width: 16px;
              height: 16px;
              font-size: 0.55rem;
            }
            
            .event-item {
              font-size: 0.5rem;
              padding: 0.15rem;
              margin-bottom: 0.08rem;
              border-radius: 2px;
              border-right-width: 1px;
            }
            
            .event-title {
              line-height: 1;
            }
            
            .more-events {
              font-size: 0.45rem;
              padding: 0.1rem;
            }
          }
            .event-item.program-event {
  background: linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%);
  border: 1px solid #86efac;
  border-right: 2px solid #16a34a;
  color: #15803d;
}

.event-item.program-event:hover {
  background: linear-gradient(135deg, #f0fdf4 0%, #4ade80 100%);
  border-color: #16a34a;
  color: white;
}

/* أنماط الدورات في قائمة اليوم - أخضر */
.day-event-item.program-event {
  background: #f0fdf4;
  border-right-color: #16a34a;
  border-left-color: #86efac;
  border-top-color: #86efac;
  border-bottom-color: #86efac;
}

.day-event-item.program-event:hover {
  background: #dcfce7;
}

.day-event-item.program-event .event-title-day {
  color: #15803d;
}

.day-event-item.program-event .event-desc {
  color: #16a34a;
}

.day-event-item.program-event .event-time {
  background: linear-gradient(45deg, #16a34a, #22c55e);
}

.day-event-item.program-event .event-type-badge {
  background: #f0fdf4;
  border-color: #86efac;
  color: #16a34a;
}

/* الأنماط لتفاصيل الدورات - أخضر */
.event-details.program-event .event-detail-item {
  background: #f0fdf4;
  border-right-color: #16a34a;
  border-left-color: #86efac;
  border-top-color: #86efac;
  border-bottom-color: #86efac;
}

.event-details.program-event .event-detail-label {
  color: #16a34a;
}

.event-details.program-event .event-detail-value {
  color: #15803d;
}
        `}</style>
        
        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <Box sx={{ mt: { xs: 4, md: 4 }, px: { xs: 2, md: 30 } }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              mb={2}
              sx={{ color: '#003366' }}
            >
              التقويم - لوحة الإدارة
            </Typography>
          </Box>

          <div className="calendar-container">
            <div className="calendar-header"></div>

            <div className="calendar-wrapper">
              <div className="calendar-navigation">
                <button className="nav-button" onClick={() => navigateMonth(-1)}>
                  السابق
                </button>
                
                <div className="month-title">
                  {monthName} {year}
                </div>
                
                <button className="nav-button" onClick={() => navigateMonth(1)}>
                  التالي
                </button>
              </div>

              <div className="calendar-grid">
                <div className="days-header">
                  {CALENDAR_CONSTANTS.DAY_NAMES.map((dayName) => (
                    <div key={dayName} className="day-header">
                      {dayName}
                    </div>
                  ))}
                </div>

                <div className="days-grid">
                  {days.map((day, index) => {
                    const dayEvents = getEventsForDay(day, currentDate, allEvents);
                    const todayClass = isToday(day, currentDate) ? 'today' : '';
                     // ترتيب الفعاليات لعرض الدورات أولاً، ثم center، ثم calendar
const sortedDayEvents = [...dayEvents].sort((a, b) => {
  if (a.type === 'program' && b.type !== 'program') return -1;
  if (a.type !== 'program' && b.type === 'program') return 1;
  if (a.type === 'center' && b.type !== 'center' && b.type !== 'program') return -1;
  if (a.type !== 'center' && b.type === 'center' && a.type !== 'program') return 1;
  return new Date(a.start) - new Date(b.start);
});
                    const visibleEvents = sortedDayEvents.slice(0, CALENDAR_CONSTANTS.MAX_VISIBLE_EVENTS);
                    const remainingEvents = sortedDayEvents.length - CALENDAR_CONSTANTS.MAX_VISIBLE_EVENTS;

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
className={`event-item ${
  event.type === 'program' ? 'program-event' : 
  event.type === 'center' ? 'center-event' : ''
}`}                                onClick={(e) => handleEventClick(event, e)}
                              >
                                <span className="event-title">{event.title}</span>
                              </div>
                            ))}
                            
                            {/* عرض عدد الفعاليات الإضافية */}
                            {remainingEvents > 0 && (
                              <div className="more-events">
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
              <RTLTextField 
                label="عنوان الفعالية" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                fullWidth 
              />
              <RTLTextField
                label="تاريخ ووقت الفعالية"
                type="datetime-local"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 900 }}
              />
              <RTLTextField 
                label="الوصف" 
                multiline 
                rows={3} 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                fullWidth 
              />
              <RTLTextField 
                label="الموقع" 
                value={formData.location} 
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                fullWidth 
              />
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px' }}>
              {selectedEvent && selectedEvent.type === "calendar" && (
                <Button 
                  onClick={() => setDeleteDialog({ open: true })} 
                  color="error"
                  variant="outlined"
                >
                  حذف
                </Button>
              )}
              <Button onClick={() => setDialogOpen(false)}>
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
  {[...selectedDayEvents]
  .sort((a, b) => {
    // Programs أولاً، ثم center، ثم calendar
    if (a.type === 'program' && b.type !== 'program') return -1;
    if (a.type !== 'program' && b.type === 'program') return 1;
    if (a.type === 'center' && b.type !== 'center' && b.type !== 'program') return -1;
    if (a.type !== 'center' && b.type === 'center' && a.type !== 'program') return 1;
    return new Date(a.start) - new Date(b.start);
  })
    .map((event) => (
      <div
        key={`${event.type}-${event.id}`}
className={`day-event-item ${
  event.type === 'program' ? 'program-event' : 
  event.type === 'center' ? 'center-event' : 
  'admin-event'
}`}        onClick={() => {
          setShowDayEvents(false);
          handleEventClick(event, { stopPropagation: () => {} });
        }}
      >
        <div className="event-time">
          {event.start.toLocaleTimeString("en-GB", {
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
  {event.type === 'program' ? '📚' : event.type === 'center' ? '📋' : '📅'}
        </div>
      </div>
    ))
  }
</div>

<Button
  fullWidth
  variant="contained"
  sx={{
    background: 'linear-gradient(45deg, #ea580c, #f97316)',
    mt: 2,
    fontWeight: 'bold',
    fontSize: '1rem'
  }}
  onClick={() => {
    // تجهيز التاريخ: الشهر الحالي + اليوم المختار + ساعة 9 صباحاً
    const eventDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDayNumber, 9, 0);
    const formatted = eventDate.toISOString().slice(0, 16);
    setFormData({ title: "", time: formatted, description: "", location: "" });
    setSelectedEvent(null);
    setShowDayEvents(false);
    setDialogOpen(true);
  }}
>
  + إضافة
</Button>


              </div>
            </div>
          )}

          {/* Modal لعرض تفاصيل فعالية واحدة */}
          {showDetails && (
            <div className="modal-overlay" onClick={() => setShowDetails(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">
  {selectedEvent?.type === 'program' ? '📚 تفاصيل الدورة' :
   selectedEvent?.type === 'center' ? '📋 تفاصيل الفعالية' :
   '📅 تفاصيل الحدث'}
</h2>
                  <button 
                    className="close-button"
                    onClick={() => setShowDetails(false)}
                  >
                    ✕
                  </button>
                </div>

<div className={`event-details ${
  selectedEvent?.type === 'program' ? 'program-event' : 
  selectedEvent?.type === 'center' ? 'center-event' : 
  'admin-event'
}`}>
  
  {/* للدورات - عرض مبسط */}
  {selectedEvent?.type === 'program' ? (
    <>
      <div className="event-detail-item">
        <div className="event-detail-label">📌 العنوان:</div>
        <div className="event-detail-value">{selectedEvent?.title || "—"}</div>
      </div>
      
      <div className="event-detail-item">
        <div className="event-detail-label">🕐 الوقت:</div>
        <div className="event-detail-value">
          {selectedEvent?.date ? (
            <>
              {new Date(selectedEvent.date).toLocaleDateString("ar-EG", {
                weekday: "long"
              })}
              <span style={{ margin: "0 14px" }}></span>
              {new Date(selectedEvent.date).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })}
            </>
          ) : "—"}
        </div>
      </div>
      
      {selectedEvent?.instructor && (
        <div className="event-detail-item">
          <div className="event-detail-label">👨‍🏫 المدرب:</div>
          <div className="event-detail-value">{selectedEvent.instructor}</div>
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
    </>
  ) : (
    /* للفعاليات الأخرى - عرض كامل */
    <>
      <div className="event-detail-item">
        <div className="event-detail-label">📌 العنوان:</div>
        <div className="event-detail-value">{selectedEvent?.title || "—"}</div>
      </div>
      
      <div className="event-detail-item">
        <div className="event-detail-label">📅 التاريخ:</div>
        <div className="event-detail-value">
          {selectedEvent?.date ? (
            <>
              {new Date(selectedEvent.date).toLocaleDateString("ar-EG", {
                weekday: "long"
              })}
              <span style={{ margin: "0 14px" }}></span>
              {new Date(selectedEvent.date).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })}
            </>
          ) : "—"}
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

      {/* عرض السعة والسعر إذا كانت الفعالية من نوع center */}
      {selectedEvent?.type === 'center' && (
        <>
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
        </>
      )}
    </>
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

          <ConfirmDeleteDialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false })}
            onConfirm={async () => {
              await handleDelete();
              setDeleteDialog({ open: false });
            }}
            message="هل أنت متأكد أنك تريد حذف هذه الفعالية؟"
          />
        </Container>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}