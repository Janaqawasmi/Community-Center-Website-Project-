// src/pages/admin/ProgramStatsPage.jsx
import { Box, Typography } from '@mui/material';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import RequireAdmin from '../../components/auth/RequireAdmin';
import ProgramRegistrationStatsChart from '../../components/Data Analysis/ProgramRegistrationStatsChart';

export default function ProgramStatsPage() {
  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <Box sx={{ p: 4, direction: 'rtl', textAlign: 'right' }}>
          <Typography variant="h5" gutterBottom>
            📈 عدد المسجلين في كل برنامج
          </Typography>
          <ProgramRegistrationStatsChart />
        </Box>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}
