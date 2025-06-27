import React, { useEffect, useState } from "react";
import { db, auth } from "../components/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from 'react-router-dom'; // at the top
import { Typography,Box } from '@mui/material';
import RegistrationForm from '../pages/registration';


export default function CalendarSection() {
  const [events, setEvents] = useState([]);
  const [centerEvents, setCenterEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showDayEvents, setShowDayEvents] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [currentDate, setCurrentDate] = useState(new Date());
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;


 

  // جلب فعاليات التقويم (EventsCalender)
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

  // جلب فعاليات المركز (Events)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Events"), (snapshot) => {
      const formatted = snapshot.docs.map((doc) => {
        const data = doc.data();
        
        let eventDate = new Date();
        
        try {
          if (typeof data.date === 'string' && data.date.includes('-')) {
            if (data.time && typeof data.time === 'string') {
              const dateTimeString = `${data.date}T${data.time}:00`;
              eventDate = new Date(dateTimeString);
            } else {
              eventDate = new Date(data.date + 'T09:00:00');
            }
          }
          else if (data.date && typeof data.date === 'object' && data.date.toDate) {
            eventDate = data.date.toDate();
            if (data.time && typeof data.time === 'string') {
              const [hours, minutes] = data.time.split(':');
              eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            }
          }
          else if (data.date) {
            eventDate = new Date(data.date);
          }
          
          if (isNaN(eventDate.getTime())) {
            eventDate = new Date();
          }
          
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
          price: data.price || 0,
          imageUrl: data.imageUrl || "",
          isActive: data.isActive !== false,
          type: "center"
        };
      });
      
      setCenterEvents(formatted.filter(event => event.isActive));
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL?.toLowerCase();

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
    if (!day || dayEvents.length === 0) return;
    
    setSelectedDayEvents(dayEvents);
    setShowDayEvents(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent({
      id: event.id,
      title: event.title,
      date: event.start.toISOString(),
      description: event.description,
      location: event.location,
      price: event.price || 0,
      imageUrl: event.imageUrl || "",
      type: event.type
    });
    setShowDetails(true);
  };

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];


  const navigate = useNavigate(); // inside the component
  // دالة للتعامل مع التسجيل للفعالية
const handleRegisterForEvent = (eventTitle) => {
  try {
    console.log("Event title:", eventTitle);
    // ✅ غيّر من /registration إلى /RegistrationForm
    const registrationUrl = `/RegistrationForm?eventId=${encodeURIComponent(selectedEvent.id)}&event=${encodeURIComponent(selectedEvent.name)}`;
    console.log("Navigation URL:", registrationUrl);
    navigate(registrationUrl);
  } catch (error) {
    console.error("خطأ في التنقل:", error);
    alert("حدث خطأ في فتح صفحة التسجيل");
  }
};

  if (loading) {
    return (
      <div className="loading-container">
        <style >{`
          .loading-container {
            padding: 1rem;
            text-align: center;
          }
        `}</style>
        <h3>جاري التحميل...</h3>
      </div>
    );
  }

  return (
    <>
    
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
          padding: 0.6rem;
          width: 90%;
          max-width: 380px;
          max-height: 85vh;
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
        
        .event-type-badge.center {
          background: #fff7ed;
          border-color: #fdba74;
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

.event-registration-section {
  margin-top: 0.5rem;
  padding-top: 0.3rem;
  border-top: 1px solid #f1f5f9;
  text-align: center;
}

.event-registration-section.center-event {
  border-top: 1px solid #e0f2fe;
}

.register-event-button {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.register-event-button:hover {
  background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 58, 138, 0.4);
}

.register-event-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(30, 58, 138, 0.3);
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
      `}</style>
<Box sx={{ mt: { xs: 4, md: 4 }, px: { xs: 2, md: 30 } }}>

      <Typography
  variant="h4"
  fontWeight="bold"
  textAlign="center"
  mb={2}
  sx={{ color: '#003366' }}
>
  التقويم والفعاليات
</Typography>
         </Box>

      <div id="calendar-section" className="calendar-container">
        <div className="calendar-header"></div>

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
                const maxVisibleEvents = 1;
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
                        
                        {visibleEvents.map((event) => (
                          <div
                            key={`${event.type}-${event.id}`}
                            className={`event-item ${event.type === 'center' ? 'center-event' : ''}`}
                            onClick={(e) => handleEventClick(event, e)}
                          >
                            <span className="event-title">{event.title}</span>
                          </div>
                        ))}
                        
                        {remainingEvents > 0 && (
                          <div className="more-events">
                            +{remainingEvents} أخرى
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

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
                    className={`day-event-item ${event.type === 'center' ? 'center-event' : 'admin-event'}`}
                    onClick={() => {
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
                      {event.type === 'center' ? '📋' : '📅'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Modal لعرض تفاصيل فعالية واحدة */}
{showDetails && (
  <div className="modal-overlay" onClick={() => setShowDetails(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title">
          {selectedEvent?.type === 'center'  
           ? <>تفاصيل فعالية المركز</>
           : <>تفاصيل فعالية إدارية</>
        } 
        </h2>
        <button 
          className="close-button"
          onClick={() => setShowDetails(false)}
        >
          ✕
        </button>
      </div>

      <div className={`event-details ${selectedEvent?.type === 'center' ? 'center-event' : 'admin-event'}`}>
        <div className="event-detail-item">
          <div className="event-detail-label">📌 العنوان:</div>
          <div className="event-detail-value">{selectedEvent?.title || "—"}</div>
        </div>
        <div className="event-detail-item">
  <div className="event-detail-label">📅 التاريخ:</div>
  <div className="event-detail-value">
    {selectedEvent?.date ? (
      <>
        {/* اليوم بالعربي */}
        <span>
          {new Date(selectedEvent.date).toLocaleDateString("ar-EG", { weekday: "long" })}
        </span>
        {/* الساعة بالإنجليزي مع فراغ مناسب */}
        <span style={{ margin: "0 14px" }}>
          {new Date(selectedEvent.date).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
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
      </div>

      {/* زر التسجيل للفعالية - يظهر فقط لفعاليات المركز */}
      {selectedEvent?.type === 'center' && (
        <div className="event-registration-section center-event">
          <button
            className="register-event-button"
            onClick={() => {
              setShowDetails(false);
              handleRegisterForEvent(selectedEvent?.id, selectedEvent?.title); 
            }}
          >
             سجل الآن للفعالية
          </button>
        </div>
      )}
    </div>
  </div>
)}
      </div>

    </>
  );
}