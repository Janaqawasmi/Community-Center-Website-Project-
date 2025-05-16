import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Button } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './components/firebase';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import NavButton from './components/NavButton';
import LoginIcon from '@mui/icons-material/Login';
import { useSectionContext } from './components/SectionContext';

function Layout({ sections }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeSection } = useSectionContext();

  const [logoUrl, setLogoUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    FacebookLink: '',
    WhatsAppLink: '',
    instagramLink: '',
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSectionClick = (id) => {
    navigate(`/sections/${id}`);
    handleMenuClose();
  };

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const siteInfoRef = doc(db, 'siteInfo', '9ib8qFqM732MnTlg6YGz');
        const siteInfoSnap = await getDoc(siteInfoRef);

        if (siteInfoSnap.exists()) {
          const data = siteInfoSnap.data();
          setLogoUrl(data.logo_url);
          setSocialLinks({
            FacebookLink: data.FacebookLink || '',
            WhatsAppLink: data.WhatsAppLink || '',
            instagramLink: data.instagramLink || '',
          });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching site info:', error);
      }
    };

    fetchSiteInfo();
  }, []);

  return (
    <>
      {/* Logo */}
      {logoUrl && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 1300,
            backgroundColor: '#f5f5f5',
            padding: '8px',
            borderRadius: '15px',
          }}
        >
          <NavButton to="/" sx={{ p: 0, minWidth: 0 }}>
            <img
              src={logoUrl}
              alt="Logo"
              style={{ height: 90, width: 'auto', cursor: 'pointer' }}
            />
          </NavButton>
        </Box>
      )}

      <AppBar position="fixed" color="default" elevation={5}>
        <Toolbar sx={{ position: 'relative', minHeight: '90px' }}>
          {/* Social Icons */}
          <Box
            sx={{
              position: 'absolute',
              left: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {socialLinks.FacebookLink && (
              <IconButton
                component="a"
                href={socialLinks.FacebookLink}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <FacebookIcon />
              </IconButton>
            )}
            {socialLinks.WhatsAppLink && (
              <IconButton
                component="a"
                href={socialLinks.WhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <WhatsAppIcon />
              </IconButton>
            )}
            {socialLinks.instagramLink && (
              <IconButton
                component="a"
                href={socialLinks.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <InstagramIcon />
              </IconButton>
            )}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}></Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              margin: '0 auto',
            }}
          >
            <NavButton
              to="/"
              color="inherit"
              sx={{
                fontWeight: location.pathname === '/' &&
                activeSection !== 'courses' &&
                activeSection !== 'events'
                  ? 'bold'
                  : 'normal',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '18px',
              }}
            >
              الرئيسية
            </NavButton>

            <NavButton
  to="/programs"
  color="inherit"
  sx={{
    fontWeight: location.pathname === '/programs' ? 'bold' : 'normal',
    fontFamily: 'Cairo, sans-serif',
    fontSize: '18px',
  }}
>
  الدورات
</NavButton>





<NavButton
  to="/"
  state={{ scrollTo: 'events' }}
  color="inherit"
  sx={{
    fontWeight:
      location.pathname === '/' && activeSection === 'events'
        ? 'bold'
        : 'normal',
    fontFamily: 'Cairo, sans-serif',
    fontSize: '18px',
  }}
>
  الفعاليات
</NavButton>




            {/* الأقسام Dropdown */}
            <Button
  onClick={handleMenuOpen}
  color="inherit"
  sx={{
    fontFamily: 'Cairo, sans-serif',
    fontSize: '18px',
    outline: 'none',
    boxShadow: 'none',
    '&:focus': {
      outline: 'none',
      boxShadow: 'none',
    },
  }}
>
  الأقسام
</Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              PaperProps={{
                sx: {
                  direction: 'rtl',
                  minWidth: 180,
                  backgroundColor: 'white',
                },
              }}
            >
              {sections.map((section) => (
                <MenuItem
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  sx={{
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '16px',
                    color: 'black',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                >
                  {section.title}
                </MenuItem>
              ))}
            </Menu>

            <NavButton
  to="/about"
  color="inherit"
  sx={{
    fontWeight: location.pathname === '/about' ? 'bold' : 'normal',
    fontFamily: 'Cairo, sans-serif',
    fontSize: '18px',
  }}
>
  عن المركز
</NavButton>


            <NavButton
              to="/contact"
              color="inherit"
              sx={{
                fontWeight: location.pathname === '/contact' ? 'bold' : 'normal',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '18px',
              }}
            >
              تواصل معنا
            </NavButton>
          </Box>
        </Toolbar>
      </AppBar>

     {/* Content Area */}
<Box sx={(theme) => theme.mixins.toolbar} />
<Box
  className="page-content"
  sx={{
    pt: 1,
    px: { xs: 0, md: 0 }, // Add horizontal padding: 16px on mobile, 48px on larger screens
  }}
>
  <Outlet />
</Box>









      <Box
  sx={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2.5rem', 
    backgroundColor: '#f1f1f1',
    borderTop: '1px solid #ccc',
    zIndex: 1200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
  }}
>

  {/* Admin Login Button */}
  <Button
    variant="outlined"
    startIcon={<LoginIcon />}
    sx={{
      fontFamily: 'Cairo, sans-serif',
      fontSize: '14px',
    }}
    onClick={async () => {
      const { getAuth, signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        alert(`welcome ${result.user.displayName}`);
        console.log("Logged in UID:", result.user.uid);
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
      }
    }}
  >
    تسجيل دخول للإدارة فقط
  </Button>
</Box>





    </>
  );
}

export default Layout;
