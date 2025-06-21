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

return (
    <Box sx={{ p: 3 }}>

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
                <Typography variant="h6" sx={{ mb: 2 }}>
                    🔍 أكثر الصفحات مشاهدة (Top Pages)
                </Typography>

                <ResponsiveContainer width="100%" height={300}>
                   <BarChart data={sortedViews.slice(0, 10)} 
                   layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="path"    interval={0} // ✅ Force showing all labels
tick={{ fontSize: 13, textAnchor:'start', dx: -10 }} 
                        tickFormatter={(value) => decodeURIComponent(value)} width={200} />
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
      <Tooltip
        formatter={(value, name) =>
          [`${value} مشاهدات`, decodeURIComponent(name)]
        }
      />
      <Legend
        formatter={(value) => decodeURIComponent(value)}
      />
    </PieChart>
  </ResponsiveContainer>
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
          ? decodeURIComponent(page.path)
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
