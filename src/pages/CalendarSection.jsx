import React, { useEffect, useState } from "react";
import { db, auth } from "../components/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function CalendarSection() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [currentDate, setCurrentDate] = useState(new Date());
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

  // أسماء الشهور بالعربية
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // أسماء الأيام بالعربية
  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  if (loading) {
    return (
      <div className="loading-container">
        <style jsx={"true"}>{`
          .loading-container {
            padding: 2rem;
            text-align: center;
            font-family: 'Cairo', sans-serif;
          }
        `}</style>
        <h3>جاري التحميل...</h3>
      </div>
    );
  }

  return (
    <>
      <style jsx={"true"}>{`
        .calendar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem;
          font-family: 'Cairo', sans-serif;
        }
        
        .calendar-header {
          text-align: center;
          margin-bottom: -40px;
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
        }
        
        .event-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
          border-color: #ea580c;
          background: linear-gradient(135deg, #fff7ed 0%, #fb923c 100%);
          color: white;
        }
        
        .event-title {
          color: #1f2937;
          line-height: 1.3;
          display: block;
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
        }
        
        .modal-content {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 20px;
          padding: 2rem;
          min-width: 450px;
          max-width: 550px;
          box-shadow: 0 25px 80px rgba(3, 105, 161, 0.25);
          position: relative;
          font-family: 'Cairo', sans-serif;
          border: 1px solid rgba(3, 105, 161, 0.1);
        }
        
        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }
        
        .modal-title {
          font-size: 1.8rem;
          font-weight: bold;
          background: linear-gradient(45deg, #0369a1, #0284c7);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .close-button {
          position: absolute;
          right: 1rem;
          top: -0.5rem;
          background: rgba(3, 105, 161, 0.1);
          border: none;
          border-radius: 50%;
          width: 2.8rem;
          height: 2.8rem;
          font-size: 1.3rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: #0369a1;
          font-weight: bold;
        }
        
        .close-button:hover {
          background: rgba(3, 105, 161, 0.2);
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(3, 105, 161, 0.3);
        }
        
        .event-details {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        
        .event-detail-item {
          padding: 1.2rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          border-right: 4px solid #0369a1;
          box-shadow: 0 4px 15px rgba(3, 105, 161, 0.1);
          transition: all 0.3s ease;
          border-left: 1px solid rgba(3, 105, 161, 0.1);
          border-top: 1px solid rgba(3, 105, 161, 0.1);
          border-bottom: 1px solid rgba(3, 105, 161, 0.1);
        }
        
        .event-detail-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(3, 105, 161, 0.15);
        }
        
        .event-detail-label {
          font-weight: bold;
          color: #0369a1;
          margin-bottom: 0.5rem;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .event-detail-value {
          color: #1e293b;
          line-height: 1.6;
          font-size: 0.95rem;
          margin-right: 1.5rem;
          font-weight: 500;
        }
      `}</style>
      
      <div className="calendar-container">
        {/* Header */}
        <div className="calendar-header">
          
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
                  >
                    {day && (
                      <>
                        <div className={`day-number ${todayClass}`}>
                          {day}
                        </div>
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="event-item"
                            onClick={() => {
                              setSelectedEvent({
                                id: event.id,
                                title: event.title,
                                date: event.start.toISOString(),
                                description: event.description,
                                location: event.location
                              });
                              setShowDetails(true);
                            }}
                          >
                            <span className="event-title">{event.title}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showDetails && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title"> تفاصيل الفعالية</h2>
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
                  <div className="event-detail-label">📅 التاريخ:</div>
                  <div className="event-detail-value">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}