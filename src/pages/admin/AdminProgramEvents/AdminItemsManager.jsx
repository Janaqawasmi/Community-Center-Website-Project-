import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Checkbox, FormControlLabel,
  CircularProgress, Backdrop
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
import { withProgress } from "../../../utils/withProgress";

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

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
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // ==== INIT FORM ====
  const defaultForm = {};
  fields.forEach(f => defaultForm[f.name] = f.default || "");
  defaultForm.featured = false;
  defaultForm.isActive = true;
  defaultForm.imageFile = undefined;

  // ==== FETCH DATA ====
  const fetchItems = async () => {
    try {
      setLoading(true);
      NProgress.start();
      const snapshot = await getDocs(collection(db, collectionName));
      const list = snapshot.docs.map(docu => ({
        id: docu.id,
        ...docu.data(),
        isActive: docu.data().isActive !== undefined ? docu.data().isActive : true,
        featured: docu.data().featured !== undefined ? docu.data().featured : false,
      }));
      setItems(list);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
      NProgress.done();
    }
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
    
    try {
      setActionLoading(true);
      NProgress.start();
      
      let dateValue = form.date
        ? Timestamp.fromDate(new Date(`${form.date}T${form.time || "00:00"}`))
        : null;
      const { imageFile, ...formData } = form;
      
      let dataToAdd = { ...formData, date: dateValue, imageUrl: "", isActive: form.isActive, featured: form.featured };
      const docRef = await addDoc(collection(db, collectionName), dataToAdd);
      
      if (imageFile) {
        setImageUploading(true);
        await uploadImage({
          file: imageFile,
          storagePath: `${collectionName.toLowerCase()}/${docRef.id}.jpg`,
          firestorePath: [collectionName, docRef.id],
          field: "imageUrl",
        });
        setImageUploading(false);
      }
      
      await fetchItems();
      handleCloseDialog();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("حدث خطأ أثناء إضافة العنصر");
    } finally {
      setActionLoading(false);
      setImageUploading(false);
      NProgress.done();
    }
  };

  // ==== EDIT ====
  const handleEdit = async () => {
    if (!validateRequiredFields()) return;
    
    try {
      setActionLoading(true);
      NProgress.start();
      
      let dateValue = form.date
        ? Timestamp.fromDate(new Date(`${form.date}T${form.time || "00:00"}`))
        : null;
      const docRef = doc(db, collectionName, currentId);
      const { imageFile, ...formToUpdate } = form;
      let updatedData = { ...formToUpdate, date: dateValue, isActive: form.isActive, featured: form.featured };
      if (imageFile) updatedData.imageUrl = "";
      
      await updateDoc(docRef, updatedData);
      
      if (imageFile) {
        setImageUploading(true);
        if (form.imageUrl) await deleteImage(form.imageUrl);
        await uploadImage({
          file: imageFile,
          storagePath: `${collectionName.toLowerCase()}/${currentId}.jpg`,
          firestorePath: [collectionName, currentId],
          field: "imageUrl",
        });
        setImageUploading(false);
      }
      
      await fetchItems();
      handleCloseDialog();
    } catch (error) {
      console.error("Error editing item:", error);
      alert("حدث خطأ أثناء تعديل العنصر");
    } finally {
      setActionLoading(false);
      setImageUploading(false);
      NProgress.done();
    }
  };

  // ==== DELETE ====
  const handleDelete = async (id) => {
    const itemToDelete = items.find(e => e.id === id);
    if (window.confirm("هل أنت متأكد من حذف العنصر نهائيًا؟")) {
      try {
        setActionLoading(true);
        NProgress.start();
        
        await deleteDoc(doc(db, collectionName, id));
        if (itemToDelete?.imageUrl) await deleteImage(itemToDelete.imageUrl);
        await fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("حدث خطأ أثناء حذف العنصر");
      } finally {
        setActionLoading(false);
        NProgress.done();
      }
    }
  };

  // ==== ARCHIVE ====
  const handleArchiveToggle = async (item) => {
    try {
      setActionLoading(true);
      NProgress.start();
      
      await updateDoc(doc(db, collectionName, item.id), { isActive: !item.isActive });
      await fetchItems();
    } catch (error) {
      console.error("Error toggling archive:", error);
      alert("حدث خطأ أثناء تغيير حالة الأرشفة");
    } finally {
      setActionLoading(false);
      NProgress.done();
    }
  };

  // Loading component
  const LoadingSpinner = ({ size = 40 }) => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress size={size} />
      <Typography variant="body2" sx={{ ml: 2 }}>جاري التحميل...</Typography>
    </Box>
  );

  // ==== RENDER ====
  return (
    <>
      {/* Action Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={actionLoading}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {imageUploading ? "جاري رفع الصورة..." : "جاري المعالجة..."}
          </Typography>
        </Box>
      </Backdrop>

      <Box sx={{ my: 3 }}>
        <Typography variant="h4" sx={{ mr: 4, mb: 2 }}>إدارة {itemLabel}</Typography>
        <Button 
          variant="contained" 
          onClick={() => handleOpenDialog()} 
          sx={{ mr: 4, mb: 2 }}
          disabled={loading || actionLoading}
        >
          إضافة {itemLabel} جديدة
        </Button>

        {/* الفلاتر العامة */}
        <FormControlLabel
          control={<Checkbox checked={showArchived} onChange={() => setShowArchived(!showArchived)} />}
          label="عرض المؤرشفة فقط"
          sx={{ mb: 2, mr: 2 }}
          disabled={loading}
        />
        <FormControlLabel
          control={<Checkbox checked={showFeatured} onChange={() => setShowFeatured(!showFeatured)} />}
          label="عرض المميزة فقط"
          sx={{ mb: 2, mr: 2 }}
          disabled={loading}
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
              disabled={loading}
            >
              {getFilterOptions(filter).map((op, idx) => (
                <option key={idx} value={op}>{op}</option>
              ))}
            </TextField>
          </Box>
        ))}

        {/* Loading state for initial data fetch */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          /* جدول العناصر */
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {fields.map(f => (
                    <TableCell key={f.name}>{f.label}</TableCell>
                  ))}
                  <TableCell>مميزة؟</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>تعديل</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={fields.length + 4} align="center">
                      <Typography variant="body2" color="textSecondary">
                        لا توجد عناصر للعرض
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map(item => (
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
                        <IconButton 
                          onClick={() => handleArchiveToggle(item)}
                          disabled={actionLoading}
                        >
                          {item.isActive === false
                            ? <UnarchiveIcon titleAccess="استعادة" />
                            : <ArchiveIcon titleAccess="أرشفة" />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenDialog(item)}
                          disabled={actionLoading}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(item.id)}
                          disabled={actionLoading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog الإضافة والتعديل */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{editMode ? `تعديل ${itemLabel}` : `إضافة ${itemLabel}`}</DialogTitle>
          <DialogContent>
            {fields.map(f =>
              f.type === "multiselect" ? (
                <Autocomplete
                  key={f.name}
                  multiple
                  options={[...categoryOptions, "إضافة تصنيف جديد..."]}
                  value={form.category || []}
                  onChange={async (e, val) => {
                    if (val.includes("إضافة تصنيف جديد...")) {
                      const newCategory = prompt("ادخل اسم التصنيف الجديد:");
                      if (newCategory && !categoryOptions.includes(newCategory)) {
                        setActionLoading(true);
                        await addDoc(collection(db, "programCategories"), { name: newCategory });
                        fetchCategories();
                        setForm({ ...form, category: [...val.filter(v => v !== "إضافة تصنيف جديد..."), newCategory] });
                        setActionLoading(false);
                      } else {
                        setForm({ ...form, category: val.filter(v => v !== "إضافة تصنيف جديد...") });
                      }
                    } else {
                      setForm({ ...form, category: val });
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="التصنيفات" required />}
                  disabled={actionLoading}
                  sx={{ mb: 2 }}
                />
              ) : f.type === "select" ? (
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
                  disabled={actionLoading}
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
                  disabled={actionLoading}
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
                    setImageUploading(true);
                    try {
                      const compressed = await compressImage(file);
                      if (form.imageUrl) {
                        await deleteImage(form.imageUrl);
                      }
                      setForm(prev => ({ ...prev, imageFile: compressed, imageUrl: '' }));
                    } catch (error) {
                      console.error("Error processing image:", error);
                      alert("حدث خطأ أثناء معالجة الصورة");
                    } finally {
                      setImageUploading(false);
                    }
                  }
                }}
                style={{ display: 'block', marginBottom: '8px' }}
                disabled={actionLoading || imageUploading}
              />
              
              {imageUploading && (
                <Box display="flex" alignItems="center" mt={1}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>جاري معالجة الصورة...</Typography>
                </Box>
              )}
              
              {form.imageUrl && (
                <Box mt={1}>
                  <Typography variant="body2" color="textSecondary">تم تحميل صورة:</Typography>
                  <img src={form.imageUrl} alt="صورة" style={{ width: 100, borderRadius: 4, marginTop: 4 }} />
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={async () => {
                      setActionLoading(true);
                      try {
                        await deleteImage(form.imageUrl);
                        setForm(prev => ({ ...prev, imageUrl: "", imageFile: undefined }));
                      } catch (error) {
                        console.error("Error deleting image:", error);
                        alert("حدث خطأ أثناء حذف الصورة");
                      } finally {
                        setActionLoading(false);
                      }
                    }}
                    style={{ marginRight: 8 }}
                    disabled={actionLoading}
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
                  disabled={actionLoading}
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
                  disabled={actionLoading}
                />
              }
              label={`عرض هذه الـ${itemLabel} في الصفحة الرئيسية (مميزة)`}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={actionLoading}>إلغاء</Button>
            <Button 
              onClick={editMode ? handleEdit : handleAdd} 
              variant="contained"
              disabled={actionLoading || imageUploading}
            >
              {actionLoading ? (
                <Box display="flex" alignItems="center">
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  {editMode ? "جاري التعديل..." : "جاري الإضافة..."}
                </Box>
              ) : (
                editMode ? "تعديل" : "إضافة"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}