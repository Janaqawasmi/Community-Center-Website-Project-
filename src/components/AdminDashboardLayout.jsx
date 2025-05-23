import React from 'react';
import { AppBar, Box, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const sections = [
  { label: 'البرامج', path: '/admin/programs' },
  { label: 'الأخبار', path: '/admin/news' },
  { label: 'الأقسام', path: '/admin/sections' },
  { label: 'الفعاليات', path: '/admin/events' },
  { label: 'الاستفسارات', path: '/admin/inquiries' },
];

export default function AdminDashboardLayout({ children }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <AppBar position="static" color="default" sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
          {sections.map((item) => (
            <Button key={item.path} onClick={() => navigate(item.path)} color="primary">
              {item.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}