//src/components/Data Analysis/AdminAnalytics.jsx
import { useEffect, useState } from "react";
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
  Button ,
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
  Legend
} from "recharts";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bfff", "#8a2be2"];

export default function PageViewsStats() {
  const [pageViews, setPageViews] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPageViews() {
      const snapshot = await getDocs(collection(db, "pageViews"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPageViews(data);
    }
    fetchPageViews();
  }, []);

  const filteredViews = pageViews.filter((page) => {
    const readablePath = page.path
      ? decodeURIComponent(page.path)
      : "/" + decodeURIComponent(page.id);
    return readablePath.toLowerCase().includes(search.toLowerCase());
  });
const sortedViews = [...filteredViews].sort((a, b) => b.viewCount - a.viewCount);
const [pathTitleMap, setPathTitleMap] = useState({});

useEffect(() => {
  const fetchTitles = async () => {
    const snapshot = await getDocs(collection(db, "News"));
    const map = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      const path = `/news/${doc.id}`;
      const title = data.title || "عنوان غير معروف";
      map[path] = `/news/${title}`; // ✅ remove doc.id, keep only title
    });
    setPathTitleMap(map);
  };
  fetchTitles();
}, []);
// Create a ref to hold the combined chart container
const combinedChartRef = useRef(null);

const exportCombinedChartsAsPDF = async () => {
  if (!combinedChartRef.current) return;

  const canvas = await html2canvas(combinedChartRef.current, { backgroundColor: "#fff", scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height]
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
    borderRadius: "0px",
    px: 3,
    py: 1.3,
    fontSize: "1rem",
    fontWeight: "bold",
    mb: 3,
    '&:hover': {
      backgroundColor: "rgb(50, 127, 214)",
      color: "white",
},
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    direction: "rtl",
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
                <Typography variant="h6" sx={{ mb: 2 }}>
                    🔍 أكثر الصفحات مشاهدة (Top Pages)
                </Typography>

                <ResponsiveContainer width="100%" height={300}>
                   <BarChart data={sortedViews.slice(0, 10)} 
                   layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                        <XAxis type="number" />
                   <YAxis
  type="category"
  dataKey="path"
  interval={0}
  tick={{
    fontSize: 13,
    textAnchor: "start",
    dx: -10,
  }}
  tickFormatter={(value) =>
    pathTitleMap[value] ? pathTitleMap[value] : decodeURIComponent(value)
  }
  width={200}
/>

                        <ReTooltip  />
                        <Bar dataKey="viewCount" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
{/* 🥧 Pie chart visualization: View Distribution */}
<Box sx={{ mt: 4 }}>
  <Typography variant="h6" sx={{ mb: 2 }}>
    🥧 توزيع المشاهدات (View Distribution)
  </Typography>
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
{/* ✅ This shows the readable label and views on hover */}
  <ReTooltip
  formatter={(value, name, props) => {
    const total = sortedViews.slice(0, 6).reduce((sum, entry) => sum + entry.viewCount, 0);
    const percent = ((value / total) * 100).toFixed(1);
    const label = pathTitleMap[name] || decodeURIComponent(name);
    return [`${value} مشاهدات (${percent}%)`, label];
  }}
/>

    <Legend
  formatter={(value) =>
    pathTitleMap[value] ? pathTitleMap[value] : decodeURIComponent(value)
  }
      />
    </PieChart>
  </ResponsiveContainer>
</Box>
</Box>

            </>
        )}

<TableContainer component={Paper} sx={{ mt: 4, borderRadius: 2, boxShadow: 2 }}>
  <Table>
    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
      <TableRow>
        <TableCell sx={{ width: 50 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            #
          </Typography>
        </TableCell>
        <TableCell sx={{ minWidth: 300 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            المسار
          </Typography>
        </TableCell>
        <TableCell align="right" sx={{ minWidth: 120 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            عدد المشاهدات
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {sortedViews.map((page, index) => {
  const decodedPath = page.path
  ? pathTitleMap[page.path] || decodeURIComponent(page.path)
  : "/" + decodeURIComponent(page.id);

        return (
          <TableRow
            key={page.id}
            sx={{
              backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <TableCell>
              <Typography variant="body2" fontWeight="medium">
                {index + 1}
              </Typography>
            </TableCell>
            <TableCell>
              <Tooltip title={decodedPath}>
                <Typography variant="body2" noWrap>
                  {decodedPath}
                </Typography>
              </Tooltip>
            </TableCell>
            <TableCell align="right">
              <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
                {page.viewCount}
              </Typography>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
</TableContainer>


    </Box>
);
}
