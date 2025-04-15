import { useState, useEffect } from 'react';
import './App.css';
import { db } from './components/firebase';
import { collection, getDocs } from 'firebase/firestore';
import logo from './logo_final.png'; // make sure the image is in your src folder

function App() {
  const [sections, setSections] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'sections'));
        const sectionList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSections(sectionList);
      } catch (error) {
        console.error("❌ Error fetching sections:", error);
      }
    };

    fetchSections();
  }, []);

  return (
    <div className="App">

      {/* 🔹 الشعار في الزاوية اليمنى العليا */}
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* 🔹 شريط التنقل */}
      <nav className="main-nav">
        <div className="nav-links">
          <div
            className="nav-item"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="nav-button">الأقسام</button>
            {showDropdown && (
              <div className="dropdown">
                {sections.map(section => (
                  <div key={section.id} className="dropdown-item">
                    {section.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="nav-button">من نحن</button>
          <button className="nav-button">اتصل بنا</button>
          <button className="nav-button">الدورات والبرامج</button>
        </div>
      </nav>

    </div>
  );
}

export default App;
