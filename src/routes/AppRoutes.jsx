import { Routes, Route } from 'react-router-dom';
import Layout from '../Layout'; // Import the layout
import HomePage from '../pages/HomePage';
import SectionPage from '../pages/SectionPage';
import Contact from '../pages/Contact';
import Registration from '../pages/registration';


function AppRoutes({ sections }) {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage sections={sections} />} />
        <Route path="/sections/:id" element={<SectionPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/registration" element={<Registration />} />

      </Route>
    </Routes>
  );
}

export default AppRoutes;
