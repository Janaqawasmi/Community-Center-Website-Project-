// src/pages/admin/AdminEvents.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Checkbox, FormControlLabel
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { db } from '../../components/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import { uploadImage } from "../../utils/uploadImage";
import { deleteImage } from "../../utils/deleteImage";
import { compressImage } from "../../utils/compressImage";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [selectedClass, setSelectedClass] = useState("الكل");
  const [selectedGroup, setSelectedGroup] = useState("الكل");

  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    imageUrl: "",
    capacity: "",
    classNumber: "",
    groupNumber: "",
    digit5: "",
    price: "",
    isActive: true,
    featured: false,
    imageFile: undefined,
  });

  // جلب جميع الفعاليات
  const fetchEvents = async () => {
    const eventsSnapshot = await getDocs(collection(db, 'Events'));
    const eventsList = eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        isActive: data.isActive !== undefined ? data.isActive : true,
        featured: data.featured !== undefined ? data.featured : false,
      };
    });
    setEvents(eventsList);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // دوال الفلاتر التلقائية
  const allClasses = ["الكل", ...Array.from(new Set(events.map(e => e.classNumber).filter(x => x && x !== "")))];
  const allGroups = ["الكل", ...Array.from(new Set(events.map(e => e.groupNumber).filter(x => x && x !== "")))];

  // دالة تحويل التاريخ للعرض
  const formatDateTime = (ts) => {
    if (!ts) return '';
    if (typeof ts === 'object' && ts.seconds) {
      const date = new Date(ts.seconds * 1000);
      return date.toLocaleString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return ts;
  };

  // required label
  function requiredLabel(label) {
    return (
      <span>
        {label}
        <span style={{ color: 'red', marginRight: 2 }}>*</span>
      </span>
    );
  }

  // فتح النافذة
  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditMode(true);
      setCurrentId(event.id);
      setForm({
        ...event,
        date: event.date && event.date.seconds ? new Date(event.date.seconds * 1000).toISOString().slice(0, 10) : "",
        time: event.date && event.date.seconds ? new Date(event.date.seconds * 1000).toTimeString().slice(0,5) : "",
        imageFile: undefined,
        isActive: event.isActive !== undefined ? event.isActive : true,
        featured: event.featured !== undefined ? event.featured : false,
      });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setForm({
        name: "",
        description: "",
        date: "",
        time: "",
        location: "",
        imageUrl: "",
        capacity: "",
        classNumber: "",
        groupNumber: "",
        digit5: "",
        price: "",
        isActive: true,
        featured: false,
        imageFile: undefined,
      });
    }
    setOpenDialog(true);
  };

  // إغلاق النافذة
  const handleCloseDialog = () => setOpenDialog(false);

  // تغيير القيم
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // تحقق الحقول المطلوبة
  function validateRequiredFields() {
    if (!form.name.trim()) {
      alert("يرجى إدخال اسم الفعالية.");
      return false;
    }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) {
      alert("يرجى إدخال سعر الفعالية بشكل صحيح.");
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

  // إضافة فعالية جديدة
  const handleAdd = async () => {
    if (!validateRequiredFields()) return;

    let dateValue = form.date
      ? Timestamp.fromDate(new Date(`${form.date}T${form.time || "00:00"}`))
      : null;

    const { imageFile, ...formData } = form;
    const docRef = await addDoc(collection(db, "Events"), {
      ...formData,
      date: dateValue,
      imageUrl: "",
      isActive: form.isActive,
      featured: form.featured,
    });

    if (imageFile) {
      await uploadImage({
        file: imageFile,
        storagePath: `events/${docRef.id}.jpg`,
        firestorePath: ["Events", docRef.id],
        field: "imageUrl",
      });
    }
    fetchEvents();
    handleCloseDialog();
  };

  // تعديل فعالية
  const handleEdit = async () => {
    if (!validateRequiredFields()) return;

    let dateValue = form.date
      ? Timestamp.fromDate(new Date(`${form.date}T${form.time || "00:00"}`))
      : null;

    const docRef = doc(db, "Events", currentId);
    const { imageFile, ...formToUpdate } = form;
    let updatedData = {
      ...formToUpdate,
      date: dateValue,
      isActive: form.isActive,
      featured: form.featured,
    };

    if (imageFile) {
      updatedData.imageUrl = "";
    }

    await updateDoc(docRef, updatedData);

    if (imageFile) {
      if (form.imageUrl) {
        await deleteImage(form.imageUrl);
      }
      await uploadImage({
        file: imageFile,
        storagePath: `events/${currentId}.jpg`,
        firestorePath: ["Events", currentId],
        field: "imageUrl",
      });
    }
    fetchEvents();
    handleCloseDialog();
  };

  // حذف فعالية
  const handleDelete = async (id) => {
    const eventToDelete = events.find(e => e.id === id);
    if (window.confirm("هل أنت متأكدة من حذف هذه الفعالية نهائيًا؟")) {
      await deleteDoc(doc(db, "Events", id));
      if (eventToDelete?.imageUrl) {
        await deleteImage(eventToDelete.imageUrl);
      }
      fetchEvents();
    }
  };

  // أرشفة/فك أرشفة
  const handleArchiveToggle = async (event) => {
    await updateDoc(doc(db, "Events", event.id), { isActive: !event.isActive });
    fetchEvents();
  };

  // الفلترة
  const filteredEvents = events.filter(event =>
    (selectedClass === "الكل" || event.classNumber === selectedClass) &&
    (selectedGroup === "الكل" || event.groupNumber === selectedGroup) &&
    (!showFeatured || event.featured === true) &&
    (showArchived ? event.isActive === false : event.isActive !== false)
  );

  return (
    <AdminDashboardLayout>
      <Box sx={{ my: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>إدارة الفعاليات</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>إضافة فعالية جديدة</Button>

        {/* الفلاتر */}
        <FormControlLabel
          control={<Checkbox checked={showArchived} onChange={() => setShowArchived(!showArchived)} />}
          label="عرض الفعاليات المؤرشفة فقط"
          sx={{ mb: 2, mr: 2 }}
        />
        <FormControlLabel
          control={<Checkbox checked={showFeatured} onChange={() => setShowFeatured(!showFeatured)} />}
          label="عرض الفعاليات المميزة فقط"
          sx={{ mb: 2, mr: 2 }}
        />
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

        {/* جدول الفعاليات */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>اسم الفعالية</TableCell>
                <TableCell>חוג</TableCell>
                <TableCell>קבוצה</TableCell>
                <TableCell>ספרה 5</TableCell>
                <TableCell>الوصف</TableCell>
                <TableCell>التاريخ والوقت</TableCell>
                <TableCell>المكان</TableCell>
                <TableCell>السعر</TableCell>
                <TableCell>عدد المقاعد</TableCell>
                <TableCell>مميزة؟</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>تعديل</TableCell>
                <TableCell>حذف</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map(event => (
                <TableRow
                  key={event.id}
                  sx={{
                    backgroundColor: event.isActive === false ? "#fffbe6" : "inherit",
                    color: event.isActive === false ? "#ff9800" : "inherit"
                  }}
                >
                  <TableCell>
                    {event.name}
                    {event.isActive === false && (
                      <span style={{ color: "#ff9800", marginRight: 8 }}> (مؤرشفة)</span>
                    )}
                  </TableCell>
                  <TableCell>{event.classNumber}</TableCell>
                  <TableCell>{event.groupNumber}</TableCell>
                  <TableCell>{event.digit5}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{formatDateTime(event.date)}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.price}</TableCell>
                  <TableCell>{event.capacity}</TableCell>
                  <TableCell>
                    {event.featured ? <span style={{ color: "green", fontWeight: "bold" }}>✔</span> : ""}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleArchiveToggle(event)}>
                      {event.isActive === false
                        ? <UnarchiveIcon titleAccess="استعادة الفعالية" />
                        : <ArchiveIcon titleAccess="أرشفة الفعالية" />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDialog(event)}><EditIcon /></IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(event.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog للإضافة والتعديل */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editMode ? "تعديل فعالية" : "إضافة فعالية"}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              name="name"
              label={requiredLabel("اسم الفعالية")}
              value={form.name}
              onChange={handleChange}
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
            <TextField
              fullWidth
              margin="dense"
              name="description"
              label="الوصف"
              value={form.description}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="location"
              label="المكان"
              value={form.location}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="date"
              label="تاريخ الفعالية"
              type="date"
              value={form.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="dense"
              name="time"
              label="وقت الفعالية"
              type="time"
              value={form.time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                صورة الفعالية:
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
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  color="primary"
                />
              }
              label="الفعالية فعّالة (غير مؤرشفة)"
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
              label="عرض هذه الفعالية في الصفحة الرئيسية (مميزة)"
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
