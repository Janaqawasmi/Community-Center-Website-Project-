// src/components/Data Analysis/ProgramRegistrationsOverTimeChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import dayjs from 'dayjs';
import { Typography, Box, Button } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DateRangePicker from '../layout/common/DateRangePicker';

export default function ProgramRegistrationsOverTimeChart() {
  const [data, setData] = useState([]);

  const chartRef = useRef(null);
const [fromDate, setFromDate] = useState(null);
const [toDate, setToDate] = useState(null);

  const exportChartAsPDF = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: "#fff",
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("trend_chart.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      const regSnapshot = await getDocs(collection(db, 'programRegistrations'));

      const counts = {};

      regSnapshot.forEach((doc) => {
        const data = doc.data();
        const regDateStr = data.registrationDate;

        if (regDateStr) {
          const date = dayjs(regDateStr, "DD/MM/YYYY, HH:mm");

          if (date.isValid()) {
            const isAfterFrom =
              !fromDate || date.isAfter(dayjs(fromDate).subtract(1, 'day'));
            const isBeforeTo =
              !toDate || date.isBefore(dayjs(toDate).add(1, 'day'));

            if (isAfterFrom && isBeforeTo) {
              const month = date.format("YYYY-MM");
              counts[month] = (counts[month] || 0) + 1;
            }
          }
        }
      });

      const chartData = Object.entries(counts)
        .map(([month, count]) => ({
          month,
          count,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      setData(chartData);
    };

    fetchData();
  }, [fromDate, toDate]);

  return (
<Box>
  <Box
    sx={{
      mb: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2,
      direction: 'rtl',
    }}
  >
    <DateRangePicker
      fromDate={fromDate}
      toDate={toDate}
      setFromDate={setFromDate}
      setToDate={setToDate}
    />

    <Button
      variant="outlined"
      size="small"
      onClick={exportChartAsPDF}
      sx={{
        mt: { xs: 0, sm: -4 },
         ml: 20,
        px: 1,
            py: 0.5,
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
            backgroundColor: '#003366',
        border: 'none',
        color: "white",
        '&:hover': {
           backgroundColor: ' #002244',
          color: "white",
          border: 'none',
        },
      }}
    >
      📄 تصدير كملف PDF
    </Button>
  </Box>

  <Box
    ref={chartRef}
    sx={{ width: '100%', height: 400 }}
  >
    {data.length === 0 ? (
      <Typography sx={{ mt: 4 }} align="center" color="text.secondary">
        لا توجد بيانات لعرضها
      </Typography>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(value) => `${value} تسجيل`} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#b67bb2"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    )}
  </Box>
</Box>

  );
}
