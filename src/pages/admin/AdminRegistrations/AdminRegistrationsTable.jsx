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
  Button,
} from "@mui/material";
import { db } from "../../../components/firebase.js";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import EditRegistrationDialog from "./EditRegistrationDialog";
import {ConfirmDeleteDialog} from "./../../../components/ConfirmDialog.jsx";
import { handleConfirmDelete } from "./Confirms";
import {exportRegistrationsToExcel} from "../../../utils/exportToExcel";
import { PersonProgramsViewer } from "./PersonProgramsDialog.jsx";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { onSnapshot, getDoc, doc, collection } from "firebase/firestore";
import { filterRegistrations, sortRegistrationsByDate } from "./filterUtils";





export default function AdminRegistrationsTable({ collectionName, label, archivedOnly }) {
  // حالات البيانات والفلترة
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [classNumber, setClassNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [paidOnly, setPaidOnly] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
const [editTarget, setEditTarget] = useState(null);
const [deleteOpen, setDeleteOpen] = useState(false);
const [digit5Options, setDigit5Options] = useState([]);
const [digit5, setDigit5] = useState("");
const [sortOrder, setSortOrder] = useState("desc");
const [classOptions, setClassOptions] = useState([]);
const [groupOptions, setGroupOptions] = useState([]);



useEffect(() => {
  const filteredData = filterRegistrations(data, {
    classNumber,
    groupNumber,
    search,
    paidOnly,
    archivedOnly,
  });

  const sortedData = sortRegistrationsByDate(filteredData, sortOrder);
  setFiltered(sortedData);
  setSelected([]);
}, [data, classNumber, groupNumber, search, paidOnly, archivedOnly, sortOrder]);



  // جلب التسجيلات من الكوليكشن المحدد
  useEffect(() => {
  let unsubProgram = null;
  let unsubEvent = null;

  const listenToCollection = (name) => {
    return onSnapshot(collection(db, name), async (snapshot) => {
      const docsWithDetails = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const firebaseId = docSnap.id;
          const docId = data.docId;

          if (!docId) {
            return { firebaseId, ...data, classNumber: "", groupNumber: "", name: "", digit5: "" };
          }

          const defColl = name === "programRegistrations" ? "programs" : "Events";
          const defSnap = await getDoc(doc(db, defColl, docId));
          const defData = defSnap.exists() ? defSnap.data() : {};

          return {
            firebaseId,
            ...data,
            classNumber: defData.classNumber ?? "",
            groupNumber: defData.groupNumber ?? "",
            name: defData.name ?? "",
            digit5: defData.digit5 ?? "",
            collectionName: name,
            archived: data.archived ?? false,
          };
        })
      );
      setData((prevData) => {
        const other = prevData.filter(d => d.collectionName !== name);
        return [...other, ...docsWithDetails];
      });
    });
  };

  if (collectionName === "all") {
    unsubProgram = listenToCollection("programRegistrations");
    unsubEvent = listenToCollection("eventRegistrations");
  } else {
    unsubProgram = listenToCollection(collectionName);
  }

  return () => {
    if (unsubProgram) unsubProgram();
    if (unsubEvent) unsubEvent();
  };
}, [collectionName]);



  
  // إدارة اختيار الصفوف
  const handleSelectAll = e =>
    setSelected(e.target.checked ? filtered.map(r => r.firebaseId) : []);

 const handleSelect = reg =>
  setSelected(prev =>
    prev.some(r => r.firebaseId === reg.firebaseId)
      ? prev.filter(r => r.firebaseId !== reg.firebaseId)
      : [...prev, reg]
  );
  const allRegistrations = [...data];


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

        <FormControl size="small" sx={{ minWidth: 160 }}>
  <InputLabel id="sort-order-label">ترتيب التاريخ</InputLabel>
  <Select
    labelId="sort-order-label"
    label="ترتيب التاريخ"
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <MenuItem value="desc">من الأحدث إلى الأقدم</MenuItem>
    <MenuItem value="asc">من الأقدم إلى الأحدث</MenuItem>
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

       {!archivedOnly && (
<Box
  sx={{
    display: "flex",
    justifyContent: { xs: "center", sm: "flex-end" },
    mt: 2,
    mb: 2,
  }}
>
  <Button
    variant="contained"
    sx={{
      backgroundColor: 'green',
      '&:hover': { backgroundColor: 'darkgreen' },
      width: { xs: '100%', sm: 'auto' },
    }}
onClick={() =>
  exportRegistrationsToExcel({
    selected: selected.length > 0 ? selected : filtered,
    setSelected
  })
}
  >
    تصدير إلى Excel
  </Button>
</Box>

)}


{selected.length > 0 && (
  <Button
    variant="contained"
    color="error"
    sx={{ mb: 2 }}
    onClick={() => setDeleteOpen(true)}
  >
    حذف {selected.length} تسجيل
  </Button>
)}

      {/* جدول التسجيلات */}
      <Paper>
        <Table>
          <TableHead>
  <TableRow>
    <TableCell padding="checkbox">
      <Checkbox
        checked={filtered.length > 0 && selected.length === filtered.length}
        indeterminate={selected.length > 0 && selected.length < filtered.length}
        onChange={e => setSelected(e.target.checked ? filtered : [])}
      />
    </TableCell>
    <TableCell>رقم الهوية</TableCell>
    <TableCell>الاسم الشخصي</TableCell>
    <TableCell>اسم العائلة</TableCell>
    <TableCell>رقم الهاتف</TableCell>
    <TableCell>رقم الدورة</TableCell>
    <TableCell>رقم المجموعة</TableCell>
    <TableCell>ספרה5</TableCell>  

    <TableCell>سجل ل:</TableCell>
    <TableCell>تاريخ التسجيل</TableCell>
    
    <TableCell>تعديل</TableCell>

    <TableCell>حالة الدفع</TableCell>
    <TableCell>تسجيلاته</TableCell>

  </TableRow>
</TableHead>

          <TableBody>
            {filtered.map(reg => (
              <TableRow key={reg.firebaseId} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                      checked={selected.some(s => s.firebaseId === reg.firebaseId)}
                      onChange={() => handleSelect(reg)}
                    />

                </TableCell>
                <TableCell>{reg.id}</TableCell>
                <TableCell>{reg.FirstName}</TableCell>
                <TableCell>{reg.lastName}</TableCell>
                <TableCell>{reg.personalPhone}</TableCell>
                <TableCell>{reg.classNumber}</TableCell>
                <TableCell>{reg.groupNumber}</TableCell>
                <TableCell>{reg.digit5}</TableCell>

                <TableCell>{reg.name}</TableCell>
                <TableCell>{reg.registrationDate}</TableCell>
               


<TableCell>
  <IconButton
    onClick={() => {
      setEditTarget(reg);
      setEditOpen(true);
    }}
    color={archivedOnly ? "primary" : "default"}
  >
    {archivedOnly ? <VisibilityIcon /> : <EditIcon />}
  </IconButton>
</TableCell>

                <TableCell>
                  <Checkbox checked={!!reg.paid} disabled />
                </TableCell>


                 <TableCell>
  <PersonProgramsViewer person={reg} allRegistrations={allRegistrations} />
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    <EditRegistrationDialog
  open={editOpen}
  onClose={() => setEditOpen(false)}
  registration={editTarget}
  onSave={(updatedReg) => {
    setData(prev => prev.map(r => r.firebaseId === updatedReg.firebaseId ? updatedReg : r));
  }}
  collectionName={collectionName}
  readOnly={archivedOnly}
/>


<ConfirmDeleteDialog
  open={deleteOpen}
  onClose={() => setDeleteOpen(false)}
  onConfirm={() =>
    handleConfirmDelete({
      selected,
      setData,
      setDeleteOpen,
      setSelected
    })
  }
  message={`هل أنت متأكد أنك تريد حذف ${selected.length} تسجيل؟`}
/>




    </Box>
  );
}