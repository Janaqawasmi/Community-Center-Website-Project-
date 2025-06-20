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
import { Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

function useProgramRegistrationStats(fromDate, toDate, selectedCategory) {
  const [stats, setStats] = useState([]);

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

          if (
            startDate &&
            startDate >= fromDate.toDate() &&
            startDate <= toDate.toDate() &&
            matchesCategory
          ) {
            filteredProgramIds.push(doc.id);
            programMap[doc.id] = {
            name: data.name || doc.id,
            startDate: startDate?.toLocaleDateString('en-GB') || '', // Format: DD/MM/YYYY
           };
          }
        });

        const regSnapshot = await getDocs(collection(db, 'programRegistrations'));
        const counts = {};

        regSnapshot.forEach(doc => {
          const data = doc.data();
          const programId = data.programId;

          if (filteredProgramIds.includes(programId)) {
            counts[programId] = (counts[programId] || 0) + 1;
          }
        });

   const formatted = Object.entries(counts).map(([id, count]) => ({
  name: programMap[id]?.name || id,
  startDate: programMap[id]?.startDate || '',
  registrations: count,
})).sort((a, b) => b.registrations - a.registrations);

        setStats(formatted);
      } catch (err) {
        console.error('Error fetching filtered stats', err.message);
      }
    };

    if (fromDate && toDate) {
      fetchData();
    }
  }, [fromDate, toDate, selectedCategory]);

  return stats;
}

export default function ProgramStatsChart() {
  const startOfYear = dayjs().startOf('year');
  const endOfYear = dayjs().endOf('year');

  const [fromDate, setFromDate] = useState(startOfYear);
  const [toDate, setToDate] = useState(endOfYear);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const programsSnapshot = await getDocs(collection(db, 'programs'));
        const categorySet = new Set();
        programsSnapshot.forEach(doc => {
          const category = doc.data().category;
          if (Array.isArray(category)) {
            category.forEach(cat => categorySet.add(cat));
          } else if (category) {
            categorySet.add(category);
          }
        });
        setCategories([...categorySet]);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };

    fetchMetadata();
  }, []);

  const stats = useProgramRegistrationStats(fromDate, toDate, selectedCategory);

  return (
    <Box dir="rtl">
      <Box display="flex" flexWrap="wrap" gap={2} mb={2}  justifyContent="center">
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

      <Box sx={{ width: '100%', minHeight: 400, display: 'flex', justifyContent: 'center' }} dir="ltr">
        {stats.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ mt: 8 }}>
            لا توجد بيانات لعرضها ضمن الفترة أو الفلاتر المحددة.
          </Typography>
        ) : (
          <ResponsiveContainer width="90%" height={Math.max(400, stats.length * 50)}>
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
  formatter={(value) => [`${value} مسجل`, 'عدد المسجلين']}
  labelFormatter={(label, props) => {
    const program = props?.[0]?.payload;
    return program ? `${program.name} - ${program.startDate}` : label;
  }}
  wrapperStyle={{ direction: 'rtl' }}
/>

              <Bar dataKey="registrations" fill="#003366" radius={[0, 8, 8, 0]}>
                <LabelList dataKey="registrations" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
}
