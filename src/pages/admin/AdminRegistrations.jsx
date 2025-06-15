import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../components/firebase";
import {
  Box, TextField, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";

export default function AdminProgramRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [programName, setProgramName] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [generalSearch, setGeneralSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // خاصية إظهار كل الدورات لشخص
  const [showPersonPrograms, setShowPersonPrograms] = useState(false);
  const [personRegistrations, setPersonRegistrations] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");

  // جلب كل التسجيلات من قاعدة البيانات
  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "programRegistrations"));
    const data = snapshot.docs.map(doc => ({
      firebaseId: doc.id, // هذا هو Document ID الفعلي
      ...doc.data()
    }));
    setRegistrations(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // استخراج القيم الفريدة للفلترة
  const programNames = [...new Set(registrations.map(r => r.programName).filter(Boolean))];
  const classNumbers = [...new Set(registrations.map(r => r.classNumber).filter(Boolean))];
  const groupNumbers = [...new Set(registrations.map(r => r.groupNumber).filter(Boolean))];

  // فلترة حسب الفلاتر والبحث
  useEffect(() => {
    let data = registrations;
    if (programName) data = data.filter(r => r.programName === programName);
    if (classNumber) data = data.filter(r => r.classNumber?.toString() === classNumber.toString());
    if (groupNumber) data = data.filter(r => r.groupNumber?.toString() === groupNumber.toString());

    if (generalSearch.trim()) {
      const q = generalSearch.trim().toLowerCase();
      data = data.filter(r =>
        (r.FirstName && r.FirstName.toLowerCase().includes(q)) ||
        (r.lastName && r.lastName.toLowerCase().includes(q)) ||
        (r.fatherName && r.fatherName.toLowerCase().includes(q)) ||
        (r.id && r.id.toString().includes(q)) ||
        (r.fatherId && r.fatherId.toString().includes(q))
      );
    }
    setFiltered(data);
  }, [programName, classNumber, groupNumber, generalSearch, registrations]);

  // فتح نافذة التعديل
  const handleEditClick = (registration) => {
    setCurrentEdit({ ...registration });
    setEditOpen(true);
  };

  // حفظ التعديلات مع إعادة تحميل البيانات
  const handleSaveEdit = async () => {
    if (!currentEdit) return;
    const docRef = doc(db, "programRegistrations", currentEdit.firebaseId);
    let editCopy = { ...currentEdit };
    delete editCopy.firebaseId;

    await updateDoc(docRef, editCopy);
    await fetchData();
    setEditOpen(false);
  };

  // فتح نافذة عرض جميع الدورات لهذا الشخص
  const handleShowPrograms = (person) => {
    // فلترة حسب رقم الهوية
    const personRegs = registrations.filter(r => r.id === person.id);
    setPersonRegistrations(personRegs);
    setSelectedPerson(person.FirstName + " " + person.lastName);
    setShowPersonPrograms(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>تسجيلات الدورات</Typography>
      {/* الفلاتر الجديدة */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        {/* Dropdown اسم الدورة */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="programName-label">اسم الدورة</InputLabel>
          <Select
            labelId="programName-label"
            value={programName}
            label="اسم الدورة"
            onChange={e => setProgramName(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">الكل</MenuItem>
            {programNames.map((name, idx) => (
              <MenuItem key={idx} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Dropdown رقم الصف */}
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel id="classNumber-label"> חוג</InputLabel>
          <Select
            labelId="classNumber-label"
            value={classNumber}
            label=" חוג"
            onChange={e => setClassNumber(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">الكل</MenuItem>
            {classNumbers.map((num, idx) => (
              <MenuItem key={idx} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Dropdown رقم المجموعة */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="groupNumber-label">קבוצה</InputLabel>
          <Select
            labelId="groupNumber-label"
            value={groupNumber}
            label="קבוצה"
            onChange={e => setGroupNumber(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">الكل</MenuItem>
            {groupNumbers.map((num, idx) => (
              <MenuItem key={idx} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* مربع البحث الشامل */}
        <TextField
          label="بحث..."
          variant="outlined"
          sx={{ minWidth: 220 }}
          onChange={e => setGeneralSearch(e.target.value)}
          value={generalSearch}
          placeholder="اسم، اسم عائلة، اسم والد، رقم هوية، رقم هوية أب"
        />
        {/* زر مسح الفلاتر */}
        <Button
          variant="outlined"
          onClick={() => {
            setProgramName("");
            setClassNumber("");
            setGroupNumber("");
            setGeneralSearch("");
          }}
        >
          مسح الفلاتر
        </Button>
      </Box>

      {/* الجدول */}
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
              <TableCell>اسم الدورة</TableCell>
              <TableCell>رقم الصف</TableCell>
              <TableCell>رقم المجموعة</TableCell>
              <TableCell>جميع دوراته </TableCell>
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
                <TableCell>{reg.programName}</TableCell>
                <TableCell>{reg.classNumber}</TableCell>
                <TableCell>{reg.groupNumber}</TableCell>
                <TableCell>
                  <Button color="info" variant="text" onClick={() => handleShowPrograms(reg)}>
                    عرض 
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEditClick(reg)}>تعديل</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* نافذة التعديل */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>تعديل بيانات المسجل</DialogTitle>
        <DialogContent>
          {currentEdit && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
              <TextField label="الاسم الشخصي" value={currentEdit.FirstName || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, FirstName: e.target.value }))} />
              <TextField label="تاريخ الميلاد" value={currentEdit.birthdate || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, birthdate: e.target.value }))} />
              <TextField label="رقم الهوية" value={currentEdit.id || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, id: e.target.value }))} />
              <TextField label="رقم التحقق" value={currentEdit.cheackDigit || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, cheackDigit: e.target.value }))} />
              <TextField label="الإيميل" value={currentEdit.email || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, email: e.target.value }))} />
              <TextField label="رقم الهاتف" value={currentEdit.personalPhone || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, personalPhone: e.target.value }))} />
              <TextField label="اسم العائلة" value={currentEdit.lastName || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, lastName: e.target.value }))} />
              <TextField label="الجنس" value={currentEdit.gender || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, gender: e.target.value }))} />
              <TextField label="العنوان" value={currentEdit.address || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, address: e.target.value }))} />
              <TextField label="رمز المدينة" value={currentEdit.cityCode || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, cityCode: e.target.value }))} />
              <TextField label="الهاتف الأرضي" value={currentEdit.landLine || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, landLine: e.target.value }))} />
              <TextField label="رقم تحقق الأب" value={currentEdit.fatherCheackDigit || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, fatherCheackDigit: e.target.value }))} />
              <TextField label="هوية الأب" value={currentEdit.fatherId || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, fatherId: e.target.value }))} />
              <TextField label="اسم الأب" value={currentEdit.fatherName || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, fatherName: e.target.value }))} />
              <TextField label="هاتف الأب" value={currentEdit.fatherPhone || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, fatherPhone: e.target.value }))} />
              <TextField label="اسم عائلة الأب" value={currentEdit.parentLastName || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, parentLastName: e.target.value }))} />
              <TextField label="رقم الصف" value={currentEdit.classNumber || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, classNumber: e.target.value }))} />
              <TextField label="رقم المجموعة" value={currentEdit.groupNumber || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, groupNumber: e.target.value }))} />
              <TextField label="اسم الدورة" value={currentEdit.programName || ""} onChange={e => setCurrentEdit(prev => ({ ...prev, programName: e.target.value }))} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>إلغاء</Button>
          <Button onClick={() => setConfirmOpen(true)} variant="contained">حفظ</Button>
        </DialogActions>
      </Dialog>

      {/* نافذة التأكيد */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>تأكيد الحفظ</DialogTitle>
        <DialogContent>
          <Typography>لقد تم إجراء تغييرات. هل أنت متأكد أنك تريد حفظها؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>إلغاء</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              await handleSaveEdit();
              setConfirmOpen(false);
            }}
          >
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>

      {/* نافذة عرض جميع الدورات لهذا الشخص */}
      <Dialog open={showPersonPrograms} onClose={() => setShowPersonPrograms(false)}>
        <DialogTitle>كل الدورات لـ {selectedPerson}</DialogTitle>
        <DialogContent>
          {personRegistrations.length === 0 ? (
            <Typography>لا يوجد تسجيلات.</Typography>
          ) : (
            <ul>
              {personRegistrations.map((r, i) => (
                <li key={i}>
                  {r.programName} (صف: {r.classNumber}، مجموعة: {r.groupNumber})
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPersonPrograms(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
