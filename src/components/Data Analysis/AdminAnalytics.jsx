// src/components/Data Analysis/AdminAnalytics.jsx
import { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TableContainer,
  Paper,
  Tooltip,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dayjs from "dayjs";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bfff", "#8a2be2"];

export default function PageViewsStats() {
  const [pageViews, setPageViews] = useState([]);
  const [monthlyViews, setMonthlyViews] = useState([]);
  const [search, setSearch] = useState("");
  const [pathTitleMap, setPathTitleMap] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const combinedChartRef = useRef(null);

  useEffect(() => {
    async function fetchPageViews() {
      const snapshot = await getDocs(collection(db, "pageViews"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPageViews(data);
    }

    async function fetchMonthlyViews() {
      const snapshot = await getDocs(collection(db, "monthlyPageViews"));
      const data = snapshot.docs.map((doc) => doc.data());
      setMonthlyViews(data);
    }

    fetchPageViews();
    fetchMonthlyViews();
  }, []);

  useEffect(() => {
    const fetchTitles = async () => {
      const snapshot = await getDocs(collection(db, "News"));
      const map = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const path = `/news/${doc.id}`;
        const title = data.title || "عنوان غير معروف";
        map[path] = `/news/${title}`;
      });
      setPathTitleMap(map);
    };
    fetchTitles();
  }, []);

  const filteredViews = pageViews.filter((page) => {
    const readablePath = page.path ? decodeURIComponent(page.path) : "/" + decodeURIComponent(page.id);
    return readablePath.toLowerCase().includes(search.toLowerCase());
  });

  const sortedViews = [...filteredViews].sort((a, b) => b.viewCount - a.viewCount);

  const filteredByMonthYear = monthlyViews.filter((item) => {
    const [year, month] = item.month.split("-");
    return (
      (!selectedYear || selectedYear === year) &&
      (!selectedMonth || selectedMonth === month)
    );
  });

  const groupedByPath = filteredByMonthYear.reduce((acc, curr) => {
    acc[curr.path] = (acc[curr.path] || 0) + curr.viewCount;
    return acc;
  }, {});

  const chartData = Object.entries(groupedByPath).map(([path, viewCount]) => ({
    path,
    viewCount,
  }));

  const exportCombinedChartsAsPDF = async () => {
    if (!combinedChartRef.current) return;

    const canvas = await html2canvas(combinedChartRef.current, { backgroundColor: "#fff", scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("charts.pdf");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="outlined"
        onClick={exportCombinedChartsAsPDF}
        sx={{
          borderRadius: "30px",
          px: 3,
          py: 1.3,
          fontSize: "1rem",
          fontWeight: "bold",
          color: "#003366",
          borderColor: "#003366",
          mb: 3,
          '&:hover': {
            backgroundColor: "#003366",
            color: "#fff",
          },
        }}
      >
        📄 تصدير كملف PDF
      </Button>

      <TextField
        label="ابحث عن مسار..."
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      {filteredViews.length > 0 && (
        <>
          <Box ref={combinedChartRef}>
            <Typography variant="h6" sx={{ mb: 2 }}>📅 مشاهدات الصفحات حسب الشهر والسنة</Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>اختر السنة</InputLabel>
                <Select value={selectedYear} label="اختر السنة" onChange={(e) => setSelectedYear(e.target.value)}>
                  <MenuItem value="">الكل</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>اختر الشهر</InputLabel>
                <Select value={selectedMonth} label="اختر الشهر" onChange={(e) => setSelectedMonth(e.target.value)}>
                  <MenuItem value="">الكل</MenuItem>
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthNumber = String(i + 1).padStart(2, "0");
                    return (
                      <MenuItem key={monthNumber} value={monthNumber}>
                        {dayjs().month(i).format("MMMM")}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button variant="outlined" color="error" onClick={() => { setSelectedMonth(""); setSelectedYear(""); }}>إعادة تعيين</Button>
            </Box>
{chartData.length > 0 ? (
  <>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
        <XAxis type="number" />
        <YAxis
          dataKey="path"
          type="category"
          width={200}
          tickFormatter={(value) => pathTitleMap[value] || decodeURIComponent(value)}
        />
        <ReTooltip />
        <Bar dataKey="viewCount" fill="#00bcd4" />
      </BarChart>
    </ResponsiveContainer>

    {/* ✅ NEW Monthly Pie Chart */}
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        🥧 توزيع المشاهدات حسب الشهر المختار
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="viewCount"
            nameKey="path"
            outerRadius={100}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-month-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ReTooltip
            formatter={(value, name) => {
              const total = chartData.reduce((sum, entry) => sum + entry.viewCount, 0);
              const percent = ((value / total) * 100).toFixed(1);
              const label = pathTitleMap[name] || decodeURIComponent(name);
              return [`${value} مشاهدات (${percent}%)`, label];
            }}
          />
          <Legend
            formatter={(value) => pathTitleMap[value] || decodeURIComponent(value)}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  </>
) : (
  <Typography sx={{ mt: 2 }}>لا توجد بيانات لهذا الشهر والسنة.</Typography>
)}

            <Typography variant="h6" sx={{ mt: 6, mb: 2 }}>🔍 أكثر الصفحات مشاهدة (Top Pages)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sortedViews.slice(0, 10)} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="path"
                  interval={0}
                  tick={{ fontSize: 13, textAnchor: "start", dx: -10 }}
                  tickFormatter={(value) => pathTitleMap[value] || decodeURIComponent(value)}
                  width={200}
                />
                <ReTooltip />
                <Bar dataKey="viewCount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>🥧 توزيع المشاهدات (View Distribution)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sortedViews.slice(0, 6)}
                    dataKey="viewCount"
                    nameKey="path"
                    outerRadius={100}
                    labelLine={false}
                  >
                    {sortedViews.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip
                    formatter={(value, name) => {
                      const total = sortedViews.slice(0, 6).reduce((sum, entry) => sum + entry.viewCount, 0);
                      const percent = ((value / total) * 100).toFixed(1);
                      const label = pathTitleMap[name] || decodeURIComponent(name);
                      return [`${value} مشاهدات (${percent}%)`, label];
                    }}
                  />
                  <Legend
                    formatter={(value) => pathTitleMap[value] || decodeURIComponent(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 2, boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ width: 50 }}>
                    <Typography variant="subtitle2" fontWeight="bold">#</Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 300 }}>
                    <Typography variant="subtitle2" fontWeight="bold">المسار</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ minWidth: 120 }}>
                    <Typography variant="subtitle2" fontWeight="bold">عدد المشاهدات</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedViews.map((page, index) => {
                  const decodedPath = page.path ? pathTitleMap[page.path] || decodeURIComponent(page.path) : "/" + decodeURIComponent(page.id);
                  return (
                    <TableRow
                      key={page.id}
                      sx={{ backgroundColor: index % 2 === 0 ? "#fafafa" : "white", "&:hover": { backgroundColor: "#f0f0f0" } }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">{index + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={decodedPath}>
                          <Typography variant="body2" noWrap>{decodedPath}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontFamily="monospace" fontWeight="medium">{page.viewCount}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
} 
