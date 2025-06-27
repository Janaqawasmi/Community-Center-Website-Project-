import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Button, 
  Typography, 
  Avatar, 
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ListAlt from '@mui/icons-material/ListAlt';

import { 
  AdminPanelSettings, 
  Dashboard, 
  EventNote, 
  Article, 
  Category, 
  QuestionAnswer, 
  CalendarMonth, 
  ExitToApp,
  Info
} from '@mui/icons-material';

const sections = [
  { label: 'لوحة التحكم', path: '/admin/dashboard', icon: <Dashboard /> },
  { label: 'الأقسام', path: '/admin/sections', icon: <Category /> },
  { label: 'البرامج', path: '/admin/programs', icon: <Category /> },
  { label: 'الفعاليات', path: '/admin/events', icon: <EventNote /> },
  { label: 'التسجيلات', path: '/admin/registrations', icon: <ListAlt /> },
  { label: 'عن المركز', path: '/admin/about', icon: <Info /> },
  { label: 'الأخبار', path: '/admin/news', icon: <Article /> },
  { label: 'تواصل معنا', path: '/admin/inquiries', icon: <QuestionAnswer /> },
  { label: 'التقويم', path: '/admin/calendar', icon: <CalendarMonth /> },
];

export default function AdminDashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc'}}>
      {/* Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: '#3b82f6',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          height: { xs: '56px', md: '64px' }
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          px: { xs: 2, md: 4 },
          py: { xs: 0.5, md: 1 },
          direction: 'rtl',
          height: { xs: '56px', md: '64px' },
          minHeight: '0 !important'
        }}>
          {/* Logo and Title */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, md: 2 },
            position: { xs: 'absolute', md: 'static' },
            left: { xs: '50%', md: 'auto' },
            transform: { xs: 'translateX(-50%)', md: 'none' },
            zIndex: 3
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, md: 1 },
              background: 'rgba(255,255,255,0.1)',
              borderRadius: { xs: '8px', md: '12px' },
              padding: { xs: '6px 12px', md: '8px 16px' },
              backdropFilter: 'blur(10px)'
            }}>
              <AdminPanelSettings sx={{ 
                color: '#2563eb', 
                fontSize: { xs: 20, md: 28 } 
              }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: { xs: '0.9rem', md: '1.2rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                لوحة الإدارة
              </Typography>
            </Box>
          </Box>

          {/* Mobile Menu Button (Right Side) */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' },
            position: 'absolute',
            right: 16,
            zIndex: 3
          }}>
            <IconButton 
              onClick={toggleDrawer(true)}
              sx={{ 
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                width: 40,
                height: 40,
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>

          {/* Desktop Admin Profile */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 2 
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50px',
              padding: '6px 16px 6px 6px',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}
              >
                مرحباً، مدير النظام
              </Typography>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  background: '#2563eb',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                م
              </Avatar>
            </Box>
            
            <IconButton 
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                background: 'rgba(37, 99, 235, 0.2)',
                width: 40,
                height: 40,
                '&:hover': {
                  background: 'rgba(37, 99, 235, 0.3)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ExitToApp sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Mobile Admin Profile (Left Side) */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' },
            position: 'absolute',
            left: 16,
            zIndex: 3
          }}>
            <IconButton 
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                width: 40,
                height: 40,
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <ExitToApp sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Desktop Navigation Menu */}
      <Box sx={{ 
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #e2e8f0',
        display: { xs: 'none', md: 'block' }
      }}>
        <Box sx={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          px: 4
        }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            py: 1,
          }}>
            {sections.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    flex: 1,
                    px: 1,
                    py: 1,
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    gap: 1,
                    minHeight: '36px',
                    mx: 0.25,
                    '& .MuiButton-startIcon': {
                      marginLeft: 0.5,
                      marginRight: 0,
                      '& > *:nth-of-type(1)': {
                        fontSize: '16px'
                      }
                    },
                    ...(isActive ? {
                      background: '#2563eb',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                      transform: 'translateY(-1px)',
                      '& .MuiSvgIcon-root': {
                        color: 'white'
                      }
                    } : {
                      background: 'transparent',
                      color: '#64748b',
                      '&:hover': {
                        background: '#f1f5f9',
                        color: '#2563eb',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                        '& .MuiSvgIcon-root': {
                          color: '#2563eb'
                        }
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#94a3b8'
                      }
                    })
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '80%',
            borderRadius: '16px 0 0 16px',
            backgroundColor: '#f8fafc',
            direction: 'rtl',
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#3b82f6'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '6px 12px',
            backdropFilter: 'blur(10px)'
          }}>
            <AdminPanelSettings sx={{ color: '#2563eb', fontSize: 20 }} />
            <Typography sx={{ 
              fontWeight: 'bold',
              color: 'white',
              fontSize: '0.9rem'
            }}>
              لوحة الإدارة
            </Typography>
          </Box>
          <IconButton 
            onClick={toggleDrawer(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sections.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                sx={{
                  borderRadius: 2,
                  direction: 'rtl',
                  '&:hover': { backgroundColor: '#e2e8f0' },
                  ...(isActive ? {
                    backgroundColor: '#2563eb',
                    color: 'white',
                    '&:hover': { backgroundColor: '#1d4ed8' },
                    '& .MuiSvgIcon-root': { color: 'white' },
                    '& .MuiListItemText-primary': { color: 'white' }
                  } : {
                    backgroundColor: 'white',
                    '& .MuiSvgIcon-root': { color: '#64748b' }
                  })
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '15px',
                    fontWeight: 500,
                    sx: { textAlign: 'right', direction: 'rtl' }
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        {/* Mobile Admin Profile in Drawer */}
        <Box sx={{
          mt: 'auto',
          p: 2,
          borderTop: '1px solid #e2e8f0',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          direction: 'rtl'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2
          }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                background: '#2563eb',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}
            >
              م
            </Avatar>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b',
                fontWeight: 500,
                fontSize: '0.85rem'
              }}
            >
              مدير النظام
            </Typography>
          </Box>
          <IconButton 
            onClick={handleLogout}
            sx={{ 
              color: '#64748b',
              '&:hover': {
                color: '#ef4444',
                backgroundColor: '#fef2f2'
              }
            }}
          >
            <ExitToApp sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          p: { xs: 0.5, sm: 1, md: 4 },
          minHeight: 'calc(100vh - 140px)'
        }}
      >
        <Box sx={{
          background: 'white',
          borderRadius: { xs: '8px', md: '16px' },
          boxShadow: { 
            xs: '0 2px 10px rgba(0,0,0,0.05)', 
            md: '0 4px 20px rgba(0,0,0,0.05)' 
          },
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          minHeight: { xs: 'calc(100vh - 160px)', md: '600px' },
          mx: { xs: 0.5, sm: 1, md: 0 }
        }}>
          {children}
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{
        background: 'white',
        borderTop: '1px solid #e2e8f0',
        py: 3,
        mt: 'auto'
      }}>
        <Box sx={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          px: { xs: 2, md: 4 },
          textAlign: 'center'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
            }}
          >
            © 2025 لوحة إدارة المركز المجتمعي - جميع الحقوق محفوظة
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}