import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import AdminAnalytics from '../../components/Data Analysis/AdminAnalytics';
import MonthlyViews from './MonthlyViews';

export default function PageViews() {
  const [tab, setTab] = useState(0);

  return (
    <AdminDashboardLayout>
      <Box sx={{ p: 4, direction: 'rtl' }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          📊 إحصائيات عدد المشاهدات
        </Typography>

        <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
          <Tab label="إحصائيات شهرية" />
          <Tab label="إحصائيات عامة" />

        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <MonthlyViews />}
          {tab === 1 && <AdminAnalytics />}

        </Box>
      </Box>
    </AdminDashboardLayout>
  );
}
