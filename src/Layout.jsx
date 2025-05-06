import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Button } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './components/firebase';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import NavButton from './components/NavButton';

function Layout({ sections }) {
  const location = useLocation();
  const navigate = useNavigate();

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
            borderRadius: '4px',
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
                fontWeight: location.pathname === '/' ? 'bold' : 'normal',
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
              to="/events"
              color="inherit"
              sx={{
                fontWeight: location.pathname === '/events' ? 'bold' : 'normal',
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
      <div className="page-content" style={{ marginTop: '90px' }}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
