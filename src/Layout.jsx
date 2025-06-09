import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './components/firebase';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import NavButton from './components/NavButton';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useMediaQuery, useTheme } from '@mui/material';

function Layout({ sections }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const navigate = useNavigate();

  const [logoUrl, setLogoUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    FacebookLink: '',
    WhatsAppLink: '',
    instagramLink: '',
  });

  // Menu states
  const [sectionsMenuAnchor, setSectionsMenuAnchor] = useState(null);
  const isSectionsMenuOpen = Boolean(sectionsMenuAnchor);
  const handleSectionsMenuOpen = (event) => setSectionsMenuAnchor(event.currentTarget);
  const handleSectionsMenuClose = () => setSectionsMenuAnchor(null);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const toggleMobileDrawer = (open) => () => setIsMobileDrawerOpen(open);

  const handleSectionClick = (id) => {
    navigate(`/sections/${id}`);
    handleSectionsMenuClose();
    setIsMobileDrawerOpen(false);
  };
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// const computedPosition = isMobile ? 'static' : (isHomePage ? 'static' : 'absolute');

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
        }
      } catch (error) {
        console.error('Error fetching site info:', error);
      }
    };

    fetchSiteInfo();
  }, []);

const drawerItemStyle = {
  backgroundColor: 'white',
  borderRadius: 2,
  my: 0.5,
  px: 2,
  py: 1,
  textAlign: 'right',
  direction: 'rtl',
  justifyContent: 'space-between',
  '&:hover': { backgroundColor: ' #f1f1f1' },
  '& .MuiListItemText-primary': {
    fontWeight: 'bold',
    color: 'black',
    fontSize: '1rem',
    fontFamily: 'Cairo, sans-serif',
  },
};


  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: 'rgb(255, 255, 255)', boxShadow: 'none' }}
      >
        <Toolbar sx={{ minHeight: '80px', justifyContent: 'space-between' }}>
          {/* Logo */}
          {logoUrl && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NavButton to="/" sx={{ p: 0, minWidth: 0 }}>
                <img src={logoUrl} alt="Logo" style={{ height: 60, width: 'auto', cursor: 'pointer' }} />
              </NavButton>
            </Box>
          )}

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2,
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl',
            }}
          >
            <NavButton to="/" sx={navStyle(location.pathname === '/')}>الرئيسية</NavButton>
            <NavButton to="/programs" sx={navStyle(location.pathname === '/programs')}>الدورات</NavButton>
            <NavButton to="/events" sx={navStyle(location.pathname === '/events')}>الفعاليات</NavButton>
           <Button
  onClick={handleSectionsMenuOpen}
  sx={{
    fontSize: '19px',
    color: 'black',
    outline: 'none',
    '&:focus': { color: 'rgb(0, 0, 0)', outline: 'none' },
  }}
>
  الأقسام
</Button>            <NavButton to="/news" sx={navStyle(location.pathname === '/news')}>أخبارنا</NavButton>
            <NavButton to="/about" sx={navStyle(location.pathname === '/about')}>عن المركز</NavButton>
            <NavButton to="/contact" sx={navStyle(location.pathname === '/contact')}>تواصل معنا</NavButton>
          </Box>

          {/* Hamburger for Mobile */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              onClick={toggleMobileDrawer(true)}
              sx={{
                color: 'black',
                fontSize: 30,
                borderRadius: 6,
                transition: '0.2s',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                '&:focus-visible': {
                  backgroundColor: 'rgba(0,0,0,0.08)',
                  boxShadow: '0 0 0 2px rgba(0,0,0,0.1)',
                },
              }}
            >
              <MenuIcon sx={{ fontSize: 36 }} />
            </IconButton>
          </Box>

          {/* Social Icons (desktop only) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              color: 'black',
              '& a:hover': { color: 'rgb(0, 0, 0)' },
            }}
          >
            {socialLinks.FacebookLink && (
              <IconButton component="a" href={socialLinks.FacebookLink} target="_blank" rel="noopener noreferrer" color="inherit">
                <FacebookIcon />
              </IconButton>
            )}
            {socialLinks.WhatsAppLink && (
              <IconButton component="a" href={socialLinks.WhatsAppLink} target="_blank" rel="noopener noreferrer" color="inherit">
                <WhatsAppIcon />
              </IconButton>
            )}
            {socialLinks.instagramLink && (
              <IconButton component="a" href={socialLinks.instagramLink} target="_blank" rel="noopener noreferrer" color="inherit">
                <InstagramIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* الأقسام Menu (desktop only) */}
      <Menu
        anchorEl={sectionsMenuAnchor}
        open={isSectionsMenuOpen}
        onClose={handleSectionsMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          sx: {
            direction: 'rtl',
            minWidth: 180,
            backgroundColor: 'white',
            outline: 'none',
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
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.21)', outline: 'none' },
            }}
          >
            {section.title}
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isMobileDrawerOpen}
        onClose={toggleMobileDrawer(false)}
        PaperProps={{
          sx: {
            width: '80%',
            background:"rgb(38, 144, 186)",
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'left', p: 1 }}>
          <IconButton onClick={toggleMobileDrawer(false)} sx={{ color: 'white' }}>
            <CloseIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
       <List sx={{ px: 2 , py: 0 }}>
  <ListItemButton onClick={() => { navigate('/'); setIsMobileDrawerOpen(false); }} sx={drawerItemStyle}>
    <ListItemText primary="الرئيسية" />
    <ChevronRightIcon />
  </ListItemButton>

  <ListItemButton onClick={() => { navigate('/programs'); setIsMobileDrawerOpen(false); }} sx={drawerItemStyle}>
    <ListItemText primary="الدورات" />
    <ChevronRightIcon />
  </ListItemButton>

  <ListItemButton onClick={() => { navigate('/events'); setIsMobileDrawerOpen(false); }} sx={drawerItemStyle}>
    <ListItemText primary="الفعاليات" />
    <ChevronRightIcon />
  </ListItemButton>

  {/* الأقسام accordion */}
  <Accordion
    sx={{
      backgroundColor: 'white',
      borderRadius: 2,
      my: 0.5,
      '&::before': { display: 'none' },
    }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      sx={{
        textAlign: 'right',
        direction: 'rtl',
        px: 2,
        py: 0,
        '& .MuiAccordionSummary-content': {
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      }}
    >
      <ListItemText primary="الأقسام" />
    </AccordionSummary>
    <AccordionDetails sx={{ p: 0 }}>
      {sections.map((section) => (
        <ListItemButton
          key={section.id}
          onClick={() => { handleSectionClick(section.id); setIsMobileDrawerOpen(false); }}
          sx={{
            ...drawerItemStyle,
            borderRadius: 0,
            borderTop: '1px solid #eee',
            backgroundColor: 'transparent',
          }}
        >
          <ListItemText primary={section.title} />
        </ListItemButton>
      ))}
    </AccordionDetails>
  </Accordion>

  <ListItemButton onClick={() => { navigate('/news'); setIsMobileDrawerOpen(false); }} sx={drawerItemStyle}>
    <ListItemText primary="أخبارنا" />
    <ChevronRightIcon />
  </ListItemButton>

  <ListItemButton onClick={() => { navigate('/about'); setIsMobileDrawerOpen(false); }} sx={drawerItemStyle}>
    <ListItemText primary="عن المركز" />
    <ChevronRightIcon />
  </ListItemButton>

  <ListItemButton onClick={() => { navigate('/contact'); setIsMobileDrawerOpen(false); }} sx={drawerItemStyle}>
    <ListItemText primary="تواصل معنا" />
     <ChevronRightIcon />
  </ListItemButton>
</List>
      </Drawer>

      {/* Page Content */}
      <Box className="page-content" sx={{ pt: 'px', px: { xs: 0, md: 0 } }}>
        <Outlet />
      </Box>

      {/* Admin Login Footer */}
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
        <NavButton
          to="/login"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 16,
            fontSize: '12px',
            color: '#666',
            textTransform: 'uppercase',
          }}
        >
          تسجيل دخول للإدارة فقط
        </NavButton>
      </Box>
    </>
  );
}

function navStyle(active) {
  return {
    fontWeight: active ? 'bold' : 'normal',
    fontSize: '19px',
    color: 'black',
    '&:hover': { color: 'rgb(0, 0, 0)' },
  };
}

export default Layout;
