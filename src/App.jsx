import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './components/firebase';
import './App.css';
import logo from './logo_final.png'; 
import headerImage from './assets/headerPic.jpg';

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

 
  const sectionColors = {
    section_women: "#fbc21f",//اصفر
    section_youth: "#fbc21f",//اصفر
    section_engineering: "#fbc21f", //اصفر
    section_kindergarten: "#68a144", //اخضر
    section_community_work: "#68a144", //اخضر
    section_attaa: "#68a144", //اخضر
    section_nursery: "#2baadc", //ازرق
    section_culture: "#2baadc", //ازرق
    section_special: "#f26d2c", //برتقالي 
    section_curricular: "#f26d2c", //برتقالي 
    section_sports: "#cf2929", //احمر
    section_elderly: "#cf2929", //احمر

  };
  
    
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
      <div className="hero-section" style={{ backgroundImage: `url(${headerImage})` }}>
  <div className="hero-overlay">
    <h1>مرحباً بكم في المركز الجماهيري بيت حنينا</h1>
    <p>نُقدم خدماتنا المجتمعية لجميع الفئات والأجيال</p>
  </div>
</div>


      {/* الأقسام */}
      <h2 className="sections-title">الأقسام</h2>
      <div className="sections-grid">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="section-circle"
            style={{ backgroundColor: sectionColors[section.id] || '#ccc' }}
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
