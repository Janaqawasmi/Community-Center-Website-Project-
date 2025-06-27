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

import Login from '../pages/Login';
import ProtectedAdminRoute from './ProtectedAdminRoute'; // ✅ NEW
import AdminPrograms from '../pages/admin/AdminProgramEvents/AdminPrograms';
import AdminWelcome from '../pages/admin/AdminWelcome'; // ✅ FIXED
import AdminNews from '../pages/admin/AdminNews';
import AdminSections from '../pages/admin/AdminSections';
import AdminEvents from '../pages/admin/AdminProgramEvents/AdminEvents';
import AdminCalendar from '../pages/admin/AdminCalendar';
import AdminRegistrationsMainPage from '../pages/admin/AdminRegistrations/AdminRegistrationsMainPage'; 
import AdminAbout from '../pages/admin/AdminAbout'; 
import AdminDashboard from '../pages/admin/AdminDashboard'; 
import AdminInquiries from '../pages/admin/AdminInquiries';
import ProgramStatsPage from '../pages/admin/ProgramStatsPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage'; 
import MonthlyViews from '../pages/admin/MonthlyViews'; // ✅ NEW

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

<Route
  path="/admin/registrations"
  element={
    <ProtectedAdminRoute>
      <AdminRegistrationsMainPage />
    </ProtectedAdminRoute>
  }
/>
        {/* ✅ PROTECTED ADMIN ROUTES */}
        
        {/* Admin Dashboard - Main admin page */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminWelcome />
            </ProtectedAdminRoute>
          }
        />

        {/* Admin Dashboard - Control panel */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Admin About - Edit center information */}
        <Route
          path="/admin/about"
          element={
            <ProtectedAdminRoute>
              <AdminAbout />
            </ProtectedAdminRoute>
          }
        />

        {/* Admin Programs - Manage programs */}
        <Route
          path="/admin/programs"
          element={
            <ProtectedAdminRoute>
              <AdminPrograms />
            </ProtectedAdminRoute>
          }
        />

        {/* Admin News - Manage news */}
        <Route
          path="/admin/news"
          element={
            <ProtectedAdminRoute>
              <AdminNews />
            </ProtectedAdminRoute>
          }
        />

        {/* Admin Sections - Manage sections */}
        <Route
          path="/admin/sections"
          element={
            <ProtectedAdminRoute>
              <AdminSections />
            </ProtectedAdminRoute>
          }
        />

        {/* Admin Events - Manage events */}
        <Route
          path="/admin/events"
          element={
            <ProtectedAdminRoute>
              <AdminEvents />
            </ProtectedAdminRoute>
          }
        />

        {/* Admin Inquiries - Manage inquiries */}
        <Route
          path="/admin/inquiries"
          element={
            <ProtectedAdminRoute>
              <AdminInquiries />
            </ProtectedAdminRoute>
          }
        />

        {/* Admin Calendar - Manage calendar */}
        <Route
          path="/admin/calendar"
          element={
            <ProtectedAdminRoute>
              <AdminCalendar />
            </ProtectedAdminRoute>
          }
        />
<Route
  path="/admin/dashboard"
  element={
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  }
/>

  <Route
          path="/admin/program-stats"
          element={
            <ProtectedAdminRoute>
              <ProgramStatsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedAdminRoute>
              <AnalyticsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
  path="/admin/monthly-views"
  element={
    <ProtectedAdminRoute>
      <MonthlyViews />
    </ProtectedAdminRoute>
  }
/>

      </Routes>
      
    </>
  );
}

export default AppRoutes;