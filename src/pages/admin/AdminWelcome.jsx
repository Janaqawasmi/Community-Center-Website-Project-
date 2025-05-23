import React from 'react';
import { Box, Typography } from '@mui/material';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

export default function AdminWelcome() {
  return (
    <AdminDashboardLayout>
      <Box textAlign="center" mt={10}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          مرحبًا بك في لوحة تحكم المسؤول
        </Typography>
        <Typography mt={2} color="text.secondary">
          استخدم القائمة الجانبية للتنقل بين صفحات الإدارة.
        </Typography>
      </Box>
    </AdminDashboardLayout>
  );
}
