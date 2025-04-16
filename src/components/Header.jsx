import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaUniversalAccess } from 'react-icons/fa';
import logo from '../logo_final.png';
import './Header.css';

function Header() {
  return (
    <>
      <div className="floating-logo">
        <img src={logo} alt="Logo" />
      </div>

      <nav className="navbar">
        <div className="nav-logo"></div>

        <div className="nav-links">
          <Link to="/">الرئيسية</Link>
          <Link to="/about">عن المركز</Link>
          <Link to="/courses">الدورات</Link>
          <Link to="/contact">تواصل معنا</Link>
        </div>

        <div className="nav-icons">
          <FaSearch className="nav-icon" title="بحث" />
          <FaUser className="nav-icon" title="تسجيل الدخول" />
          <FaUniversalAccess className="nav-icon" title="إمكانية الوصول" />
        </div>
      </nav>
    </>
  );
}

export default Header;
