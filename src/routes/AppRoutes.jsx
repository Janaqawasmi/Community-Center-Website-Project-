// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import SectionPage from '../pages/SectionPage';

function AppRoutes({ sections }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ padding: '2rem' }}>
            <h2>الأقسام</h2>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`/section/${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ul>
          </div>
        }
      />
      <Route path="/section/:id" element={<SectionPage />} />
    </Routes>
  );
}

export default AppRoutes;
