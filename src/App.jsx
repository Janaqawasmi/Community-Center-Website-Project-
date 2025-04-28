// src/App.jsx
import { useEffect, useState } from 'react';

import { fetchSections } from './utils/fetchSections';
import AppRoutes from './routes/AppRoutes';

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


