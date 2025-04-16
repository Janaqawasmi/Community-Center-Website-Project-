// src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Link } from 'react-router-dom';

import { fetchSections } from './utils/fetchSections';
import AppRoutes from './routes/AppRoutes';

import {
  FaSearch,
  FaUser,
  FaUniversalAccess
} from 'react-icons/fa';

function App() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const loadSections = async () => {
      const list = await fetchSections();
      setSections(list);
    };
    loadSections();
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-logo"></div>
          <div className="nav-links">
            <Link to="/">الرئيسية</Link>
            <Link to="/about">عن المركز</Link>
            <Link to="/contact">تواصل معنا</Link>
          </div>
          <div className="nav-icons">
            <FaSearch className="nav-icon" title="بحث" />
            <FaUser className="nav-icon" title="تسجيل الدخول" />
            <FaUniversalAccess className="nav-icon" title="إمكانية الوصول" />
          </div>
        </nav>

        {/* Routes */}
        <AppRoutes sections={sections} />
      </div>
    </Router>
  );
}

export default App;
