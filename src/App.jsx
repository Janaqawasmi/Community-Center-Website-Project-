// src/App.jsx
import { useEffect, useState } from 'react';

import { fetchSections } from './utils/fetchSections';
import AppRoutes from './routes/AppRoutes';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//import './App.css'; 
import './index.css';

function App() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const list = await fetchSections();
        setSections(list);
      } catch (e) {
        console.error('Failed to fetch sections:', e);
      }
      
    };
    loadSections();
  }, []);

  return (
      <div className="App">
        <AppRoutes sections={sections} />
      </div>
    );
}

export default App;


