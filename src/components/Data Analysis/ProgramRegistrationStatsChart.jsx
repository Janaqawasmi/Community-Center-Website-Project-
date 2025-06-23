//src/components/Data Analysis/ProgramRegistrationStatsChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import DateRangePicker from '../layout/common/DateRangePicker';
import dayjs from 'dayjs';
import { Box, Typography, MenuItem, Select, FormControl, InputLabel,Button  } from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';

const COLORS = ['#003366', '#b67bb2'];

export default function ProgramStatsChart() {
  const startOfYear = dayjs().startOf('year');
  const endOfYear = dayjs().endOf('year');

  const [fromDate, setFromDate] = useState(startOfYear);
  const [toDate, setToDate] = useState(endOfYear);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState([]);
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });

  useEffect(() => {
    const fetchMetadata = async () => {
      const programsSnapshot = await getDocs(collection(db, 'programs'));
      const categorySet = new Set();
      programsSnapshot.forEach(doc => {
        const category = doc.data().category;
        if (Array.isArray(category)) category.forEach(cat => categorySet.add(cat));
        else if (category) categorySet.add(category);
      });
      setCategories([...categorySet]);
    };

    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const programsSnapshot = await getDocs(collection(db, 'programs'));
        const filteredProgramIds = [];
        const programMap = {};

        programsSnapshot.forEach(doc => {
          const data = doc.data();
          const startDate = data.startDate?.toDate?.();
          const matchesCategory = !selectedCategory || (Array.isArray(data.category) && data.category.includes(selectedCategory));

          if (startDate && startDate >= fromDate.toDate() && startDate <= toDate.toDate() && matchesCategory) {
            filteredProgramIds.push(doc.id);
            programMap[doc.id] = {
              name: data.name || doc.id,
              startDate: startDate.toLocaleDateString('en-GB') || '',
            };
          }
        });

        const regSnapshot = await getDocs(collection(db, 'programRegistrations'));
        const counts = {};
        let male = 0, female = 0;

regSnapshot.forEach(doc => {
  const data = doc.data();
  const programId = data.programId;

  if (filteredProgramIds.includes(programId)) {
    if (!counts[programId]) {
      counts[programId] = { registrations: 0, male: 0, female: 0 };
    }

    counts[programId].registrations += 1;

    if (data.gender === 'זכר') {
      counts[programId].male += 1;
      male += 1;
    } else if (data.gender === 'נקבה') {
      counts[programId].female += 1;
      female += 1;
    }
  }
});

const formatted = Object.entries(counts)
  .map(([id, data]) => ({
    name: programMap[id]?.name || id,
    startDate: programMap[id]?.startDate || '',
    registrations: data.registrations,
    male: data.male,
    female: data.female
  }))
  .sort((a, b) => b.registrations - a.registrations)
  .slice(0, 10);


        setStats(formatted);
        setGenderCounts({ male, female });
      } catch (err) {
        console.error('Error fetching stats:', err.message);
      }
    };

    if (fromDate && toDate) fetchData();
  }, [fromDate, toDate, selectedCategory]);

  const genderChartData = [
    { name: 'ذكر', value: genderCounts.male },
    { name: 'أنثى', value: genderCounts.female }
  ];
const totalParticipants = genderCounts.male + genderCounts.female;
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
    <Box dir="rtl">
      <Button
  variant="outlined"
  onClick={exportCombinedChartsAsPDF}
  sx={{
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
      <Box display="flex" flexWrap="wrap" gap={2} mb={2} justifyContent="center">
       
        <DateRangePicker
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="category-select-label">الفئة</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            label="التصنيف"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">الكل</MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box ref={combinedChartRef}  sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <Box sx={{ width: '100%', maxWidth: 700, minHeight: 400 }} dir="ltr">
          {stats.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ mt: 8 }}>
              لا توجد بيانات لعرضها ضمن الفترة أو الفلاتر المحددة.
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(400, stats.length * 50)}>
       <BarChart
  data={stats}
  layout="vertical"
  margin={{ top: 10, right: 200, left: 0, bottom: 10 }}
  barCategoryGap={10}
>
  <XAxis type="number" allowDecimals={false} />
  <YAxis
    dataKey="name"
    type="category"
    width={250}
    tickFormatter={(value, index) => {
      const program = stats[index];
      return `${value} (${program.startDate})`;
    }}
    tick={{ fontSize: 14 }}
  />
  <Tooltip
    formatter={(value, name) => [`${value} ${name === 'ذكور' ? 'ذكر' : 'أنثى'}`, 'عدد المشاركين']}
    labelFormatter={(label, props) => {
      const program = props?.[0]?.payload;
      return program ? `${program.name} - ${program.startDate}` : label;
    }}
    wrapperStyle={{ direction: 'rtl' }}
  />
  <Bar dataKey="male" stackId="a" fill="#003366" name="ذكور" />
  <Bar dataKey="female" stackId="a" fill="#b67bb2" name="إناث" />
  <Bar dataKey="registrations" stackId="a" fill="transparent">
    <LabelList dataKey="registrations" position="right" formatter={(value) => `${value} مشارك`} />
  </Bar>
</BarChart>


            </ResponsiveContainer>
          )}
        </Box>

        <Box sx={{ width: 300, height: 300, mt: 5 }}>
          <ResponsiveContainer width="100%" height="100%">
         <PieChart>
  <Pie
    data={genderChartData}
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={100}
    fill="#8884d8"
    paddingAngle={3}
    dataKey="value"
  >
    {genderChartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Legend />
<Tooltip 
  formatter={(value) => {
    const percent = totalParticipants > 0 ? ((value / totalParticipants) * 100).toFixed(1) : 0;
    return [`${percent}%`, 'النسبة'];
  }} 
/>
</PieChart>

          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}
