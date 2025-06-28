// src/pages/admin/ProgramStatsPage.jsx
import { Box, Typography, Tabs, Tab } from '@mui/material';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import RequireAdmin from '../../components/auth/RequireAdmin';
import ProgramRegistrationStatsChart from '../../components/Data Analysis/ProgramRegistrationStatsChart';
import ProgramRegistrationsOverTimeChart from '../../components/Data Analysis/ProgramRegistrationsOverTimeChart';
import ProgramPopularityTable from '../../components/Data Analysis/ProgramPopularityTable';

import { useState } from 'react';

export default function ProgramStatsPage() {
  const [tab, setTab] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <Box sx={{ p: 2, direction: 'rtl', textAlign: 'right' }}>
          <Typography variant="h5" gutterBottom>
            لوحة تحليل البيانات
          </Typography>

          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label="تحليل زمني (Trend)" />
            <Tab label="تحليل حسب البرامج" />
             <Tab label="ترتيب البرامج" />
          </Tabs>

          {tab === 0 && (
              <ProgramRegistrationsOverTimeChart/>
          )}

          {tab === 1 && (
            <ProgramRegistrationStatsChart />
          )}

           {tab === 2 && (
            <ProgramPopularityTable/>
           )}

        </Box>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}
