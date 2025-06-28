// src/pages/admin/AdminDashboard.jsx
import { Box, Typography, Divider, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import RequireAdmin from '../../components/auth/RequireAdmin';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <Box
          sx={{
            p: { xs: 2, md: 4 },
            maxWidth: '900px',
            mx: 'auto',
            textAlign: 'right',
            direction: 'rtl',
          }}
        >
          <Typography variant="h4" gutterBottom>
            لوحة التحكم الإدارية
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/admin/program-stats')}
            >
              📈تحليل البيانات 
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/admin/analytics')}
            >
              📊 إحصائيات عدد المشاهدات
            </Button>
          </Stack>
        </Box>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}
