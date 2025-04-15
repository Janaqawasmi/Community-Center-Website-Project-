// src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';
import { db } from './components/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SectionPage from './pages/SectionPage';

function App() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sectionsSnapshot = await getDocs(collection(db, 'sections'));
      const sectionsList = sectionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSections(sectionsList);
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav style={{ padding: '1rem', background: '#eee', display: 'flex', gap: '1rem' }}>
          <Link to="/">الرئيسية</Link>
          <Link to="/about">عن المركز</Link>
          <Link to="/contact">تواصل معنا</Link>
        </nav>

        {/* Section List */}
        <Routes>
          <Route path="/" element={
            <div style={{ padding: '2rem' }}>
              <h2>الأقسام</h2>
              <ul>
                {sections.map((section) => (
                  <li key={section.id}>
                    <Link to={`/section/${section.id}`}>{section.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          } />

          <Route path="/section/:id" element={<SectionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
