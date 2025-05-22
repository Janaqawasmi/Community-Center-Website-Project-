import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '../Layout';
import HomePage from '../pages/HomePage';
import SectionPage from '../pages/SectionPage';
import Contact from '../pages/Contact';
import ScrollToTop from '../components/ScrollToTop'; 
import About from '../pages/About';
import RegistrationForm from '../pages/registration';
import ProgramCategoryPage from '../pages/ProgramCategoryPage';
import ProgramePage from '../pages/ProgramsSection';
import AdminInquiries from '../pages/AdminInquiries';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import AdminCalendar from '../pages/AdminCalendar';






function AppRoutes({ sections }) {
  const location = useLocation();

  return (
    <>
      <ScrollToTop /> {/* ✅ Global scroll-to-top on route change */}
      <Routes location={location}>
      <Route element={<Layout sections={sections} />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/sections/:id" element={<SectionPage />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/about" element={<About />} />
  <Route path="/RegistrationForm" element={<RegistrationForm />} />
  <Route path="/programs/:categoryName" element={<ProgramCategoryPage />} />
  <Route path="/programs" element={<ProgramePage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/calendar" element={<AdminCalendar />} />

  



</Route>

      </Routes>
    </>
  );
}

export default AppRoutes;
