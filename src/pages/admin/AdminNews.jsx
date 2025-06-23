import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, Grid, CircularProgress, IconButton, Stack,
  TextField, Chip, Checkbox, FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import { collection, getDocs, deleteDoc, doc, addDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../components/firebase';

const categories = ['دورة', 'أمسية', 'فعالية', 'برنامج'];

export default function AdminNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addForm, setAddForm] = useState({
    date: '',
    title: '',
    category: '',
    pictures: [],
    pictureURL: '',
    mainImage: '',
    fullDescription: '',
    featured: false,
    intro: 'عن الخبر',
  });
  const [addError, setAddError] = useState('');

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    title: '',
    category: '',
    pictures: [],
    pictureURL: '',
    mainImage: '',
    fullDescription: '',
    featured: false,
    intro: 'عن الخبر',
  });
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      const snapshot = await getDocs(collection(db, 'News'));
      setNewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchNews();
  }, []);

  const handleAddPicture = () => {
    if (addForm.pictureURL.trim()) {
      setAddForm({
        ...addForm,
        pictures: [...addForm.pictures, addForm.pictureURL.trim()],
        pictureURL: ''
      });
    }
  };

  const handleDeletePicture = (idx) => {
    setAddForm({
      ...addForm,
      pictures: addForm.pictures.filter((_, i) => i !== idx)
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError('');
    setSaving(true);

    if (!addForm.date || !addForm.title || !addForm.category || !addForm.fullDescription || !addForm.pictures) {
      setAddError('الرجاء تعبئة جميع الحقول الأساسية');
      setSaving(false);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'News'), {
        date: addForm.date,
        title: addForm.title,
        category: addForm.category,
        Pictures: addForm.pictures,
        mainImage: addForm.mainImage,
        full_description: addForm.fullDescription,
        featured: addForm.featured,
        intro: addForm.intro,
        createdAt: Timestamp.now(),
      });

      setNewsList([{
        id: docRef.id,
        ...addForm,
      }, ...newsList]);

      setAddForm({
        date: '',
        title: '',
        category: '',
        pictures: [],
        pictureURL: '',
        mainImage: '',
        fullDescription: '',
        featured: false,
        intro: 'عن الخبر',
      });

      setShowAddForm(false);
    } catch (err) {
      setAddError('حدث خطأ أثناء إضافة الخبر');
    } finally {
      setSaving(false);
    }
  };
  const handleEditClick = (news) => {
    setEditId(news.id);
    setEditForm({
      date: news.date || '',
      title: news.title || '',
      category: news.category || '',
      pictures: news.Pictures || [],
      pictureURL: '',
      mainImage: news.mainImage || '',
      fullDescription: news.full_description || '',
      featured: news.featured || false,
      intro: news.intro || 'عن الخبر',
    });
    setEditError('');
  };

  const handleEditPictureAdd = () => {
    if (editForm.pictureURL.trim()) {
      setEditForm({
        ...editForm,
        pictures: [...editForm.pictures, editForm.pictureURL.trim()],
        pictureURL: ''
      });
    }
  };

  const handleEditPictureDelete = (idx) => {
    setEditForm({
      ...editForm,
      pictures: editForm.pictures.filter((_, i) => i !== idx)
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSaving(true);

    if (!editForm.date || !editForm.title || !editForm.category || !editForm.fullDescription || !editForm.pictures) {
      setEditError('الرجاء تعبئة جميع الحقول الأساسية');
      setEditSaving(false);
      return;
    }

    try {
      const docRef = doc(db, 'News', editId);
      await updateDoc(docRef, {
        date: editForm.date,
        title: editForm.title,
        category: editForm.category,
        Pictures: editForm.pictures,
        mainImage: editForm.mainImage,
        full_description: editForm.fullDescription,
        featured: editForm.featured,
        intro: editForm.intro,
      });

      setNewsList(newsList.map(n =>
        n.id === editId
          ? { ...n, ...editForm }
          : n
      ));

      setEditId(null);
    } catch (err) {
      setEditError('حدث خطأ أثناء تعديل الخبر');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا الخبر؟')) {
      await deleteDoc(doc(db, 'News', id));
      setNewsList(newsList.filter((item) => item.id !== id));
    }
  };

  return (
    <AdminDashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" fontWeight="bold" color="black">إدارة الأخبار</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddForm(p => !p)}>
          {showAddForm ? 'إغلاق النموذج' : 'إضافة خبر جديد'}
        </Button>
      </Box>

      {showAddForm && (
        <Box maxWidth={600} mx="auto" mb={5}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={2} color="primary">إضافة خبر جديد</Typography>
            <form onSubmit={handleAddSubmit}>
              <TextField label="التاريخ" value={addForm.date} onChange={e => setAddForm({ ...addForm, date: e.target.value })} fullWidth required sx={{ mb: 2 }} />
              <TextField label="العنوان" value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })} fullWidth required sx={{ mb: 2 }} />
              <TextField label="الصورة الرئيسية" value={addForm.mainImage} onChange={e => setAddForm({ ...addForm, mainImage: e.target.value })} fullWidth required sx={{ mb: 2 }} />
              <FormControlLabel control={<Checkbox checked={addForm.featured} onChange={e => setAddForm({ ...addForm, featured: e.target.checked })} />} label="مميزة (عرض في الصفحة الرئيسية)" sx={{ mb: 2 }} />
              <TextField label="مقدمة" value={addForm.intro} fullWidth InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
              <TextField select label="الفئة" value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })} fullWidth required SelectProps={{ native: true }} sx={{ mb: 2 }}>
                <option value="">اختر الفئة</option>
                {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </TextField>
              <Typography fontWeight="bold">رابط صورة (يمكن إضافة أكثر من صورة):</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TextField label="رابط الصورة" value={addForm.pictureURL} onChange={e => setAddForm({ ...addForm, pictureURL: e.target.value })} fullWidth required sx={{ mt: 1 }} />
                <IconButton color="primary" onClick={handleAddPicture} sx={{ mt: 1 }}><AddPhotoAlternateIcon /></IconButton>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                {addForm.pictures.map((url, idx) => (<Chip key={idx} label={url} onDelete={() => handleDeletePicture(idx)} sx={{ mb: 1, maxWidth: 180 }} />))}
              </Stack>
              <TextField label="نص الخبر الكامل" value={addForm.fullDescription} onChange={e => setAddForm({ ...addForm, fullDescription: e.target.value })} fullWidth required multiline rows={5} sx={{ mb: 2 }} />
              {addError && <Typography color="error" sx={{ mb: 2 }}>{addError}</Typography>}
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ الخبر'}</Button>
            </form>
          </Paper>
        </Box>
      )}

      {loading ? (
        <Box textAlign="center" mt={8}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {newsList.map((news) => (
            <Grid item xs={12} md={6} lg={4} key={news.id}>
              {editId === news.id ? (
                <Paper sx={{ p: 3, minHeight: 220 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>تعديل الخبر</Typography>
                  <form onSubmit={handleEditSubmit}>
                    <TextField label="التاريخ" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} fullWidth required sx={{ mb: 2 }} />
                    <TextField label="العنوان" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} fullWidth required sx={{ mb: 2 }} />
                    <TextField label="الصورة الرئيسية" value={editForm.mainImage} onChange={e => setEditForm({ ...editForm, mainImage: e.target.value })} fullWidth required sx={{ mb: 2 }} />
                    <FormControlLabel control={<Checkbox checked={editForm.featured} onChange={e => setEditForm({ ...editForm, featured: e.target.checked })} />} label="مميزة (عرض في الصفحة الرئيسية)" sx={{ mb: 2 }} />
                    <TextField label="مقدمة" value={editForm.intro} fullWidth InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
                    <TextField select label="الفئة" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} fullWidth required SelectProps={{ native: true }} sx={{ mb: 2 }}>
                      <option value="">اختر الفئة</option>
                      {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                    </TextField>
                    <Typography fontWeight="bold">رابط صورة (يمكن تعديل الصور):</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <TextField label="رابط الصورة" value={editForm.pictureURL} onChange={e => setEditForm({ ...editForm, pictureURL: e.target.value })} fullWidth sx={{ mt: 1 }} />
                      <IconButton color="primary" onClick={handleEditPictureAdd} sx={{ mt: 1 }}><AddPhotoAlternateIcon /></IconButton>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                      {editForm.pictures.map((url, idx) => (<Chip key={idx} label={url} onDelete={() => handleEditPictureDelete(idx)} sx={{ mb: 1, maxWidth: 180 }} />))}
                    </Stack>
                    <TextField label="نص الخبر الكامل" value={editForm.fullDescription} onChange={e => setEditForm({ ...editForm, fullDescription: e.target.value })} fullWidth required multiline rows={5} sx={{ mb: 2 }} />
                    {editError && <Typography color="error" sx={{ mb: 2 }}>{editError}</Typography>}
                    <Stack direction="row" spacing={1}>
                      <Button type="submit" variant="contained" color="primary" disabled={editSaving}>{editSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}</Button>
                      <Button variant="outlined" color="secondary" onClick={() => setEditId(null)}>إلغاء</Button>
                    </Stack>
                  </form>
                </Paper>
              ) : (
                <Paper sx={{ p: 3, minHeight: 220, position: 'relative' }}>
                  <Typography fontSize="15px" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>{news.date}</Typography>
                  <Typography variant="h6" fontWeight="bold">{news.title}</Typography>
                  {news.featured && (
                    <Typography fontSize="13px" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
                      ✓ مميزة
                    </Typography>
                  )}
                  {news.Pictures && news.Pictures[0] && (
                    <img src={news.Pictures[0]} alt={news.title} style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
                  )}
                  <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 12, right: 16 }}>
                    <IconButton color="primary" onClick={() => handleEditClick(news)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(news.id)}><DeleteIcon /></IconButton>
                  </Stack>
                </Paper>
              )}
            </Grid>
          ))}
        </Grid>
      )}
    </AdminDashboardLayout>
  );
}