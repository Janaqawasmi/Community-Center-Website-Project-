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
import EventsPage from '../pages/programs/EventsPage';
import News from '../pages/News';
import NewsDetail from '../pages/NewsDetail';

import AdminInquiries from '../pages/admin/AdminInquiries';
import Login from '../pages/Login';
import ProtectedAdminRoute from './ProtectedAdminRoute'; // ✅ NEW
import AdminPrograms from '../pages/admin/AdminPrograms';
import AdminWelcome from '../pages/admin/AdminWelcome'; // ✅ FIXED
import AdminNews from '../pages/admin/AdminNews';
import AdminSections from '../pages/admin/AdminSections';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminCalendar from '../pages/admin/AdminCalendar';

function AppRoutes({ sections }) {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
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
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/login" element={<Login />} />

        </Route>
     
     
          {/* ✅ PROTECTED ADMIN ROUTE */}
          {/* Admin routes */}
<Route
  path="/admin"
  element={
    <ProtectedAdminRoute>
      <AdminWelcome />
    </ProtectedAdminRoute>
  }
/>


<Route
  path="/admin/programs"
  element={
    <ProtectedAdminRoute>
      <AdminPrograms />
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/inquiries"
  element={
    <ProtectedAdminRoute>
      <AdminInquiries />
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/news"
  element={
    <ProtectedAdminRoute>
      <AdminNews />
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/sections"
  element={
    <ProtectedAdminRoute>
      <AdminSections />
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/events"
  element={
    <ProtectedAdminRoute>
      <AdminEvents />
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/calendar"
  element={
    <ProtectedAdminRoute>
      <AdminCalendar />
    </ProtectedAdminRoute>
  }
/>
        
      </Routes>
    </>
  );
}

export default AppRoutes;
