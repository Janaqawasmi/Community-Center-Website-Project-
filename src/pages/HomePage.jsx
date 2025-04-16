// src/pages/HomePage.jsx
import logo from '../assets/logo.png';
import headerImage from '../assets/headerPic.jpg';
import { iconMap, sectionColors } from '../constants/sectionMeta';
import './HomePage.css';

import {
  FaSearch,
  FaUser,
  FaUniversalAccess,
  FaStar
} from 'react-icons/fa';

function HomePage({ sections }) {
  return (
    <div className="main-page">
      <div className="floating-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* ✅ Start scalable layout */}
      <div className="page-container">
        <div className="nav-icons">
          <FaSearch className="nav-icon" title="بحث" />
          <FaUser className="nav-icon" title="تسجيل الدخول" />
          <FaUniversalAccess className="nav-icon" title="إمكانية الوصول" />
        </div>

        {/* Hero section */}
        <div className="hero-section" style={{ backgroundImage: `url(${headerImage})` }}>
          <div className="hero-overlay">
            <h1>مرحباً بكم في المركز الجماهيري بيت حنينا</h1>
            <p>نُقدم خدماتنا المجتمعية لجميع الفئات والأجيال</p>
          </div>
        </div>

        {/* Sections */}
        <h2 className="sections-title">الأقسام</h2>
        <div className="sections-grid">
          {sections.map((section) => (
            <div
              key={section.id}
              className="section-circle"
              style={{ backgroundColor: sectionColors[section.id] || '#ccc' }}
            >
              <div className="icon">
                {iconMap[section.id] || <FaStar />}
              </div>
              <div className="label">{section.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
