import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import logo from './assets/logo2.jpg';
import './App.css';

import {
  FaSearch,
  FaUser,
  FaUniversalAccess
} from 'react-icons/fa';

function Layout() {
  const location = useLocation();

  return (
    <>
   

      {/* Navbar */}
      <nav className="navbar">

      <div className="nav-logo-container">
        <Link to="/">
        <img src={logo} alt="Logo" className="nav-logo" />
        </Link>
      </div>

        <div className="nav-left">
          <FaSearch className="nav-icon" title="بحث" />
          <FaUser className="nav-icon" title="تسجيل الدخول" />
          <FaUniversalAccess className="nav-icon" title="إمكانية الوصول" />
        </div>

        <div className="nav-center">
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>تواصل معنا</Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>عن المركز</Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>الدورات</Link>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>الرئيسية</Link>
        <Link to="/registration" className={location.pathname === '/registration' ? 'active' : ''}>تسجيل</Link>

        </div>
      </nav>

      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
