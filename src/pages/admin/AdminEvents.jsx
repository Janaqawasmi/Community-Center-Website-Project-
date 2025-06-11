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
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import { uploadImage } from "../../utils/uploadImage"; 
import { deleteImage } from "../../utils/deleteImage"; 
import { compressImage } from "../../utils/compressImage"; // تأكد من وجود هذه الدالة في utils

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageUrl: '',
    capacity: '', 
    isActive: true,
  });

  // تحويل التاريخ من firebase timestamp أو string لنص عربي
  function formatDate(ts) {
    if (!ts) return '';
    if (typeof ts === 'string') return ts;
    if (typeof ts === 'object' && ts.seconds) {
      const date = new Date(ts.seconds * 1000);
      return date.toLocaleDateString('ar-EG');
    }
    return '';
  }

  function formatTime(ts) {
    if (!ts) return '';
    if (typeof ts === 'string') return ts;
    if (typeof ts === 'object' && ts.seconds) {
      const date = new Date(ts.seconds * 1000);
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  }

  // جلب الفعاليات من فايربيس
  const fetchEvents = async () => {
    const eventsSnapshot = await getDocs(collection(db, 'Events'));
    const eventsList = eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        isActive: data.isActive || false,
      };
    });
    setEvents(eventsList);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // فتح نافذة الإضافة أو التعديل
  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditMode(true);
      setCurrentId(event.id);
      setForm({
        ...event,
        capacity: event.capacity || '', // تأكد أن السعة تظهر عند التعديل
      });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setForm({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        imageUrl: '',
        capacity: '', // السعة فارغة عند إضافة فعالية جديدة
        isActive: true, // افتراضياً تكون الفعالية نشطة
      });
    }
    setOpenDialog(true);
  };

  // إغلاق النافذة
  const handleCloseDialog = () => setOpenDialog(false);

  // تغيير الحقول في الفورم
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // إضافة أو تعديل فعالية
 const handleSave = async () => {
  // تحقق من الحقول المطلوبة
  if (!form.name.trim()) {
    alert("يرجى إدخال اسم الفعالية");
    return;
  }
  if (!form.capacity || isNaN(Number(form.capacity)) || Number(form.capacity) <= 0) {
    alert("يرجى إدخال سعة الفعالية بشكل صحيح (رقم أكبر من صفر)");
    return;
  }

  try {
    const { imageFile, ...formData } = form;

    const eventData = {
      ...formData,
      isActive: form.isActive === true,
      imageUrl: "", // سنضيف الرابط لاحقًا
    };

    let docRef;

    if (editMode && currentId) {
      await updateDoc(doc(db, "Events", currentId), eventData);
      docRef = { id: currentId }; // نصنع ref يدوي لأنه تعديل
    } else {
      docRef = await addDoc(collection(db, "Events"), eventData);
    }

    // رفع الصورة إلى Firebase Storage
    if (imageFile) {
      await uploadImage({
        file: imageFile,
        storagePath: `events/${docRef.id}.jpg`,
        firestorePath: ["Events", docRef.id],
        field: "imageUrl"
      });
    }

    setOpenDialog(false);
    fetchEvents();
  } catch (err) {
    console.error("فشل في حفظ الفعالية:", err);
    alert("حدث خطأ أثناء حفظ الفعالية");
  }
};


  // حذف فعالية نهائياً
  const handleDelete = async (id) => {
  if (window.confirm("هل أنت متأكد من حذف الفعالية نهائيًا؟")) {
    try {
      const eventDoc = doc(db, "Events", id);
      const eventSnap = await getDocs(collection(db, "Events"));
      const targetDoc = eventSnap.docs.find(doc => doc.id === id);

      if (targetDoc && targetDoc.data().imageUrl) {
        await deleteImage(targetDoc.data().imageUrl);
      }

      await deleteDoc(eventDoc);
      fetchEvents();
    } catch (err) {
      console.error("خطأ أثناء الحذف:", err);
      alert("فشل حذف الفعالية أو صورتها");
    }
  }
};


  // أرشفة/فك أرشفة الفعالية
  const handleArchive = async (id, archive) => {
    await updateDoc(doc(db, 'Events', id), { isActive: !archive }); 
    fetchEvents();
  };

  // الفلترة حسب حالة الأرشفة
 const filteredEvents = events.filter(event =>
  showArchived ? !event.isActive : event.isActive
);


  return (
    <AdminDashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" mb={2}>إدارة الفعاليات</Typography>

        <Box mb={2} sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
            إضافة فعالية
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                checked={showArchived}
                onChange={() => setShowArchived(!showArchived)}
                color="primary"
              />
            }
            label="عرض الفعاليات المؤرشفة فقط"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>اسم الفعالية</TableCell>
                <TableCell>الوصف</TableCell>
                <TableCell>التاريخ</TableCell>
                <TableCell>الوقت</TableCell>
                <TableCell>المكان</TableCell>
                <TableCell>السعة</TableCell> {/* عمود جديد للسعة */}
                <TableCell>أرشفة</TableCell>
                <TableCell>تعديل</TableCell>
                <TableCell>حذف</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map(event => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{formatDate(event.date)}</TableCell>
                  <TableCell>{formatTime(event.time)}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.capacity}</TableCell> {/* عرض السعة */}
                  <TableCell>
                   <IconButton
                      onClick={() => handleArchive(event.id, event.isActive)}
                      title={event.isActive ? "أرشفة" : "فك الأرشفة"}
                    >
                      {event.isActive ? <ArchiveIcon /> : <UnarchiveIcon color="primary" />}
                    </IconButton>

                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDialog(event)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(event.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} dir="rtl">
        <DialogTitle>{editMode ? 'تعديل فعالية' : 'إضافة فعالية'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label={<span>اسم الفعالية<span style={{ color: "red" }}> *</span></span>}
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

           <TextField
            margin="dense"
            name="capacity"
            label={<span>عدد المقاعد<span style={{ color: "red" }}> *</span></span>}
            value={form.capacity}
            onChange={handleChange}
            fullWidth
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
          />
          <TextField
            margin="dense"
            name="description"
            label="الوصف"
            value={form.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="date"
            label="التاريخ"
            value={form.date}
            onChange={handleChange}
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="time"
            label="الوقت"
            value={form.time}
            onChange={handleChange}
            fullWidth
            type="time"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="location"
            label="المكان"
            value={form.location}
            onChange={handleChange}
            fullWidth
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
  </Box>
)}

</Box>


         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editMode ? 'حفظ' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminDashboardLayout>
  );
}
