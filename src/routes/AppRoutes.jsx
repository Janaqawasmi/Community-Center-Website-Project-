import { Routes, Route } from 'react-router-dom';
import Layout from '../Layout'; // Import the layout
import HomePage from '../pages/HomePage';
import SectionPage from '../pages/SectionPage';

function AppRoutes({ sections }) {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage sections={sections} />} />
        <Route path="/sections/:id" element={<SectionPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
