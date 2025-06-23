import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Checkbox, FormControlLabel
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { db } from '../../../components/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { uploadImage } from "../../../utils/uploadImage";
import { deleteImage } from "../../../utils/deleteImage";
import { compressImage } from "../../../utils/compressImage";
import AdminDashboardLayout from "../../../components/AdminDashboardLayout";
import Autocomplete from '@mui/material/Autocomplete';



export default function AdminItemsManager({
  collectionName = "Events",
  itemLabel = "فعالية",
  fields = [],
  filters = [],
  hasCategory = false,
  categoryOptions = [],
  fetchCategories,
}) {
  // ==== STATE ====
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({});
  const [showArchived, setShowArchived] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  // ==== INIT FORM ====
  const defaultForm = {};
  fields.forEach(f => defaultForm[f.name] = f.default || "");
  defaultForm.featured = false;
  defaultForm.isActive = true;
  defaultForm.imageFile = undefined;

  // ==== FETCH DATA ====
  const fetchItems = async () => {
    const snapshot = await getDocs(collection(db, collectionName));
    const list = snapshot.docs.map(docu => ({
      id: docu.id,
      ...docu.data(),
      isActive: docu.data().isActive !== undefined ? docu.data().isActive : true,
      featured: docu.data().featured !== undefined ? docu.data().featured : false,
    }));
    setItems(list);
  };

  useEffect(() => {
    fetchItems();
  }, [collectionName]);

  // ==== LABEL REQUIRED ====
  function requiredLabel(label) {
    return (
      <span>
        {label}
        <span style={{ color: 'red', marginRight: 2 }}>*</span>
      </span>
    );
  }

  // ==== FILTERS OPTIONS ====
  function getFilterOptions(fieldName) {
  if (fieldName === "category" && Array.isArray(categoryOptions)) {
    return ["الكل", ...categoryOptions];
  }
  if (fieldName === "featured") {
    return ["الكل", "مميز فقط", "غير مميز فقط"];
  }
  return ["الكل", ...Array.from(new Set(items.map(x => x[fieldName]).filter(x => x && x !== "")))];
}



  // ==== FILTERED DATA ====
  const filteredItems = items.filter(item =>
  (!showArchived ? item.isActive !== false : item.isActive === false) &&
  (!showFeatured || item.featured === true) &&
  filters.every(filter => {
  const val = filterValues[filter] || "الكل";
  if (val === "الكل") return true;

  if (filter === "category" && Array.isArray(item[filter])) {
    return item[filter].includes(val);
  }
  if (filter === "featured") {
    if (val === "مميز فقط") return item[filter] === true;
    if (val === "غير مميز فقط") return item[filter] === false;
    return true;
  }
  return item[filter] === val;
})

);


  // ==== DATE FORMATTING ====
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

  // ==== OPEN/CLOSE DIALOG ====
  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditMode(true);
      setCurrentId(item.id);
      let newForm = { ...item, imageFile: undefined };
      // التواريخ
      if (item.date && item.date.seconds) {
        const d = new Date(item.date.seconds * 1000);
        newForm.date = d.toISOString().slice(0, 10);
        newForm.time = d.toTimeString().slice(0,5);
      }
      setForm(newForm);
    } else {
      setEditMode(false);
      setCurrentId(null);
      setForm({ ...defaultForm });
    }
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);

  // ==== CHANGE FORM ====
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==== VALIDATE REQUIRED ====
  function validateRequiredFields() {
    for (let f of fields) {
      if (f.required && (!form[f.name] || !form[f.name].toString().trim())) {
        alert(`يرجى إدخال ${f.label}`);
        return false;
      }
    }
    return true;
  }

  // ==== ADD ====
  const handleAdd = async () => {

    if (!validateRequiredFields()) return;
    let dateValue = form.date
      ? Timestamp.fromDate(new Date(`${form.date}T${form.time || "00:00"}`))
      : null;
    const { imageFile, ...formData } = form;
    
    let dataToAdd = { ...formData, date: dateValue, imageUrl: "", isActive: form.isActive, featured: form.featured };
    const docRef = await addDoc(collection(db, collectionName), dataToAdd);
    if (imageFile) {
      await uploadImage({
        file: imageFile,
        storagePath: `${collectionName.toLowerCase()}/${docRef.id}.jpg`,
        firestorePath: [collectionName, docRef.id],
        field: "imageUrl",
      });
    }
    fetchItems();
    handleCloseDialog();
  };

  // ==== EDIT ====
  const handleEdit = async () => {
    if (!validateRequiredFields()) return;
    let dateValue = form.date
      ? Timestamp.fromDate(new Date(`${form.date}T${form.time || "00:00"}`))
      : null;
    const docRef = doc(db, collectionName, currentId);
    const { imageFile, ...formToUpdate } = form;
    let updatedData = { ...formToUpdate, date: dateValue, isActive: form.isActive, featured: form.featured };
    if (imageFile) updatedData.imageUrl = "";
    await updateDoc(docRef, updatedData);
    if (imageFile) {
      if (form.imageUrl) await deleteImage(form.imageUrl);
      await uploadImage({
        file: imageFile,
        storagePath: `${collectionName.toLowerCase()}/${currentId}.jpg`,
        firestorePath: [collectionName, currentId],
        field: "imageUrl",
      });
    }
    fetchItems();
    handleCloseDialog();
  };

  // ==== DELETE ====
  const handleDelete = async (id) => {
    const itemToDelete = items.find(e => e.id === id);
    if (window.confirm("هل أنت متأكد من حذف العنصر نهائيًا؟")) {
      await deleteDoc(doc(db, collectionName, id));
      if (itemToDelete?.imageUrl) await deleteImage(itemToDelete.imageUrl);
      fetchItems();
    }
  };

  // ==== ARCHIVE ====
  const handleArchiveToggle = async (item) => {
    await updateDoc(doc(db, collectionName, item.id), { isActive: !item.isActive });
    fetchItems();
  };

  // ==== RENDER ====
  return (
        <>
    
    <Box sx={{ my: 3 }}>
      <Typography variant="h4" sx={{ mr: 4,mb: 2 }}>إدارة {itemLabel}</Typography>
      <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ mr: 4,mb: 2 }}>
        إضافة {itemLabel} جديدة
      </Button>

      {/* الفلاتر العامة */}
      <FormControlLabel
        control={<Checkbox checked={showArchived} onChange={() => setShowArchived(!showArchived)} />}
        label="عرض المؤرشفة فقط"
        sx={{ mb: 2, mr: 2 }}
      />
      <FormControlLabel
        control={<Checkbox checked={showFeatured} onChange={() => setShowFeatured(!showFeatured)} />}
        label="عرض المميزة فقط"
        sx={{ mb: 2, mr: 2 }}
      />

      {/* الفلاتر حسب الفيلد */}
      {filters.map(filter => (
        <Box sx={{ mb: 2, display: "inline-block", mr: 2 }} key={filter}>
         
          <TextField
            select
            label={fields.find(f => f.name === filter)?.label || filter}
            value={filterValues[filter] || "الكل"}
            onChange={e => setFilterValues(prev => ({ ...prev, [filter]: e.target.value }))}
            SelectProps={{ native: true }}
            sx={{ width: 140 }}
          >
            {getFilterOptions(filter).map((op, idx) => (
              <option key={idx} value={op}>{op}</option>
            ))}


          </TextField>
        </Box>
      ))}

      {/* جدول العناصر */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {fields.map(f => (
                <TableCell key={f.name}>{f.label} </TableCell>
              ))}
              <TableCell>مميزة؟</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>تعديل</TableCell>
              <TableCell>حذف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map(item => (
              <TableRow
                key={item.id}
                sx={{
                  backgroundColor: item.isActive === false ? "#fffbe6" : "inherit",
                  color: item.isActive === false ? "#ff9800" : "inherit"
                }}
              >
                {fields.map(f =>
                  <TableCell key={f.name}>
                    {/* التاريخ أو الوقت */}
                    {(f.name === "date" || f.name === "time") ? formatDateTime(item[f.name])
    : f.name === "category"
      ? (item["category"] || []).join(", ")
      : item[f.name]}
                  </TableCell>
                )}
                <TableCell>
                  {item.featured ? <span style={{ color: "green", fontWeight: "bold" }}>✔</span> : ""}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleArchiveToggle(item)}>
                    {item.isActive === false
                      ? <UnarchiveIcon titleAccess="استعادة" />
                      : <ArchiveIcon titleAccess="أرشفة" />}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(item)}><EditIcon /></IconButton>
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog الإضافة والتعديل */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? `تعديل ${itemLabel}` : `إضافة ${itemLabel}`}</DialogTitle>
        <DialogContent>
          {fields.map(f =>

          f.type === "multiselect" ? (
  <Autocomplete
  multiple
  options={[...categoryOptions, "إضافة تصنيف جديد..."]}
value={form.category || []}
  onChange={async (e, val) => {
    if (val.includes("إضافة تصنيف جديد...")) {
      const newCategory = prompt("ادخل اسم التصنيف الجديد:");
      if (newCategory && !categoryOptions.includes(newCategory)) {
        // أضف التصنيف لفايرستور
        await addDoc(collection(db, "programCategories"), { name: newCategory });
        // حدّث الخيارات
        fetchCategories();
        // أضف التصنيف الجديد للفورم
        setForm({ ...form, category: [...val.filter(v => v !== "إضافة تصنيف جديد..."), newCategory] });
      } else {
        // إذا لم يدخل شيء أو موجود مسبقًا فقط أزل خيار الإضافة
        setForm({ ...form, category: val.filter(v => v !== "إضافة تصنيف جديد...") });
      }
    } else {
      setForm({ ...form, category: val });
    }
  }}
  renderInput={(params) => <TextField {...params} label="التصنيفات" required />}
/>

):
            f.type === "select" ? (
              <TextField
                select
                fullWidth
                key={f.name}
                margin="dense"
                name={f.name}
                label={f.required ? requiredLabel(f.label) : f.label}
                value={form[f.name] || ""}
                onChange={handleChange}
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {(f.name === "category" && categoryOptions.length > 0
                  ? categoryOptions
                  : f.options || []
                ).map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </TextField>
            ) : (
              
              <TextField
                fullWidth
                key={f.name}
                margin="dense"
                name={f.name}
                label={f.required ? requiredLabel(f.label) : f.label}
                type={f.type || "text"}
                value={form[f.name] || ""}
                onChange={handleChange}
                InputLabelProps={f.type === "date" || f.type === "time" ? { shrink: true } : undefined}
              />
            )
          )}
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>صورة {itemLabel}:</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const compressed = await compressImage(file);
                  if (form.imageUrl) {
                    await deleteImage(form.imageUrl);
                  }
                  setForm(prev => ({ ...prev, imageFile: compressed, imageUrl: '' }));
                }
              }}
              style={{ display: 'block', marginBottom: '8px' }}
            />
            {form.imageUrl && (
              <Box mt={1}>
                <Typography variant="body2" color="textSecondary">تم تحميل صورة:</Typography>
                <img src={form.imageUrl} alt="صورة" style={{ width: 100, borderRadius: 4, marginTop: 4 }} />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={async () => {
                    await deleteImage(form.imageUrl);
                    setForm(prev => ({ ...prev, imageUrl: "", imageFile: undefined }));
                  }}
                  style={{ marginRight: 8 }}
                >حذف الصورة</Button>
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
            label={`${itemLabel} فعّالة (غير مؤرشفة)`}
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
            label={`عرض هذه الـ${itemLabel} في الصفحة الرئيسية (مميزة)`}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={editMode ? handleEdit : handleAdd} variant="contained">{editMode ? "تعديل" : "إضافة"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
        </>
    
  );
}
