// src/pages/admin/AnalyticsPage.jsx
import { Box, Typography } from '@mui/material';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import RequireAdmin from '../../components/auth/RequireAdmin';
import PageViewsStats from '../../components/Data Analysis/AdminAnalytics';

export default function AnalyticsPage() {
  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <Box sx={{ p: 4, direction: 'rtl', textAlign: 'right' }}>
          <Typography variant="h5" gutterBottom>
            📊 إحصائيات عدد المشاهدات
          </Typography>
          <PageViewsStats />
        </Box>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}
