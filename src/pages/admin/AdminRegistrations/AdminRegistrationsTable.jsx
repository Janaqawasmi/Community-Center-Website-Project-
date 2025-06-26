import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { fetchRegistrations } from "./registrationService";
import { filterRegistrations } from "./filterUtils";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../components/firebase.js";

export default function AdminRegistrationsTable({ collectionName, label, archivedOnly }) {
  // حالات البيانات والفلترة
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [classNumber, setClassNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [paidOnly, setPaidOnly] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  // جلب التسجيلات من الكوليكشن المحدد
  useEffect(() => {
    (async () => {
      const regs = await fetchRegistrations(collectionName);
      setData(regs.map(r => ({ ...r, archived: r.archived ?? false })));
    })();
  }, [collectionName]);

  // جلب قيم الفلاتر (classNumber, groupNumber) من كولكشنات التعريف: programs أو Events
  useEffect(() => {
    (async () => {
      const defColl = collectionName.includes("program")
        ? "programs"
        : "Events";
      const snap = await getDocs(collection(db, defColl));
      const classes = new Set();
      const groups = new Set();
      snap.forEach(docSnap => {
        const d = docSnap.data();
        if (d.classNumber != null) classes.add(d.classNumber);
        if (d.groupNumber != null) groups.add(d.groupNumber);
      });
      setClassOptions([...classes]);
      setGroupOptions([...groups]);
    })();
  }, [collectionName]);

  // تطبيق الفلاتر عند تغيّر أي قيمة
  useEffect(() => {
    setFiltered(
      filterRegistrations(data, {
        classNumber,
        groupNumber,
        search,
        paidOnly,
        archivedOnly,
      })
    );
    setSelected([]);
  }, [data, classNumber, groupNumber, search, paidOnly, archivedOnly]);

  // إدارة اختيار الصفوف
  const handleSelectAll = e =>
    setSelected(e.target.checked ? filtered.map(r => r.firebaseId) : []);

  const handleSelect = id =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  return (
    <Box>
      {/* عنوان الجدول */}
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>

      {/* صندوق الفلترة */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* فلتر رقم الدورة */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="class-label">رقم الدورة</InputLabel>
          <Select
            labelId="class-label"
            label="رقم الدورة"
            value={classNumber}
            onChange={e => setClassNumber(e.target.value)}
          >
            <MenuItem value="">الكل</MenuItem>
            {classOptions.map(num => (
              <MenuItem key={num} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* فلتر رقم المجموعة */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="group-label">رقم المجموعة</InputLabel>
          <Select
            labelId="group-label"
            label="رقم المجموعة"
            value={groupNumber}
            onChange={e => setGroupNumber(e.target.value)}
          >
            <MenuItem value="">الكل</MenuItem>
            {groupOptions.map(num => (
              <MenuItem key={num} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* فلتر حالة الدفع */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="paid-label">حالة الدفع</InputLabel>
          <Select
            labelId="paid-label"
            label="حالة الدفع"
            value={paidOnly === null ? '' : paidOnly ? 'paid' : 'unpaid'}
            onChange={e =>
              setPaidOnly(
                e.target.value === '' ? null : e.target.value === 'paid'
              )
            }
          >
            <MenuItem value="">الكل</MenuItem>
            <MenuItem value="paid">مدفوع</MenuItem>
            <MenuItem value="unpaid">غير مدفوع</MenuItem>
          </Select>
        </FormControl>

        {/* حقل البحث */}
        <TextField
          size="small"
          label="بحث..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
      </Box>

      {/* جدول التسجيلات */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={filtered.length > 0 && selected.length === filtered.length}
                  indeterminate={selected.length > 0 && selected.length < filtered.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>رقم الهوية</TableCell>
              <TableCell>الاسم الشخصي</TableCell>
              <TableCell>اسم العائلة</TableCell>
              <TableCell>رقم الهاتف</TableCell>
              <TableCell>رقم الدورة</TableCell>
              <TableCell>رقم المجموعة</TableCell>
              <TableCell>سجل ل:</TableCell>
              <TableCell> تاريخ التسجيل</TableCell>


              <TableCell>حالة الدفع</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(reg => (
              <TableRow key={reg.firebaseId} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(reg.firebaseId)}
                    onChange={() => handleSelect(reg.firebaseId)}
                  />
                </TableCell>
                <TableCell>{reg.id}</TableCell>
                <TableCell>{reg.FirstName}</TableCell>
                <TableCell>{reg.lastName}</TableCell>
                <TableCell>{reg.personalPhone}</TableCell>
                <TableCell>{reg.classNumber}</TableCell>
                <TableCell>{reg.groupNumber}</TableCell>
                <TableCell>{reg.name}</TableCell>
                <TableCell>{reg.registrationDate}</TableCell>


                <TableCell>
                  <Checkbox checked={!!reg.paid} disabled />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
