import React from 'react';
import { AppBar, Box, Toolbar, Button, Typography, Avatar, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
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
  { label: 'عن المركز', path: '/admin/about', icon: <Info /> },
  { label: 'البرامج', path: '/admin/programs', icon: <Category /> },
  { label: 'الأخبار', path: '/admin/news', icon: <Article /> },
  { label: 'الأقسام', path: '/admin/sections', icon: <Category /> },
  { label: 'الفعاليات', path: '/admin/events', icon: <EventNote /> },
  { label: 'تواصل معنا', path: '/admin/inquiries', icon: <QuestionAnswer /> },
  { label: 'التقويم', path: '/admin/calendar', icon: <CalendarMonth /> },
];

export default function AdminDashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
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
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          px: { xs: 1, md: 4 },
          py: { xs: 0.5, md: 1 },
          direction: 'rtl',
          minHeight: { xs: '56px', md: '64px' }
        }}>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
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
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: { xs: '0.9rem', md: '1.2rem' },
                  display: { xs: 'none', sm: 'block' }

                }}
              >
                لوحة الإدارة
              </Typography>
            </Box>
          </Box>

          {/* Admin Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, md: 2 },
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50px',
              padding: { xs: '4px 12px 4px 4px', md: '6px 16px 6px 6px' },
              backdropFilter: 'blur(10px)'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white',
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' },
                  fontSize: { xs: '0.8rem', md: '0.9rem' }
                }}
              >
                مرحباً، مدير النظام
              </Typography>
              <Avatar 
                sx={{ 
                  width: { xs: 28, md: 36 }, 
                  height: { xs: 28, md: 36 },
                  background: '#2563eb',
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', md: '0.9rem' }
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
                width: { xs: 36, md: 40 },
                height: { xs: 36, md: 40 },
                '&:hover': {
                  background: 'rgba(37, 99, 235, 0.3)',
                  transform: { xs: 'none', md: 'scale(1.05)' }
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ExitToApp sx={{ fontSize: { xs: 18, md: 20 } }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Menu */}
      <Box sx={{ 
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Box sx={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          px: { xs: 1, md: 4 }
        }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'center' },
            gap: { xs: 0.5, md: 1 },
            py: { xs: 1.5, md: 2 },
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '4px'
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f5f9'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#cbd5e1',
              borderRadius: '2px'
            }
          }}>
            {sections.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    minWidth: { xs: 'auto', md: 'auto' },
                    px: { xs: 1.5, md: 3 },
                    py: { xs: 1, md: 1.5 },
                    borderRadius: { xs: '8px', md: '12px' },
                    fontFamily: 'Cairo, sans-serif',

                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', md: '0.95rem' },
                    textTransform: 'none',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    gap: { xs: 0.5, md: 1.5 },
                    '& .MuiButton-startIcon': {
                      marginLeft: { xs: 0.5, md: 1 },
                      marginRight: 0,
                      '& > *:nth-of-type(1)': {
                        fontSize: { xs: '16px', md: '20px' }
                      }
                    },
                    ...(isActive ? {
                      background: '#2563eb',
                      color: 'white',
                      boxShadow: { 
                        xs: '0 2px 8px rgba(37, 99, 235, 0.2)', 
                        md: '0 4px 15px rgba(37, 99, 235, 0.3)' 
                      },
                      transform: { xs: 'none', md: 'translateY(-2px)' },
                      '& .MuiSvgIcon-root': {
                        color: 'white'
                      }
                    } : {
                      background: 'transparent',
                      color: '#64748b',
                      '&:hover': {
                        background: '#f1f5f9',
                        color: '#2563eb',
                        transform: { xs: 'none', md: 'translateY(-1px)' },
                        boxShadow: { xs: 'none', md: '0 2px 8px rgba(0,0,0,0.1)' },
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
                  <Box sx={{ 
                    display: { xs: 'none', sm: 'block' } 
                  }}>
                    {item.label}
                  </Box>
                </Button>
              );
            })}
          </Box>
        </Box>
      </Box>

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