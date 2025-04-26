// HomePage.jsx
import { Link } from 'react-router-dom';
import './HomePage.css';

import headerImage from '../assets/headerPic.jpg';

import { iconMap, sectionColors } from '../constants/sectionMeta';
import { FaStar } from 'react-icons/fa';

function HomePage({ sections }) {
  if (!sections || sections.length === 0) {
    return <p style={{ textAlign: 'center' }}>جاري تحميل الأقسام...</p>;
  }

  return (
    <div className="main-page">
      {/* Hero section */}    
      <div className="hero-wrapper">
  <div className="hero-text">
    <h1>مرحبًا بكم في مركز جماهيري بيت حنينا</h1>
  </div>
  <div
    className="hero-section"
    style={{ backgroundImage: `url(${headerImage})` }}
  ></div>
</div>


      {/* Sections */}
      <h2 className="sections-title">الأقسام</h2>
      <div className="sections-grid">
        {sections.map((section) => (
          <Link
            to={`/sections/${section.id}`}
            key={section.id}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="section-circle"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div
                className="icon-circle"
                style={{ backgroundColor: sectionColors[section.id] || '#ccc' }}
              >
                {iconMap[section.id] || <FaStar />}
              </div>
              <div className="label">{section.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
