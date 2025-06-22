import React, { useEffect, useState } from 'react';
import {
Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
DialogActions, TextField, IconButton, Checkbox, FormControlLabel
} from '@mui/material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../components/firebase';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Autocomplete from '@mui/material/Autocomplete';
import { uploadImage } from "../../utils/uploadImage";
import { deleteImage } from "../../utils/deleteImage";
import { compressImage } from "../../utils/compressImage";
import { Timestamp } from "firebase/firestore";


export default function AdminPrograms() {
const [programs, setPrograms] = useState([]);
const [openDialog, setOpenDialog] = useState(false);
const [editMode, setEditMode] = useState(false);
const [currentId, setCurrentId] = useState(null);
const [form, setForm] = useState({
name: "",
description: "",
category: [],
instructor_name: "",
price: "",
capacity: "",
meetingNum: "",
days: "",
startDate: "",
endDate: "",
time: "",
imageUrl: "",
classNumber: "",
groupNumber: "",
digit5: "",
isActive: true,
featured: false,
});

const [selectedCategory, setSelectedCategory] = useState("الكل");
const [allCategories, setAllCategories] = useState([]);
const [showArchived, setShowArchived] = useState(false);

// الفلاتر الجديدة
const [selectedClass, setSelectedClass] = useState("الكل");
const [selectedGroup, setSelectedGroup] = useState("الكل");
const [showFeatured, setShowFeatured] = useState(false);

// جلب القيم المتاحة للصف والمجموعة تلقائياً
const allClasses = ["الكل", ...Array.from(new Set(programs.map(p => p.classNumber).filter(x => x && x !== "")))];
const allGroups = ["الكل", ...Array.from(new Set(programs.map(p => p.groupNumber).filter(x => x && x !== "")))];

// دالة لتحويل صيغة التاريخ
const formatDate = (val) => {
if (!val) return "";
if (typeof val === "string") return val.slice(0, 10);
if (val.seconds) {
const d = new Date(val.seconds * 1000);
return d.toISOString().slice(0, 10);
}
if (typeof val === "number") {
const d = new Date(val);
return d.toISOString().slice(0, 10);
}
return "";
};

// جلب الدورات والتصنيفات
const fetchPrograms = async () => {
const querySnapshot = await getDocs(collection(db, "programs"));
let arr = [];
let cats = new Set();
querySnapshot.forEach(doc => {
let program = { id: doc.id, ...doc.data() };
arr.push(program);

if (Array.isArray(program.category)) {
program.category.forEach(cat => cats.add(cat));
} else if (typeof program.category === "string" && program.category) {
cats.add(program.category);
}
});
setPrograms(arr);
setAllCategories(["الكل", ...Array.from(cats)]);
};

useEffect(() => {
fetchPrograms();
}, []);

const handleOpenDialog = (program = null) => {
if (program) {
setEditMode(true);
setCurrentId(program.id);
setForm({
...program,
category: Array.isArray(program.category)
  ? program.category
  : program.category
    ? [program.category]
    : [],
classNumber: program.classNumber || "",
groupNumber: program.groupNumber || "",
startDate: formatDate(program.startDate),
endDate: formatDate(program.endDate),
isActive: program.isActive !== undefined ? program.isActive : true,
featured: program.featured !== undefined ? program.featured : false,
});
} else {
setEditMode(false);
setCurrentId(null);
setForm({
name: "",
description: "",
category: [],
instructor_name: "",
price: "",
capacity: "",
meetingNum: "",
days: "",
startDate: "",
endDate: "",
time: "",
imageUrl: "",
classNumber: "",
groupNumber: "",
digit5: "",
isActive: true,
featured: false,
});
}
setOpenDialog(true);
};

const handleCloseDialog = () => {
setOpenDialog(false);
};

const handleChange = e => {
setForm({ ...form, [e.target.name]: e.target.value });
};

function validateRequiredFields() {
// تحقق من الحقول النصية
if (!form.name.trim()) {
alert("يرجى إدخال اسم الدورة.");
return false;
}
if (!form.category || (Array.isArray(form.category) && form.category.length === 0)) {
alert("يرجى اختيار تصنيف واحد على الأقل.");
return false;
}
if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) {
alert("يرجى إدخال سعر الدورة بشكل صحيح.");
return false;
}
if (!form.capacity || isNaN(Number(form.capacity)) || Number(form.capacity) <= 0) {
alert("يرجى إدخال عدد المقاعد بشكل صحيح.");
return false;
}
if (!form.classNumber.trim()) {
alert("يرجى إدخال رقم الصف.");
return false;
}
if (!form.digit5.trim()) {
alert("يرجى إدخال ספרה 5");
return false;
}
if (!form.groupNumber.trim()) {
alert("يرجى إدخال رقم المجموعة.");
return false;
}
return true;
}


// أرشفة الدورة أو إلغاء الأرشفة
const handleArchiveToggle = async (program) => {
const docRef = doc(db, "programs", program.id);
await updateDoc(docRef, { isActive: !program.isActive });
fetchPrograms();
};

// إضافة دورة جديدة
const handleAdd = async () => {
  if (!validateRequiredFields()) return;

  const categoryArray =
    Array.isArray(form.category)
      ? Array.from(new Set(form.category))
      : form.category
      ? [form.category]
      : [];

  // أنشئ الدورة بدون الصورة أولاً
  
 const { imageFile, ...formData } = form;

const docRef = await addDoc(collection(db, "programs"), {
  ...formData,
  startDate: formData.startDate ? Timestamp.fromDate(new Date(formData.startDate)) : null,
  endDate: formData.endDate ? Timestamp.fromDate(new Date(formData.endDate)) : null,
  
  imageUrl: "", // نحجز مكانًا للرابط
  category: categoryArray,
  isActive: form.isActive,
  featured: form.featured,
});

  // إذا وُجدت صورة، ارفعها ثم احفظ رابطها
 if (imageFile) {
  await uploadImage({
    file: imageFile,
    storagePath: `programs/${docRef.id}.jpg`,
    firestorePath: ["programs", docRef.id],
    field: "imageUrl",
  });
}



  fetchPrograms();
  handleCloseDialog();
};

const handleEdit = async () => {
  if (!validateRequiredFields()) return;

  const docRef = doc(db, "programs", currentId);
  const categoryArray =
    Array.isArray(form.category)
      ? Array.from(new Set(form.category))
      : form.category
      ? [form.category]
      : [];

  const { imageFile, ...formToUpdate } = form;
  let updatedData = {
    ...formToUpdate,
     startDate: formToUpdate.startDate ? Timestamp.fromDate(new Date(formToUpdate.startDate)) : null,
  endDate: formToUpdate.endDate ? Timestamp.fromDate(new Date(formToUpdate.endDate)) : null,
    category: categoryArray,
    isActive: form.isActive,
    featured: form.featured,
  };

  // إذا رفع المستخدم صورة جديدة
  if (imageFile) {
    updatedData.imageUrl = ""; // سيتم تحديثها بعد رفع الصورة
  }

  // تحديث البيانات في Firestore
  await updateDoc(docRef, updatedData);

  // رفع الصورة الجديدة إذا وُجدت، وحذف القديمة
  if (imageFile) {
    if (form.imageUrl) {
      await deleteImage(form.imageUrl);
    }
    await uploadImage({
      file: imageFile,
      storagePath: `programs/${currentId}.jpg`,
      firestorePath: ["programs", currentId],
      field: "imageUrl",
    });
  }

  fetchPrograms();
  handleCloseDialog();
};




// حذف دورة
const handleDelete = async (id) => {
  // العثور على الدورة المحذوفة للحصول على رابط الصورة
  const programToDelete = programs.find(p => p.id === id);

  if (window.confirm("هل أنتِ متأكدة من حذف هذه الدورة نهائيًا؟")) {
    // حذف الوثيقة من Firestore
    await deleteDoc(doc(db, "programs", id));

    // إذا كان هناك صورة محفوظة، احذفيها من Firebase Storage
    if (programToDelete?.imageUrl) {
      await deleteImage(programToDelete.imageUrl);
    }

    // إعادة تحميل الدورات
    fetchPrograms();
  }
};



function requiredLabel(label) {
return (
<span>
{label}
<span style={{ color: 'red', marginRight: 2 }}>*</span>
</span>
);
}

// فلترة حسب كل الفلاتر
const filteredPrograms = programs.filter(program =>
// فلتر التصنيف
(selectedCategory === "الكل" || (
Array.isArray(program.category)
? program.category.includes(selectedCategory)
: program.category === selectedCategory
))
// فلتر رقم الصف
&& (selectedClass === "الكل" || program.classNumber === selectedClass)
// فلتر رقم المجموعة
&& (selectedGroup === "الكل" || program.groupNumber === selectedGroup)
// فلتر المميزة فقط
&& (!showFeatured || program.featured === true)
// فلتر الأرشفة
&& (showArchived ? program.isActive === false : program.isActive !== false)
);

return (
<AdminDashboardLayout>
<Box sx={{ my: 3 }}>
<Typography variant="h4" sx={{ mb: 2 }}>إدارة الدورات</Typography>
<Button variant="contained" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>إضافة دورة جديدة</Button>

{/* فلاتر الدورات */}
<FormControlLabel
  control={<Checkbox checked={showArchived} onChange={() => setShowArchived(!showArchived)} />}
  label="عرض الدورات المؤرشفة فقط"
  sx={{ mb: 2, mr: 2 }}
/>

<FormControlLabel
  control={<Checkbox checked={showFeatured} onChange={() => setShowFeatured(!showFeatured)} />}
  label="عرض الدورات المميزة فقط"
  sx={{ mb: 2, mr: 2 }}
/>
<Box sx={{ mb: 2, display: "inline-block", mr: 2 }}>
  <TextField
    select
    label="اختر التصنيف"
    value={selectedCategory}
    onChange={e => setSelectedCategory(e.target.value)}
    SelectProps={{ native: true }}
    sx={{ width: 170 }}
  >
    {allCategories.map((cat, idx) => (
      <option key={idx} value={cat}>{cat}</option>
    ))}
  </TextField>
</Box>
<Box sx={{ mb: 2, display: "inline-block", mr: 2 }}>
  <TextField
    select
    label="اختر رقم الصف"
    value={selectedClass}
    onChange={e => setSelectedClass(e.target.value)}
    SelectProps={{ native: true }}
    sx={{ width: 140 }}
  >
    {allClasses.map((cl, idx) => (
      <option key={idx} value={cl}>{cl}</option>
    ))}
  </TextField>
</Box>
<Box sx={{ mb: 2, display: "inline-block", mr: 2 }}>
  <TextField
    select
    label="اختر رقم المجموعة"
    value={selectedGroup}
    onChange={e => setSelectedGroup(e.target.value)}
    SelectProps={{ native: true }}
    sx={{ width: 140 }}
  >
    {allGroups.map((gr, idx) => (
      <option key={idx} value={gr}>{gr}</option>
    ))}
  </TextField>
</Box>


{/* جدول الدورات */}
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>اسم الدورة</TableCell>
        <TableCell>חוג</TableCell>
        <TableCell>קבוצה</TableCell>
        <TableCell>الوصف</TableCell>
        <TableCell>المدرب</TableCell>
        <TableCell>السعر</TableCell>
        <TableCell>أيام اللقاء</TableCell>
        <TableCell>وقت اللقاء</TableCell>
        <TableCell>مميزة؟</TableCell>
        <TableCell>الحالة</TableCell>
        <TableCell>تعديل</TableCell>
        <TableCell>حذف</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredPrograms.map(program => (
        <TableRow
          key={program.id}
          sx={{
            backgroundColor: program.isActive === false ? "#fffbe6" : "inherit",
            color: program.isActive === false ? "#ff9800" : "inherit"
          }}
        >
          <TableCell>
            {program.name}
            {program.isActive === false && (
              <span style={{ color: "#ff9800", marginRight: 8 }}> (مؤرشفة)</span>
            )}
          </TableCell>
          <TableCell>{program.classNumber}</TableCell>
          <TableCell>{program.groupNumber}</TableCell>
          <TableCell>{program.description}</TableCell>
          <TableCell>{program.instructor_name}</TableCell>
          <TableCell>{program.price}</TableCell>
          <TableCell>{Array.isArray(program.days) ? program.days.join("، ") : program.days}</TableCell>
          <TableCell>{program.time}</TableCell>
          <TableCell>
            {program.featured ? <span style={{ color: "green", fontWeight: "bold" }}>✔</span> : ""}
          </TableCell>
          <TableCell>
            <IconButton onClick={() => handleArchiveToggle(program)}>
              {program.isActive === false
                ? <UnarchiveIcon titleAccess="استعادة الدورة" />
                : <ArchiveIcon titleAccess="أرشفة الدورة" />}
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton color="primary" onClick={() => handleOpenDialog(program)}><EditIcon /></IconButton>
          </TableCell>
          <TableCell>
            <IconButton color="error" onClick={() => handleDelete(program.id)}><DeleteIcon /></IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

{/* Dialog للإضافة والتعديل */}
<Dialog open={openDialog} onClose={handleCloseDialog}>
  <DialogTitle>{editMode ? "تعديل دورة" : "إضافة دورة"}</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      margin="dense"
      name="name"
      label={requiredLabel("اسم الدورة")}
      value={form.name}
      onChange={handleChange}
    />
    <Autocomplete
      multiple
      freeSolo
      options={allCategories.filter(c => c !== "الكل")}
      value={Array.isArray(form.category) ? form.category : form.category ? [form.category] : []}
      onChange={(event, newValue) => setForm({ ...form, category: newValue })}
      renderInput={(params) => (
        <TextField
          {...params}
          label={requiredLabel("التصنيفات")}
          placeholder="اختر أو أضف تصنيفًا"
          margin="dense"
          fullWidth
        />
      )}
    />
    <TextField
      fullWidth
      margin="dense"
      name="price"
      label={requiredLabel("السعر")}
      type="number"
      value={form.price}
      onChange={handleChange}
    />
    <TextField
      fullWidth
      margin="dense"
      name="capacity"
      label={requiredLabel("عدد المقاعد")}
      type="number"
      value={form.capacity}
      onChange={handleChange}
    />
    <TextField
      fullWidth
      margin="dense"
      name="classNumber"
      label={requiredLabel("חוג")}
      value={form.classNumber}
      onChange={handleChange}
    />
    <TextField
      fullWidth
      margin="dense"
      name="groupNumber"
      label={requiredLabel("(קבוצה) المجموعة")}
      value={form.groupNumber}
      onChange={handleChange}
    />

    <TextField
      fullWidth
      margin="dense"
      name="digit5"
      label={requiredLabel("ספרה 5")}
      value={form.digit5}
      onChange={handleChange}
    />
    <TextField fullWidth margin="dense" name="description" label="الوصف" value={form.description} onChange={handleChange} />

    <TextField fullWidth margin="dense" name="instructor_name" label="اسم المدرب" value={form.instructor_name} onChange={handleChange} />
    <TextField fullWidth margin="dense" name="meetingNum" label="عدد اللقاءات" value={form.meetingNum} onChange={handleChange} />
    <TextField fullWidth margin="dense" name="days" label="الأيام (مثال: الأحد، الإثنين)" value={form.days} onChange={handleChange} />
    <TextField fullWidth margin="dense" name="time" label="الوقت" value={form.time} onChange={handleChange} />
    <TextField fullWidth margin="dense" name="startDate" label="تاريخ البدء" type="date" value={form.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
    <TextField fullWidth margin="dense" name="endDate" label="تاريخ الانتهاء" type="date" value={form.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
    <Box mt={2}>
      <Typography variant="subtitle2" gutterBottom>
        صورة الدورة:
      </Typography>

      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
  const file = e.target.files[0];
  if (file) {
    const compressed = await compressImage(file);
    if (form.imageUrl) {
      await deleteImage(form.imageUrl); // حذف القديمة
    }
    setForm(prev => ({ ...prev, imageFile: compressed, imageUrl: '' }));
  }
}}

        style={{ display: 'block', marginBottom: '8px' }}
      />

      {form.imageUrl && (
        <Box mt={1}>
          <Typography variant="body2" color="textSecondary">تم تحميل صورة:</Typography>
          <img
            src={form.imageUrl}
            alt="صورة الفعالية"
            style={{ width: 100, borderRadius: 4, marginTop: 4 }}
          />

          <Button
  variant="outlined"
  color="error"
  size="small"
  onClick={async () => {
    await deleteImage(form.imageUrl);
    setForm(prev => ({ ...prev, imageUrl: "", imageFile: undefined }));
  }}
  style={{ marginRight: 8 }}
>
  حذف الصورة
</Button>

        </Box>
        
      )}

    </Box>            <FormControlLabel
      control={
        <Checkbox
          checked={form.isActive}
          onChange={e => setForm({ ...form, isActive: e.target.checked })}
          color="primary"
        />
      }
      label="الدورة فعّالة (غير مؤرشفة)"
      sx={{ mt: 1 }}
    />
    <FormControlLabel
      control={
        <Checkbox
          checked={form.featured}
          onChange={e => setForm({ ...form, featured: e.target.checked })}
          color="primary"
        />
      }
      label="عرض هذه الدورة في الصفحة الرئيسية (مميزة)"
      sx={{ mt: 1 }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog}>إلغاء</Button>
    <Button onClick={editMode ? handleEdit : handleAdd} variant="contained">{editMode ? "تعديل" : "إضافة"}</Button>
  </DialogActions>
</Dialog>
</Box>
</AdminDashboardLayout>
);
}
