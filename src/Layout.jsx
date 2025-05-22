import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
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
      {/* Floating Logo */}
      {logoUrl && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1300,
            backgroundColor: 'rgb(255, 255, 255)',
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

      {/* Transparent Navbar */}
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ position: 'relative', minHeight: '90px' }}>
          {/* Social Icons */}
          <Box
            sx={{
              position: 'absolute',
              left: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'white',
              '& a:hover': { color: 'rgb(0, 0, 0)' },
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
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl',
            }}
          >
            <NavButton
              to="/"
              sx={{
                fontWeight:
                  location.pathname === '/' &&
                  activeSection !== 'courses' &&
                  activeSection !== 'events'
                    ? 'bold'
                    : 'normal',
                fontSize: '19px',
                color: 'black',
                '&:hover': { color: 'rgb(0, 0, 0)' },
              }}
            >
              الرئيسية
            </NavButton>

            <NavButton
              to="/programs"
              sx={{
                fontWeight: location.pathname === '/programs' ? 'bold' : 'normal',
                fontSize: '19px',
                color: 'black',
                '&:hover': { color: 'rgb(0, 0, 0)'

                 },
              }}
            >
              الدورات
            </NavButton>

            <NavButton
              to="/events"
              sx={{
                fontWeight: location.pathname === '/events' ? 'bold' : 'normal',
                fontSize: '19px',
                color: 'black',
                '&:hover': { color: 'rgb(0, 0, 0)' },
              }}
            >
              الفعاليات
            </NavButton>

            <Button
              onClick={handleMenuOpen}
              sx={{
                fontSize: '19px',
                color: 'black',
                                                  outline:'none',

                '&:focus': { color: 'rgb(0, 0, 0)',

                                  outline:'none',

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
                                                    outline:'none',

                },
              }}
            >
              {sections.map((section) => (
                <MenuItem
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  sx={{
                fontSize: '17px',
                    color: 'black',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.21)',                                   outline:'none',
 },
                  }}
                >
                  {section.title}
                </MenuItem>
              ))}
            </Menu>

 <NavButton
              to="/news"
              sx={{
                fontWeight: location.pathname === '/news' ? 'bold' : 'normal',
                fontSize: '19px',
                color: 'black',
                '&:hover': { color: 'rgb(0, 0, 0)' },
              }}
            >
              أخبارنا
            </NavButton>

            <NavButton
              to="/about"
              sx={{
                fontWeight: location.pathname === '/about' ? 'bold' : 'normal',
                fontSize: '19px',
                color: 'black',
                '&:hover': { color: 'rgb(0, 0, 0)' },
              }}
            >
              عن المركز
            </NavButton>

            <NavButton
              to="/contact"
              sx={{
                fontWeight: location.pathname === '/contact' ? 'bold' : 'normal',
                fontSize: '19px',
                color: 'black',
                '&:hover': { color: 'rgb(0, 0, 0)' },
              }}
            >
              تواصل معنا
            </NavButton>
          </Box>
        </Toolbar>
      </AppBar>

 
      {/* Page Content */}
      <Box
        className="page-content"
        sx={{
          pt: "px",
          px: { xs: 0, md: 0 },
        }}
      >
        <Outlet />
      </Box>

      {/* Bottom Admin Login */}
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
  <NavButton
  to="/login"
  sx={{
    position: 'absolute',
    bottom: 8,
    left: 16,
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase'
  }}
>
  تسجيل دخول للإدارة فقط
</NavButton>

</Box>
    </>
  );
}

export default Layout;
