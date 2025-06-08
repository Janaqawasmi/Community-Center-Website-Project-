import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, Grid, CircularProgress, IconButton, Stack, TextField, Chip
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

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addForm, setAddForm] = useState({
    date: '',
    title: '',
    subtitle: '',
    category: '',
    pictures: [],
    pictureURL: '',
    fullDescription: '',
  });
  const [addError, setAddError] = useState('');

  // Edit form state
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    title: '',
    subtitle: '',
    category: '',
    pictures: [],
    pictureURL: '',
    fullDescription: '',
  });
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Fetch news
  useEffect(() => {
    async function fetchNews() {
      const snapshot = await getDocs(collection(db, 'News'));
      setNewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchNews();
  }, []);

  // Add functions
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

    if (!addForm.date || !addForm.title || !addForm.category || !addForm.fullDescription ||!addForm.pictures) {
      setAddError('الرجاء تعبئة جميع الحقول الأساسية');
      setSaving(false);
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'News'), {
        date: addForm.date,
        title: addForm.title,
        subtitle: addForm.subtitle,
        category: addForm.category,
        Pictures: addForm.pictures,
        full_description: addForm.fullDescription,
        createdAt: Timestamp.now(),
      });
      setNewsList([
        {
          id: docRef.id,
          date: addForm.date,
          title: addForm.title,
          subtitle: addForm.subtitle,
          category: addForm.category,
          Pictures: addForm.pictures,
          full_description: addForm.fullDescription,
        },
        ...newsList,
      ]);
      setAddForm({
        date: '',
        title: '',
        subtitle: '',
        category: '',
        pictures: [],
        pictureURL: '',
        fullDescription: '',
      });
      setAddError('');
      setShowAddForm(false);
    } catch (err) {
      setAddError('حدث خطأ أثناء إضافة الخبر');
    } finally {
      setSaving(false);
    }
  };

  // Edit functions
  const handleEditClick = (news) => {
    setEditId(news.id);
    setEditForm({
      date: news.date || '',
      title: news.title,
      subtitle: news.subtitle || '',
      category: news.category || '',
      pictures: news.Pictures || [],
      pictureURL: '',
      fullDescription: news.full_description || '',
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
    if (!editForm.date || !editForm.title || !editForm.category || !editForm.fullDescription||!addForm.pictures) {
      setEditError('الرجاء تعبئة جميع الحقول الأساسية');
      setEditSaving(false);
      return;
    }
    try {
      const docRef = doc(db, 'News', editId);
      await updateDoc(docRef, {
        date: editForm.date,
        title: editForm.title,
        subtitle: editForm.subtitle,
        category: editForm.category,
        Pictures: editForm.pictures,
        full_description: editForm.fullDescription,
      });
      setNewsList(newsList.map(n =>
        n.id === editId
          ? {
              ...n,
              date: editForm.date,
              title: editForm.title,
              subtitle: editForm.subtitle,
              category: editForm.category,
              Pictures: editForm.pictures,
              full_description: editForm.fullDescription,
            }
          : n
      ));
      setEditId(null);
      setEditError('');
    } catch (err) {
      setEditError('حدث خطأ أثناء تعديل الخبر');
    } finally {
      setEditSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا الخبر؟')) {
      await deleteDoc(doc(db, 'News', id));
      setNewsList(newsList.filter((item) => item.id !== id));
    }
  };

  return (
    <AdminDashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" fontWeight="bold" color="black">
          إدارة الأخبار
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? 'إغلاق النموذج' : 'إضافة خبر جديد'}
        </Button>
      </Box>

      {/* Add News Form */}
      {showAddForm && (
        <Box maxWidth={600} mx="auto" mb={5}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
              إضافة خبر جديد
            </Typography>
            <form onSubmit={handleAddSubmit}>
              <TextField
                label="التاريخ"
                value={addForm.date}
                onChange={e => setAddForm({ ...addForm, date: e.target.value })}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="العنوان"
                value={addForm.title}
                onChange={e => setAddForm({ ...addForm, title: e.target.value })}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="العنوان الفرعي"
                value={addForm.subtitle}
                onChange={e => setAddForm({ ...addForm, subtitle: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                select
                label="الفئة"
                value={addForm.category}
                onChange={e => setAddForm({ ...addForm, category: e.target.value })}
                fullWidth
                required
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
              >
                <option value="">اختر الفئة</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </TextField>
              <Typography fontWeight="bold" sx={{ mt: 1 }}>رابط صورة (يمكن إضافة أكثر من صورة):</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TextField
                  label="رابط الصورة"
                  value={addForm.pictureURL}
                  onChange={e => setAddForm({ ...addForm, pictureURL: e.target.value })}
                  fullWidth
                  required
                  sx={{ mt: 1 }}
                />
                <IconButton color="primary" onClick={handleAddPicture} sx={{ mt: 1 }}>
                  <AddPhotoAlternateIcon />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                {addForm.pictures.map((url, idx) => (
                  <Chip
                    key={idx}
                    label={url}
                    onDelete={() => handleDeletePicture(idx)}
                    sx={{ mb: 1, maxWidth: 180, overflow: 'hidden' }}
                  />
                ))}
              </Stack>
              <TextField
                label="نص الخبر الكامل"
                value={addForm.fullDescription}
                onChange={e => setAddForm({ ...addForm, fullDescription: e.target.value })}
                fullWidth
                required
                multiline
                rows={5}
                sx={{ mb: 2 }}
              />
              {addError && (
                <Typography color="error" sx={{ mb: 2 }}>{addError}</Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={saving}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ الخبر'}
              </Button>
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
                // --------- EDIT FORM ---------
                <Paper sx={{ p: 3, minHeight: 220, position: 'relative', background: '#f9f9f9' }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    تعديل الخبر
                  </Typography>
                  <form onSubmit={handleEditSubmit}>
                    <TextField
                      label="التاريخ"
                      value={editForm.date}
                      onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="العنوان"
                      value={editForm.title}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="العنوان الفرعي"
                      value={editForm.subtitle}
                      onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      select
                      label="الفئة"
                      value={editForm.category}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                      fullWidth
                      required
                      SelectProps={{ native: true }}
                      sx={{ mb: 2 }}
                    >
                      <option value="">اختر الفئة</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </TextField>
                    <Typography fontWeight="bold" sx={{ mt: 1 }}>رابط صورة (يمكن إضافة أكثر من صورة):</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <TextField
                        label="رابط الصورة"
                        value={editForm.pictureURL}
                        onChange={e => setEditForm({ ...editForm, pictureURL: e.target.value })}
                        fullWidth
                        sx={{ mt: 1 }}
                      />
                      <IconButton color="primary" onClick={handleEditPictureAdd} sx={{ mt: 1 }}>
                        <AddPhotoAlternateIcon />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                      {editForm.pictures.map((url, idx) => (
                        <Chip
                          key={idx}
                          label={url}
                          onDelete={() => handleEditPictureDelete(idx)}
                          sx={{ mb: 1, maxWidth: 180, overflow: 'hidden' }}
                        />
                      ))}
                    </Stack>
                    <TextField
                      label="نص الخبر الكامل"
                      value={editForm.fullDescription}
                      onChange={e => setEditForm({ ...editForm, fullDescription: e.target.value })}
                      fullWidth
                      required
                      multiline
                      rows={5}
                      sx={{ mb: 2 }}
                    />
                    {editError && (
                      <Typography color="error" sx={{ mb: 2 }}>{editError}</Typography>
                    )}
                    <Stack direction="row" spacing={1}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={editSaving}
                      >
                        {editSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setEditId(null)}
                        sx={{ ml: 1 }}
                      >
                        إلغاء
                      </Button>
                    </Stack>
                  </form>
                </Paper>
              ) : (
                // --------- NEWS CARD ---------
                <Paper sx={{ p: 3, minHeight: 220, position: 'relative' }}>
                  <Typography fontSize="15px" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                    {news.date}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {news.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#444' }}>
                    {news.subtitle}
                  </Typography>
                  {news.Pictures && news.Pictures[0] && (
                    <img
                      src={news.Pictures[0]}
                      alt={news.title}
                      style={{
                        width: '100%',
                        height: 110,
                        objectFit: 'cover',
                        borderRadius: 8,
                        marginBottom: 12,
                        background: '#eee',
                      }}
                    />
                  )}
                  <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 12, right: 16 }}>
                    <IconButton color="primary" onClick={() => handleEditClick(news)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(news.id)}>
                      <DeleteIcon />
                    </IconButton>
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
