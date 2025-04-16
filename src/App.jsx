// src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Link } from 'react-router-dom';

import { fetchSections } from './utils/fetchSections';
import AppRoutes from './routes/AppRoutes'; // ✅ import routes separately

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
        <nav style={{ padding: '1rem', background: '#eee', display: 'flex', gap: '1rem' }}>
          <Link to="/">الرئيسية</Link>
          <Link to="/about">عن المركز</Link>
          <Link to="/contact">تواصل معنا</Link>
        </nav>

        {/* Routes */}
        <AppRoutes sections={sections} />
      </div>
    </Router>
  );
}

export default App;
