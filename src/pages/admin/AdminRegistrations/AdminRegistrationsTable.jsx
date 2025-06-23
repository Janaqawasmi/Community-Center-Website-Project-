// AdminRegistrationsTable.jsx
// مكون عام لعرض جداول التسجيلات (دورات أو فعاليات) مع الفلاتر والبحث والتعديل والعرض

import React, { useEffect, useState } from "react";
import { Box, TextField, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { fetchRegistrations, updateRegistration } from "./registrationService";
import { getUniqueValues, filterRegistrations } from "./filterUtils";
import EditRegistrationDialog from "./EditRegistrationDialog";
import PersonProgramsDialog from "./PersonProgramsDialog";
import { Checkbox } from "@mui/material";
import { exportRegistrationsToExcel } from "../../../utils/exportToExcel";


export default function AdminRegistrationsTable({ collectionName, label }) {
  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [classNumber, setClassNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [showPersonPrograms, setShowPersonPrograms] = useState(false);
  const [personPrograms, setPersonPrograms] = useState([]);
  const [selectedPersonName, setSelectedPersonName] = useState("");
  const [paidOnly, setPaidOnly] = useState(null); // null=الكل, true=مدفوع, false=غير مدفوع


  useEffect(() => {
    (async () => {
      const data = await fetchRegistrations(collectionName);
      setRegistrations(data);
    })();
  }, [collectionName]);

  // استخراج القيم الفريدة
  const classNumbers = getUniqueValues(registrations, "classNumber");
  const groupNumbers = getUniqueValues(registrations, "groupNumber");

  useEffect(() => {
  setFiltered(filterRegistrations(registrations, { classNumber, groupNumber, search, paidOnly }));
}, [registrations, classNumber, groupNumber, search, paidOnly]);


  // عرض كل برامج شخص
  const handleShowPrograms = (person) => {
    const personRegs = registrations.filter(r => r.id === person.id);
    setPersonPrograms(personRegs);
    setSelectedPersonName(`${person.FirstName} ${person.lastName}`);
    setShowPersonPrograms(true);
  };

  // حفظ التعديلات
  const handleSaveEdit = async () => {
    await updateRegistration(collectionName, currentEdit);
    const data = await fetchRegistrations(collectionName);
    setRegistrations(data);
    setEditOpen(false);
  };

  return (
    <Box>

      

      <h3>{label}</h3>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        {/* فلاتر חוג وكבוצה */}
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel id="classNumber-label">חוג</InputLabel>
          <Select labelId="classNumber-label" value={classNumber} label="חוג" onChange={e => setClassNumber(e.target.value)} displayEmpty>
            <MenuItem value="">الكل</MenuItem>
            {classNumbers.map((num, idx) => (
              <MenuItem key={idx} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="groupNumber-label">קבוצה</InputLabel>
          <Select labelId="groupNumber-label" value={groupNumber} label="קבוצה" onChange={e => setGroupNumber(e.target.value)} displayEmpty>
            <MenuItem value="">الكل</MenuItem>
            {groupNumbers.map((num, idx) => (
              <MenuItem key={idx} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>


                <FormControl sx={{ minWidth: 130 }}>
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
        <TextField label="بحث..." variant="outlined" sx={{ minWidth: 220 }} onChange={e => setSearch(e.target.value)} value={search} placeholder="بحث شامل" />
        <Button variant="outlined" onClick={() => { setClassNumber(""); setGroupNumber(""); setSearch(""); }}>مسح الفلاتر</Button>


      </Box>
      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>رقم الهوية</TableCell>
              <TableCell>الاسم الشخصي</TableCell>
              <TableCell>اسم العائلة</TableCell>
              <TableCell>تاريخ الميلاد</TableCell>
              <TableCell>الإيميل</TableCell>
              <TableCell>رقم الهاتف</TableCell>
              <TableCell>اسم البرنامج</TableCell>
              <TableCell>חוג</TableCell>
              <TableCell>קבוצה</TableCell>
              <TableCell>حالة الدفع</TableCell>

              <TableCell>جميع برامجه </TableCell>
              <TableCell>تعديل</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(reg => (
              <TableRow key={reg.firebaseId}>
                <TableCell>{reg.id}</TableCell>
                <TableCell>{reg.FirstName}</TableCell>
                <TableCell>{reg.lastName}</TableCell>
                <TableCell>{reg.birthdate}</TableCell>
                <TableCell>{reg.email}</TableCell>
                <TableCell>{reg.personalPhone}</TableCell>
                <TableCell>{reg.name}</TableCell>
                <TableCell>{reg.classNumber}</TableCell>
                <TableCell>{reg.groupNumber}</TableCell>
                 <TableCell>
  <Checkbox checked={reg.paid || false} disabled />
</TableCell>

                <TableCell>
                  <Button color="info" variant="text" onClick={() => handleShowPrograms(reg)}>
                    عرض
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => { setCurrentEdit(reg); setEditOpen(true); }}>تعديل</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <EditRegistrationDialog open={editOpen} registration={currentEdit} onChange={setCurrentEdit} onSave={handleSaveEdit} onClose={() => setEditOpen(false)} />
      <PersonProgramsDialog open={showPersonPrograms} personName={selectedPersonName} programs={personPrograms} onClose={() => setShowPersonPrograms(false)} />
    </Box>
  );
}
