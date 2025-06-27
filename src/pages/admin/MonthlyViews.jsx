import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../../components/firebase';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import RequireAdmin from '../../components/auth/RequireAdmin';

export default function MonthlyViews() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Get all unique page paths from the collection
  const fetchUniquePages = async () => {
    const snapshot = await getDocs(collection(db, 'pageViews'));
    const allPaths = new Set();
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.path) allPaths.add(data.path);
    });
    setPages([...allPaths]);
  };

  // ✅ Get monthly view data from the selected page document
  const fetchMonthlyViews = async (pagePath) => {
    setLoading(true);
    const encodedId = encodeURIComponent(pagePath);
    const docRef = doc(db, 'pageViews', encodedId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const monthlyViews = data.monthlyViews || {};

      const allMonths = [
        '2025-01', '2025-02', '2025-03', '2025-04',
        '2025-05', '2025-06', '2025-07', '2025-08',
        '2025-09', '2025-10', '2025-11', '2025-12'
      ];

      const monthLabels = {
        '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
        '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
        '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
      };

      const chartData = allMonths.map(monthKey => {
        const [_, month] = monthKey.split("-");
        return {
          month: monthLabels[month],
          views: monthlyViews[monthKey] || 0
        };
      });

      setMonthlyData(chartData);
    } else {
      setMonthlyData([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUniquePages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchMonthlyViews(selectedPage);
    }
  }, [selectedPage]);

  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <Box sx={{ p: 4, direction: 'rtl', textAlign: 'right' }}>
          <Typography variant="h4" gutterBottom>
            📊 تحليل عدد المشاهدات شهريًا حسب الصفحة
          </Typography>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="page-select-label">اختر الصفحة</InputLabel>
            <Select
              labelId="page-select-label"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              label="اختر الصفحة"
            >
              {pages.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {loading ? (
            <CircularProgress />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#0077cc"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}
