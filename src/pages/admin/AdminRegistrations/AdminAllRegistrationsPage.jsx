// AdminAllRegistrationsPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Paper, Checkbox, Button, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { fetchRegistrations } from "./registrationService";
import { filterRegistrations } from "./filterUtils";
import { exportRegistrationsToExcel } from "../../../utils/exportToExcel"; // تأكد من المسار

export default function AdminAllRegistrationsPage() {
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [paidOnly, setPaidOnly] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]); // مصفوفة الفعليين المختارين

  // جلب كل التسجيلات
  useEffect(() => {
    (async () => {
      const programs = await fetchRegistrations("programRegistrations");
      const events = await fetchRegistrations("eventRegistrations");
      // أضف نوع لكل سجل للتمييز
      const withType = [
        ...programs.map(r => ({ ...r, _type: "دورة" })),
        ...events.map(r => ({ ...r, _type: "فعالية" }))
      ];
      setAll(withType);
    })();
  }, []);

  // فلترة
  useEffect(() => {
    setFiltered(
      filterRegistrations(all, { classNumber: "", groupNumber: "", search, paidOnly })
    );
    setSelected([]); // كلما تغيرت الفلترة، الغِ التحديد
  }, [all, search, paidOnly]);

  // اختيار يدوي
  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? filtered.map(r => r.firebaseId) : []);
  };
  const handleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // بيانات للتصدير
  const exportData = filtered.filter(r => selected.length === 0 || selected.includes(r.firebaseId));

  return (
    <Box sx={{ p: 4 }}>
      <h2>كل التسجيلات (دورات وفعاليات)</h2>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="paid-label">حالة الدفع</InputLabel>
          <Select
            labelId="paid-label"
            value={paidOnly === null ? "" : paidOnly ? "paid" : "unpaid"}
            label="حالة الدفع"
            onChange={e => {
              if (e.target.value === "") setPaidOnly(null);
              else setPaidOnly(e.target.value === "paid");
            }}
            displayEmpty
          >
            <MenuItem value="">الكل</MenuItem>
            <MenuItem value="paid">مدفوع</MenuItem>
            <MenuItem value="unpaid">غير مدفوع</MenuItem>
          </Select>
        </FormControl>
        <TextField label="بحث..." value={search} onChange={e => setSearch(e.target.value)} sx={{ minWidth: 180 }} />
        <Button variant="contained" color="success" onClick={() => exportRegistrationsToExcel(exportData)}>
          تصدير المحدد إلى Excel
        </Button>
      </Box>
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
              <TableCell>نوع التسجيل</TableCell>
              <TableCell>رقم الهوية</TableCell>
              <TableCell>الاسم الشخصي</TableCell>
              <TableCell>اسم العائلة</TableCell>
              <TableCell>الإيميل</TableCell>
              <TableCell>رقم الهاتف</TableCell>
              <TableCell>اسم البرنامج/الفعالية</TableCell>
              <TableCell>حالة الدفع</TableCell>
              {/* ...أي أعمدة أخرى */}
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
                <TableCell>{reg._type}</TableCell>
                <TableCell>{reg.id}</TableCell>
                <TableCell>{reg.FirstName}</TableCell>
                <TableCell>{reg.lastName}</TableCell>
                <TableCell>{reg.email}</TableCell>
                <TableCell>{reg.personalPhone}</TableCell>
                <TableCell>{reg.name}</TableCell>
                <TableCell>
                  <Checkbox checked={reg.paid || false} disabled />
                </TableCell>
                {/* ... */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
