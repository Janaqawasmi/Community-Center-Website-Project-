import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '../Layout';
import HomePage from '../pages/HomePage';
import SectionPage from '../pages/SectionPage';
import Contact from '../pages/Contact';
import ScrollToTop from '../components/ScrollToTop'; 
import About from '../pages/About';
import RegistrationForm from '../pages/registration';
import ProgramCategoryPage from '../pages/programs/ProgramCategoryPage';
import ProgramePage from '../pages/ProgramsSection';
import EventsPage from '../pages/EventsPage';
import NewsPage from '../pages/NewsPage';
import AdminDashboard from "../pages/AdminDashboard";
import AdminSectionEditor from "../pages/AdminSectionEditor";


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
  <Route path="/events" element={<EventsPage />} />
  <Route path="/news" element={<NewsPage />} />
   <Route path="/admin" element={<AdminDashboard />} />

</Route>

      </Routes>
    </>
  );
}

export default AppRoutes;
