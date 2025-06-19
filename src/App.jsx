import { useEffect, useState } from 'react';

import { fetchSections } from './utils/fetchSections';
import AppRoutes from './routes/AppRoutes';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css'; 
import './index.css';
import Footer from './components/Footer/Footer';

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

    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <AppRoutes sections={sections} />
      </div>
      <Footer sectionId="section_general" />
    </div>
    );
}

export default App;
