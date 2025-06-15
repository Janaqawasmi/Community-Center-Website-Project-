import React from 'react';
import { AppBar, Box, Toolbar, Button, Typography, Avatar, IconButton, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminPanelSettings, Dashboard, EventNote, Article, Category, QuestionAnswer, CalendarMonth, ExitToApp } from '@mui/icons-material';

const sections = [
  { label: 'لوحة التحكم', path: '/admin/dashboard', icon: <Dashboard /> },
  { label: 'البرامج', path: '/admin/programs', icon: <Category /> },
  { label: 'الأخبار', path: '/admin/news', icon: <Article /> },
  { label: 'الأقسام', path: '/admin/sections', icon: <Category /> },
  { label: 'الفعاليات', path: '/admin/events', icon: <EventNote /> },
  { label: 'الاستفسارات', path: '/admin/inquiries', icon: <QuestionAnswer /> },
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Cairo, sans-serif' }}>
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
          px: { xs: 2, md: 4 },
          py: 1,
          direction: 'rtl'
        }}>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '8px 16px',
              backdropFilter: 'blur(10px)'
            }}>
              <AdminPanelSettings sx={{ color: '#2563eb', fontSize: 28 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'white',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}
              >
                لوحة الإدارة
              </Typography>
            </Box>
          </Box>

          {/* Admin Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' }
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
                '&:hover': {
                  background: 'rgba(37, 99, 235, 0.3)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ExitToApp />
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
          px: { xs: 2, md: 4 }
        }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            py: 2,
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
                    minWidth: 'auto',
                    px: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    gap: 1.5,
                    ...(isActive ? {
                      background: '#2563eb',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                      transform: 'translateY(-2px)',
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
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          p: { xs: 2, md: 4 },
          minHeight: 'calc(100vh - 140px)'
        }}
      >
        <Box sx={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          minHeight: '600px'
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
              fontFamily: 'Cairo, sans-serif'
            }}
          >
            © 2025 لوحة إدارة المركز المجتمعي - جميع الحقوق محفوظة
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}