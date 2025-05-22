// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar } from '@mui/material';
import AdminInquiries from './AdminInquiries';
import AdminCalendar from './AdminCalendar'; // تأكد من وجوده بهذا الاسم

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <Box sx={{ direction: 'rtl', minHeight: '100vh', bgcolor: '#f9f9f9' }}>
      {/* الشريط العلوي */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
          <Button
            color="inherit"
            variant={activeTab === 'calendar' ? 'outlined' : 'text'}
            onClick={() => setActiveTab('calendar')}
          >
            التقويم
          </Button>
          <Button
            color="inherit"
            variant={activeTab === 'inquiries' ? 'outlined' : 'text'}
            onClick={() => setActiveTab('inquiries')}
          >
            إدارة الاستفسارات
          </Button>
        </Toolbar>
      </AppBar>

      {/* المحتوى حسب التبويب */}
      <Box p={3}>
        {activeTab === 'calendar' && <AdminCalendar />}
        {activeTab === 'inquiries' && <AdminInquiries />}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
