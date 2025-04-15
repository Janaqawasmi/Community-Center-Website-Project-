import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './components/firebase';
import './App.css';
import logo from './logo_final.png'; 

import {
  FaFemale,
  FaUsers,
  FaChild,
  FaBaby,
  FaHandsHelping,
  FaHeartbeat,
  FaRunning,
  FaBook,
  FaChalkboardTeacher,
  FaStar,
  FaTools,
  FaHandHoldingHeart,
  FaSearch,
  FaUser,
  FaUniversalAccess
} from 'react-icons/fa';

function App() {
  const [sections, setSections] = useState([]);

  const iconMap = {
    section_women: <FaFemale />,
    section_youth: <FaUsers />,
    section_kindergarten: <FaChild />,
    section_nursery: <FaBaby />,
    section_elderly: <FaHandsHelping />,
    section_special: <FaHeartbeat />,
    section_sports: <FaRunning />,
    section_culture: <FaBook />,
    section_curricular: <FaChalkboardTeacher />,
    section_community_work: <FaStar />,
    section_engineering: <FaTools />,
    section_attaa: <FaHandHoldingHeart />
  };

  const colors = [
    "#fbc21f", // قسم المسنين
    "#f26d2c", // قسم النساء
    "#cf2929", // قسم الشبيبة
    "#68a144", // قسم الاحتياجات الخاصة (أبيض تقريباً)
    "#2baadc"  // قسم رياض الأطفال
  ];
    
  useEffect(() => {
    const fetchSections = async () => {
      const snapshot = await getDocs(collection(db, 'sections'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSections(data);
    };
    fetchSections();
  }, []);

  return (
    
    <div className="main-page">
<div className="floating-logo">
  <img src={logo} alt="Logo" />
</div>

     <nav className="navbar">
  <div className="nav-logo"></div>

  <div className="nav-links">
    <a href="#">الرئيسية</a>
    <a href="#">عن المركز</a>
    <a href="#">الدورات</a>
    <a href="#">تواصل معنا</a>
  </div>

  <div className="nav-icons">
    <FaSearch className="nav-icon" title="بحث" />
    <FaUser className="nav-icon" title="تسجيل الدخول" />
    <FaUniversalAccess className="nav-icon" title="إمكانية الوصول" />
  </div>
</nav>


      {/* الهيدر */}
      <div className="hero-section">
        <h1>مرحباً بكم في المركز الجماهيري بيت حنينا</h1>
        <p>نُقدم خدماتنا المجتمعية لجميع الفئات والأجيال</p>
      </div>

      {/* الأقسام */}
      <h2 className="sections-title">الأقسام</h2>
      <div className="sections-grid">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="section-circle"
            style={{ backgroundColor: colors[index % colors.length] }}
          >
            <div className="icon">
              {iconMap[section.id] || <FaStar />}
            </div>
            <div className="label">
              {section.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
