import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import DateRangePicker from '../layout/common/DateRangePicker';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

export default function ProgramPopularityTable() {
  const [rows, setRows] = useState([]);
  const [orderBy, setOrderBy] = useState('registrations');
  const [order, setOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState(dayjs().startOf('year'));
  const [toDate, setToDate] = useState(dayjs().endOf('year'));

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const exportAsPDF = async () => {
    const element = document.getElementById('program-popularity-table');
    if (!element) return;
    const canvas = await html2canvas(element, {
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
    pdf.save("program_popularity.pdf");
  };

  const exportAsExcel = () => {
    const excelData = filteredRows.map(row => ({
      "اسم البرنامج": row.name,
      "تاريخ البرنامج": row.startDate,
      "عدد المسجلين": row.registrations,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Programs");
    XLSX.writeFile(workbook, "program_popularity.xlsx");
  };

  useEffect(() => {
    const fetchData = async () => {
      const programsSnap = await getDocs(collection(db, 'programs'));
      const registrationsSnap = await getDocs(collection(db, 'programRegistrations'));

      const programMap = {};
      programsSnap.forEach(doc => {
        const data = doc.data();
        const startDate = data.date?.toDate?.();

        if (startDate) {
          const isAfterFrom = !fromDate || dayjs(startDate).isAfter(dayjs(fromDate).subtract(1, 'day'));
          const isBeforeTo = !toDate || dayjs(startDate).isBefore(dayjs(toDate).add(1, 'day'));

          if (isAfterFrom && isBeforeTo) {
            programMap[doc.id] = {
              name: data.name || doc.id,
              startDate: startDate,
              registrations: 0,
            };
          }
        }
      });

      registrationsSnap.forEach(doc => {
        const data = doc.data();
        const programId = data.docId;

        if (programMap[programId]) {
          programMap[programId].registrations += 1;
        }
      });

      const rowsData = Object.values(programMap).map(item => ({
        name: item.name,
        startDate: item.startDate?.toLocaleDateString('en-GB') || '',
        registrations: item.registrations,
      }));

      setRows(rowsData);
    };

    fetchData();
  }, [fromDate, toDate]);

  const filteredRows = rows
    .filter(row => row.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (orderBy === 'registrations') {
        return order === 'asc'
          ? a.registrations - b.registrations
          : b.registrations - a.registrations;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <DateRangePicker
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />
        <TextField
          size="small"
          label="ابحث حسب اسم البرنامج"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 250, mt: -4 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={exportAsPDF}
            sx={{
              px: 1,
              py: 0.5,
              border: 'none',
              backgroundColor: '#003366',
              color: 'white',
              '&:hover': { backgroundColor: '#002244' },
              whiteSpace: 'nowrap',
            }}
          >
            📄 تصدير كملف PDF
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={exportAsExcel}
            sx={{
              px: 1,
              py: 0.5,
              backgroundColor: 'green',
              border: 'none',
              color: 'white',
              '&:hover': { backgroundColor: 'darkgreen' },
              whiteSpace: 'nowrap',
            }}
          >
            📊 تصدير كملف Excel
          </Button>
        </Box>
      </Box>

      <Paper id="program-popularity-table">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  اسم البرنامج
                </TableSortLabel>
              </TableCell>
              <TableCell>تاريخ البرنامج</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'registrations'}
                  direction={orderBy === 'registrations' ? order : 'desc'}
                  onClick={() => handleSort('registrations')}
                >
                  عدد المسجلين
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell align="right">{row.registrations}</TableCell>
              </TableRow>
            ))}
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  لا توجد بيانات للعرض
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
