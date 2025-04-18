import { Routes, Route } from 'react-router-dom';
import Layout from '../Layout'; // Import the layout
import HomePage from '../pages/HomePage';
import SectionPage from '../pages/SectionPage';
import Contact from '../pages/Contact';


function AppRoutes({ sections }) {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage sections={sections} />} />
        <Route path="/sections/:id" element={<SectionPage />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
