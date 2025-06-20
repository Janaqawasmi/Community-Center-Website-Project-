import { Box, Typography, Divider } from '@mui/material';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import RequireAdmin from '../../components/auth/RequireAdmin';
import ProgramStatsChart from '../../components/Data Analysis/ProgramRegistrationStatsChart.jsx';

export default function AdminDashboard() {
  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <Box
          sx={{
            p: { xs: 2, md: 4 },
            maxWidth: '1200px',
            mx: 'auto',
            textAlign: 'right', // RTL-aware layout
            direction: 'rtl',
          }}
        >
          <Typography variant="h4" gutterBottom>
            عدد المسجلين في كل برنامج (خلال فترة زمنية)
          </Typography>

          <Divider sx={{ my: 2 }} />

          <ProgramStatsChart />
        </Box>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}
