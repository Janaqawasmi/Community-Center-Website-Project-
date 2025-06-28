import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Button
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  collection,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../../components/firebase';

export default function MonthlyViews() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const [allViewsData, setAllViewsData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('06');
  const [loading, setLoading] = useState(false);
  const [pageSharePercent, setPageSharePercent] = useState(0);

  const exportRef = useRef();

  const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bfff", "#8a2be2"];
  const LABEL_MAP = {
    "/news": "أخبار",
    "/programs": "برامج",
    "/sections": "أقسام",
    "/contact": "اتصل بنا",
    "/about": "حول"
  };

  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('monthly-views.pdf');
  };

const fetchUniquePages = async () => {
  const snapshot = await getDocs(collection(db, 'pageViews'));
  const paths = new Set();
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.path) paths.add(data.path);
  });

  const filtered = [...paths].filter(path => {
    // ✅ Keep only clean paths — hide any /news/NewsX and /news/slug-like
    if (path.startsWith('/news/News')) return false;
    if (/^\/news\/[A-Za-z0-9]+\/?$/.test(path)) return false;
    return true;
  });

  setPages(filtered);
};


  const fetchMonthlyViews = async (pagePath) => {
    setLoading(true);
    const encodedId = encodeURIComponent(pagePath);
    const docRef = doc(db, 'pageViews', encodedId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const monthlyViews = {};
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith("monthlyViews.")) {
          const monthKey = key.split("monthlyViews.")[1];
          monthlyViews[monthKey] = value;
        }
      });

      const currentMonth = new Date();
      const currentKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
      const prevKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()).padStart(2, '0')}`;

      const allMonths = Array.from({ length: 12 }, (_, i) => {
        const month = String(i + 1).padStart(2, '0');
        return `2025-${month}`;
      });

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

  const calculateSharePercent = async () => {
    if (!selectedPage) return;
    const snapshot = await getDocs(collection(db, 'pageViews'));
    let total = 0;
    let selected = 0;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const sum = Object.entries(data)
        .filter(([k]) => k.startsWith("monthlyViews."))
        .reduce((acc, [_, val]) => acc + val, 0);
      total += sum;
      if (decodeURIComponent(docSnap.id) === selectedPage) {
        selected = sum;
      }
    });

    const percent = total === 0 ? 0 : ((selected / total) * 100).toFixed(1);
    setPageSharePercent(percent);
  };

  const fetchAllPagesMonthlyViews = async () => {
    const snapshot = await getDocs(collection(db, 'pageViews'));
    const counts = {};
    snapshot.forEach(docSnap => {
      const page = decodeURIComponent(docSnap.id);
      const data = docSnap.data();
      const views = data?.[`monthlyViews.${selectedYear}-${selectedMonth}`] || 0;
      if (views > 0) counts[page] = views;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const chartData = Object.entries(counts).map(([page, value]) => ({
      name: page,
      value,
      percent: ((value / total) * 100).toFixed(1)
    }));

    setAllViewsData(chartData);
  };

  useEffect(() => {
    fetchUniquePages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchMonthlyViews(selectedPage);
      calculateSharePercent();
    }
  }, [selectedPage]);

  return (
    <Box sx={{ p: 4, direction: 'rtl', textAlign: 'right' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button
          onClick={handleExportPDF}
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          sx={{
            borderRadius: '999px',
            borderColor: '#004080',
            color: '#004080',
            px: 3,
            fontWeight: 'bold'
          }}
        >
          تصدير كملف PDF
        </Button>
      </Box>

      {/* 🟦 Start Export Area */}
      <Box ref={exportRef}>
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
      {LABEL_MAP[p] || decodeURIComponent(p)}
    </MenuItem>
  ))}
</Select>

        </FormControl>

        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ResponsiveContainer width="50%" height={400}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="views" stroke="#0077cc" fill="#0077cc" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>

            <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', pr: 10, ml: 20 }}>
              <Typography variant="h6">نسبة مشاهدات هذه الصفحة</Typography>
              <PieChart width={200} height={200}>
                <Pie
                  data={[
                    { name: 'current', value: parseFloat(pageSharePercent) },
                    { name: 'others', value: 100 - parseFloat(pageSharePercent) }
                  ]}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={2}
                  cx="50%"
                  cy="50%"
                  dataKey="value"
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#e0e0e0" />
                </Pie>
              </PieChart>
              <Typography variant="h5" sx={{ mt: -15, fontWeight: 'bold' }}>{pageSharePercent}%</Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>🎯 تحليل حسب الشهر لجميع الصفحات</Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl>
              <InputLabel>السنة</InputLabel>
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} label="السنة">
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>الشهر</InputLabel>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} label="الشهر">
                <MenuItem value="01">يناير</MenuItem>
                <MenuItem value="02">فبراير</MenuItem>
                <MenuItem value="03">مارس</MenuItem>
                <MenuItem value="04">أبريل</MenuItem>
                <MenuItem value="05">مايو</MenuItem>
                <MenuItem value="06">يونيو</MenuItem>
                <MenuItem value="07">يوليو</MenuItem>
                <MenuItem value="08">أغسطس</MenuItem>
                <MenuItem value="09">سبتمبر</MenuItem>
                <MenuItem value="10">أكتوبر</MenuItem>
                <MenuItem value="11">نوفمبر</MenuItem>
                <MenuItem value="12">ديسمبر</MenuItem>
              </Select>
            </FormControl>

            <Button onClick={fetchAllPagesMonthlyViews} variant="contained" color="primary">
              عرض النتائج
            </Button>
          </Box>

          {allViewsData.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>🔶 الصفحات:</Typography>
                {allViewsData.map((entry, index) => (
                  <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '4px',
                      backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                      mr: 1
                    }} />
                    <Typography>{LABEL_MAP[entry.name] || decodeURIComponent(entry.name)}</Typography>
                  </Box>
                ))}
              </Box>

              <PieChart width={400} height={400}>
                <Pie
                  data={allViewsData}
                  dataKey="value"
                  nameKey="name"
                  cx="45%"
                  cy="50%"
                  outerRadius={150}
                >
                  {allViewsData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} مشاهدة`, LABEL_MAP[name] || decodeURIComponent(name)]} />
              </PieChart>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}