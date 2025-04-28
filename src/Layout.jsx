// ========================
// React and Routing
// ========================
import React from 'react'; // استيراد React
import { Outlet, Link, useLocation } from 'react-router-dom'; // استيراد مكونات التنقل من React Router

// ========================
// MUI Components
// ========================
import { AppBar, Toolbar, Box, IconButton, InputBase } from '@mui/material'; // استيراد مكونات Material-UI
import { useTheme } from '@mui/material/styles'; // استخدام الثيم في MUI
import useMediaQuery from '@mui/material/useMediaQuery'; // استخدام media queries في MUI

// ========================
// Icons
// ========================
import { FaSearch, FaUser, FaUniversalAccess } from 'react-icons/fa'; // استيراد الأيقونات من React Icons

// ========================
// Logo
// ========================
import logo from './assets/logo.png'; // استيراد شعار الموقع

// ========================
// Global CSS
// ========================
import './App.css'; // استيراد ملف CSS العام

// ========================
// Layout Component
// ========================
function Layout() { // تعريف مكون Layout
  const location = useLocation(); // معرفة المسار الحالي
  const theme = useTheme(); // استخدام الثيم الحالي
  const isLandscape = useMediaQuery('(orientation: landscape)'); // اكتشاف الوضع العرضي للجهاز
  const isPhone = useMediaQuery('(max-width:600px)'); // اكتشاف إذا كان الجهاز هاتف صغير

  return (
    <>
      {/* Navbar Section */}
      <AppBar
        position="sticky"
        sx={{ // تصميم شريط التنقل
          backgroundColor: 'whitesmoke',
          color: 'black',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '100%',
          overflow: 'visible',
        }}
      >
        <Toolbar
          sx={{ // تنسيق عناصر الشريط
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 2rem',
            minHeight: { xs: '80px', sm: '90px', md: '100px' },
            position: 'relative',
            flexWrap: 'nowrap',
          }}
        >
          {/* Logo Section */}
          <Box
            component={Link}
            to="/"
            sx={{ // تنسيق شعار الموقع
              backgroundColor: 'white',
              width: { xs: isPhone && isLandscape ? 60 : 80, sm: 120, md: 150 },
              height: { xs: isPhone && isLandscape ? 40 : 50, sm: 70, md: 80 },
              padding: { xs: '0.4rem', sm: '1rem' },
              border: '3px solid #dc6e0d',
              borderRadius: '20% 15% 47% 50% / 36% 2% 16% 36%',
              boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
              textAlign: 'center',
              position: 'absolute',
              right: { xs: 5, sm: 10 },
              top: isPhone && isLandscape ? 60 : (isPhone ? 55 : (theme.breakpoints.down('sm') ? 5 : 0)),
              zIndex: 1001,
              cursor: 'pointer',
              transform: 'rotate(0deg)',
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ // صورة الشعار داخل الـ Box
                width: '90%',
                height: 'auto',
                objectFit: 'contain',
                position: 'relative',
                top: { xs: isPhone && isLandscape ? '-2px' : '-5px', sm: '-20px', md: '-30px' },
                right: { xs: 0, sm: '-5px' },
              }}
            />
          </Box>

          {/* Left Side: Search Bar + Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Search Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '20px', padding: '2px 8px', border: '1px solid #ccc' }}>
              <FaSearch style={{ fontSize: '1rem', color: 'gray' }} /> {/* أيقونة البحث */}
              <InputBase
                placeholder="ابحث هنا..."
                sx={{
                  ml: 1,
                  flex: 1,
                  fontSize: '0.9rem',
                }}
              /> {/* شريط إدخال نص البحث */}
            </Box>
            {/* Other Icons */}
            <IconButton size="small"><FaUser /></IconButton> {/* أيقونة المستخدم */}
            <IconButton size="small"><FaUniversalAccess /></IconButton> {/* أيقونة الوصول */}
          </Box>

          {/* Center Navigation Links */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              gap: { xs: '20px', sm: '30px' },
              marginTop: { xs: '10px', sm: '0' },
              flexWrap: 'nowrap',
            }}
          >
            {/* روابط التنقل */}
            <StyledLink to="/contact" active={location.pathname === '/contact'}>تواصل معنا</StyledLink>
            <StyledLink to="/about" active={location.pathname === '/about'}>عن المركز</StyledLink>
            <StyledLink to="/courses" active={location.pathname === '/courses'}>الدورات</StyledLink>
            <StyledLink to="/" active={location.pathname === '/'}>الرئيسية</StyledLink>
          </Box>

        </Toolbar>
      </AppBar>

      {/* Main Page Content */}
      <Box sx={{ width: '100%', backgroundColor: 'whitesmoke', minHeight: '100vh' }}>
        <Outlet /> {/* مكان عرض الصفحات الداخلية */}
      </Box>
    </>
  );
}

// ========================
// StyledLink Component (Responsive)
// ========================
function StyledLink({ to, children, active }) { // مكون رابط مخصص مع تمييز للصفحة الحالية
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Link
      to={to}
      style={{
        color: active ? '#f0a14d' : 'black',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: isMobile ? '0.8rem' : '1.2rem',
        paddingBottom: '3px',
        borderBottom: active ? '1px solid #edd1a5' : 'none',
        transition: 'border-bottom 0.3s, color 0.3s',
      }}
    >
      {children}
    </Link>
  );
}

export default Layout; // تصدير مكون Layout
