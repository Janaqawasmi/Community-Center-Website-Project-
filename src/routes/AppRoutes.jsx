// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import SectionPage from '../pages/SectionPage';
import HomePage from '../pages/HomePage';

function AppRoutes({ sections }) {
  return (
    <Routes>
      <Route path="/" element={<HomePage sections={sections} />} />
      <Route path="/section/:id" element={<SectionPage />} />
      {/* Add more routes here */}
    </Routes>
  );
}

export default AppRoutes;
