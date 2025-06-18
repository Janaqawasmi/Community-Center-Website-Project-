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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './components/firebase';
import NavButton from './components/NavButton';

const NAV_ITEMS = [
  { label: 'الرئيسية', path: '/' },
  { label: 'الدورات', path: '/programs' },
  { label: 'الفعاليات', path: '/events' },
  { label: 'أخبارنا', path: '/news' },
  { label: 'عن المركز', path: '/about' },
  { label: 'تواصل معنا', path: '/contact' },
];

function navStyle(active) {
  return {
    fontWeight: active ? 'bold' : 'normal',
    fontSize: '19px',
    color: 'black',
    '&:hover': { color: 'rgb(0, 0, 0)' },
  };
}

function Layout({ sections }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [logoUrl, setLogoUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState({});
  const [sectionsMenuAnchor, setSectionsMenuAnchor] = useState(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isSectionsMenuOpen = Boolean(sectionsMenuAnchor);
  const toggleMobileDrawer = (open) => () => setIsMobileDrawerOpen(open);

  const handleSectionClick = (id) => {
    navigate(`/sections/${id}`);
    setSectionsMenuAnchor(null);
    setIsMobileDrawerOpen(false);
  };
const handleNavClick = (path) => {
  navigate(path);
  setIsMobileDrawerOpen(false);
};

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const ref = doc(db, 'siteInfo', '9ib8qFqM732MnTlg6YGz');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
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

  const renderSocialIcon = (href, Icon, color) => (
  <IconButton
    component="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      color,
      transition: 'color 0.2s ease',
      '&:hover': {
        color: ' #1976d2', // ✅ MUI primary blue on hover
      },
    }}
  >
    <Icon />
  </IconButton>
);

  return (
    <>
<AppBar
  position="static"
  elevation={0}
  sx={{
    backgroundColor: '#fff',
    boxShadow: 'none',
    height: { xs: '56px', md: '64px' }, // ✅ Height by breakpoint
    px: { xs: 2, md: 4 }, // ✅ 8px on mobile, 32px on desktop
    justifyContent: 'center',
  }}
>
  <Toolbar
    disableGutters
    sx={{
      height: { xs: '56px', md: '64px' },   // ✅ Match height exactly
      minHeight: '0 !important',           // ✅ Prevent default MUI min height
      width: '100%',
      maxWidth: '1440px',
      mx: 'auto',
      justifyContent: 'space-between',
      px: { xs: 2, md: 4 }, // ✅ 8px on mobile, 32px on desktop
    }}
  >
       {/* Centered Logo on Mobile */}
{logoUrl && (
  <Box
    sx={{
      position: { xs: 'absolute', md: 'static' },
      left: { xs: '50%', md: 'auto' },
      transform: { xs: 'translateX(-50%)', md: 'none' },
      zIndex: 1, // ensure it's above the drawer button
    }}
  >
    <NavButton to="/" sx={{ p: 0, minWidth: 0 }}>
      <img
        src={logoUrl}
        alt="Logo"
        style={{ height: isMobile ? '40px' : '60px', width: 'auto' }}
      />
    </NavButton>
  </Box>
)}

          {/* Desktop Nav */}
          {/* Desktop Nav Buttons with الأقسام second */}
<Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, direction: 'rtl', alignItems: 'center' }}>
  {NAV_ITEMS.map(({ label, path }, index) => {
    if (index === 1) {
      return (
        <Box key="custom-duo" sx={{ display: 'flex', gap: 4 }}>
          <Button onClick={(e) => setSectionsMenuAnchor(e.currentTarget)} sx={navStyle(false)}>
            الأقسام
          </Button>
          <NavButton to={path} sx={navStyle(location.pathname === path)}>
            {label}
          </NavButton>
        </Box>
      );
    }
    return (
      <NavButton key={path} to={path} sx={navStyle(location.pathname === path)}>
        {label}
      </NavButton>
    );
  })}
</Box>


          {/* Mobile Menu Button on the right */}
<Box
  sx={{
    display: { xs: 'block', md: 'none' },
    position: 'absolute',
    right: 0,
    zIndex: 2,
  }}
>
  <IconButton onClick={toggleMobileDrawer(true)} sx={{ color: 'black' }}>
    <MenuIcon sx={{ fontSize: 36 }} />
  </IconButton>
</Box>


          {/* Desktop Social Icons */}
<Box
  sx={{
    display: { xs: 'none', md: 'flex' },
    gap: 4,
    alignItems: 'center',
  }}
>
  {socialLinks.FacebookLink && renderSocialIcon(socialLinks.FacebookLink, FacebookIcon, 'black')}
  {socialLinks.WhatsAppLink && renderSocialIcon(socialLinks.WhatsAppLink, WhatsAppIcon, 'black')}
  {socialLinks.instagramLink && renderSocialIcon(socialLinks.instagramLink, InstagramIcon, 'black')}
</Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={sectionsMenuAnchor}
        open={isSectionsMenuOpen}
        onClose={() => setSectionsMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ sx: { direction: 'rtl', minWidth: 180, backgroundColor: 'white' } }}
      >
        {sections.map((section) => (
          <MenuItem key={section.id} onClick={() => handleSectionClick(section.id)}>
            {section.title}
          </MenuItem>
        ))}
      </Menu>

      <Drawer
        anchor="right"
        open={isMobileDrawerOpen}
        onClose={toggleMobileDrawer(false)}
       PaperProps={{
  sx: {
    width: '80%',
      borderRadius: '16px 0 0 16px', // ✅ rounded left edge
    backgroundColor: '#f0f4f8', // ✅ custom background
    direction: 'rtl',           // ✅ text direction from right
  },
}}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 2 }}>
          <IconButton onClick={toggleMobileDrawer(false)}><CloseIcon /></IconButton>
        </Box>
     <List sx={{ px: 2, py: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
  {NAV_ITEMS.map(({ label, path }, index) => (
    <Box key={path}>
      {index === 1 && (
        <Accordion
          sx={{
            backgroundColor: '#f9f9f9',
            boxShadow: 'none',
            mb:0,
            borderRadius: 2,
            '&::before': { display: 'none' },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 'bold' }}>الأقسام</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0 }}>
            {sections.map((section) => (
              <ListItemButton
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                sx={{
                  pl: 3,
                  pr: 2,
                  py: 1,
                  borderRadius: 1,
                  direction: 'rtl',
                  justifyContent: 'flex-start',
                  '&:hover': { backgroundColor: ' #eee' },
                }}
              >
<ListItemText
  primary={section.title}
  primaryTypographyProps={{
    sx: {
      textAlign: 'right',
      direction: 'rtl',
      fontSize: '15px',
      fontFamily: 'Cairo, sans-serif',
    },
  }}
/>              </ListItemButton>
            ))}
          </AccordionDetails>
        </Accordion>
      )}
      <ListItemButton
       onClick={() => handleNavClick(path)}
        sx={{
          px: 2,
          py: 1.25,
          borderRadius: 2,
          backgroundColor: ' #f9f9f9',
          direction: 'rtl', // ✅ ensures right-to-left alignment
          '&:hover': { backgroundColor: '#eee' },
        }}
      >
        <ListItemText
          primary={label}
          primaryTypographyProps={{ fontSize: '15px',
             fontWeight: 500, sx: { textAlign: 'right',  direction: 'rtl', }, // ✅ align text to right
}}
          
        />
        <ChevronRightIcon sx={{ color: '#888' }} />
      </ListItemButton>
    </Box>
  ))}
</List>


<Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
    mt: 'auto',
    pt: 2,
    pb: 3,
    borderTop: '1px solid #eee',
  }}
>
   {socialLinks.FacebookLink && renderSocialIcon(socialLinks.FacebookLink, FacebookIcon, 'black')} 
   {socialLinks.WhatsAppLink && renderSocialIcon(socialLinks.WhatsAppLink, WhatsAppIcon, 'black')}
    {socialLinks.instagramLink && renderSocialIcon(socialLinks.instagramLink, InstagramIcon, 'black')} 
</Box>

      </Drawer>

      <Box sx={{ px: { xs: 0, md: 0 } }}>
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
        <NavButton
          to="/login"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 16,
            fontSize: '12px',
            color: '#666',
          }}
        >
          تسجيل دخول للإدارة فقط
        </NavButton>
      </Box>
    </>
  );
}

export default Layout;