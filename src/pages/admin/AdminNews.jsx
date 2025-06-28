// Final version of AdminNews.jsx with previews, delete icons, Arabic labels, and URL input

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Checkbox, FormControlLabel, MenuItem
} from '@mui/material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../components/firebase';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { uploadImage } from '../../utils/uploadImage';
import LinkIcon from '@mui/icons-material/Link'; 
const categories = ['دورة', 'أمسية', 'فعالية', 'برنامج'];

export default function AdminNews() {
  const [newsList, setNewsList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
const [urlInput, setUrlInput] = useState('');
const [mainImageUrlInput, setMainImageUrlInput] = useState('');
const [picturesUrlInput, setPicturesUrlInput] = useState('');
  const [form, setForm] = useState({
    date: '',
    title: '',
    category: '',
    mainImage: '',
    pictures: [],
    fullDescription: '',
    featured: false,
  });
const generateSlug = (title) =>
  title.trim().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF\-]/g, "").toLowerCase();

  useEffect(() => {
    fetchNews();
  }, []);


  const fetchNews = async () => {
    const snapshot = await getDocs(collection(db, 'News'));
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNewsList(items);
  };

  const handleOpenDialog = (news = null) => {
    if (news) {
      setEditMode(true);
      setCurrentId(news.id);
      setForm({
        date: news.date || '',
        title: news.title || '',
        category: news.category || '',
        mainImage: news.mainImage || '',
        pictures: news.Pictures || [],
        fullDescription: news.full_description || '',
        featured: news.featured || false,
      });
    } else {
      setEditMode(false);
      setForm({ date: '', title: '', category: '', mainImage: '', pictures: [], fullDescription: '', featured: false });
    }
    setOpenDialog(true);

  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentId(null);
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadImage({
          file,
          storagePath: `news/main_${Date.now()}_${file.name}`,
          firestorePath: null
        });
        setForm(prev => ({ ...prev, mainImage: url }));
      } catch (err) {
        alert('فشل رفع الصورة');
      }
    }
  };

  const handlePicturesUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploaded = [];
    for (const file of files) {
      try {
        const url = await uploadImage({
          file,
          storagePath: `news/pic_${Date.now()}_${file.name}`,
          firestorePath: null
        });
        uploaded.push(url);
      } catch (err) {
        alert('فشل رفع صورة من الصور');
      }
    }
    setForm(prev => ({ ...prev, pictures: [...prev.pictures, ...uploaded] }));
  };

const handleSave = async () => {
  const { title, date, category, mainImage, pictures, fullDescription, featured } = form;
  if (!title || !date || !category || !mainImage || !pictures.length || !fullDescription) {
    alert('يرجى تعبئة جميع الحقول المطلوبة');
    return;
  }

  const slug = generateSlug(title);

  const data = {
    title,
    date,
    category,
    mainImage,
    Pictures: pictures,
    full_description: fullDescription,
    featured,
    slug,
    createdAt: Timestamp.now()
  };

  if (editMode) {
    await updateDoc(doc(db, 'News', currentId), data);
  } else {
    await addDoc(collection(db, 'News'), data);
  }

  fetchNews();
  handleCloseDialog();
};

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('هل انت متاكد انك تريد حذف هذا الخبر؟');
    if (confirmDelete) {
      deleteDoc(doc(db, 'News', id)).then(fetchNews);

    }
  };

  const filteredNews = newsList.filter(n =>
    (!filterCategory || n.category === filterCategory) &&
    (!filterDate || n.date === filterDate)
  );

  return (
    <AdminDashboardLayout>
      <Box sx={{ my: 4, px: 2 }}>
        <Typography variant="h4" gutterBottom>إدارة الأخبار</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField label="تاريخ" type="date" InputLabelProps={{ shrink: true }} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          <TextField label="الفئة" select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="">الكل</MenuItem>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <Button variant="contained" onClick={() => handleOpenDialog()}>إضافة خبر جديد</Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>التاريخ</TableCell>
                <TableCell>العنوان</TableCell>
                <TableCell>الفئة</TableCell>
                <TableCell>مميزة؟</TableCell>
                <TableCell>تعديل</TableCell>
                <TableCell>حذف</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNews.map(news => (
                <TableRow key={news.id}>
                  <TableCell>{news.date}</TableCell>
                  <TableCell>{news.title}</TableCell>
                  <TableCell>{news.category}</TableCell>
                  <TableCell>{news.featured ? '✔' : ''}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDialog(news)}><EditIcon /></IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(news.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editMode ? 'تعديل الخبر' : 'إضافة خبر جديد'}</DialogTitle>
          <DialogContent>
            <TextField label="التاريخ" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} fullWidth required sx={{ my: 1 }} InputLabelProps={{ shrink: true }} />
            <TextField label="العنوان" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth required sx={{ my: 1 }} />
            <TextField select label="الفئة" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} fullWidth required sx={{ my: 1 }}>
              {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </TextField>

        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>الصورة الرئيسية:</Typography>

{/* File Upload Button */}
<Button component="label" variant="outlined" sx={{ my: 1 }}>
  اختر الصورة من الجهاز
  <input hidden accept="image/*" type="file" onChange={handleMainImageUpload} />
</Button>

{/* OR URL input with label and button */}
<Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
  <TextField
  size="small"
  label="أو أدخل رابط الصورة"
  value={mainImageUrlInput}
  onChange={(e) => setMainImageUrlInput(e.target.value)}
  fullWidth
/>
<Button
  variant="outlined"
  startIcon={<LinkIcon />}
  onClick={() => {
    const url = mainImageUrlInput.trim();
    if (!url) return;

    const testImage = new Image();
    testImage.onload = () => {
      setForm(prev => ({
        ...prev,
        mainImage: url
      }));
      setMainImageUrlInput('');
    };
    testImage.onerror = () => {
      alert('الرابط لا يشير إلى صورة صالحة. يرجى التحقق من الرابط.');
    };
    testImage.src = url;
  }}
>
  إضافة
</Button>

</Box>

            {form.mainImage && (
              <Box sx={{ mt: 1, position: 'relative', width: 100 }}>
                <img src={form.mainImage} alt="main" style={{ width: '100%', borderRadius: 4 }} />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white' }}
                  onClick={() => setForm(prev => ({ ...prev, mainImage: '' }))}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>صور إضافية:</Typography>
            <Button component="label" variant="outlined" sx={{ my: 1 }}>
              اختر صور إضافية
              <input hidden accept="image/*" type="file" multiple onChange={handlePicturesUpload} />
            </Button>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', my: 1 }}>
              {form.pictures.map((url, idx) => (
                <Box key={idx} sx={{ position: 'relative' }}>
                  <img src={url} alt={`preview-${idx}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white' }}
                    onClick={() => {
                      const updated = form.pictures.filter((_, i) => i !== idx);
                      setForm(prev => ({ ...prev, pictures: updated }));
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>

         <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
  <TextField
    size="small"
    placeholder="أدخل رابط صورة إضافية"
    value={picturesUrlInput}
    onChange={(e) => setPicturesUrlInput(e.target.value)}
    sx={{ flexGrow: 1 }}
  />
  <Button
    variant="outlined"
    startIcon={<LinkIcon />}
    onClick={() => {
      const url = picturesUrlInput.trim();
      if (!url) return;

      const testImage = new Image();
      testImage.onload = () => {
        setForm(prev => ({
          ...prev,
          pictures: [...prev.pictures, url]
        }));
        setPicturesUrlInput('');
      };
      testImage.onerror = () => {
        alert('الرابط لا يشير إلى صورة صالحة. يرجى التحقق من الرابط.');
      };
      testImage.src = url;
    }}
  >
    إضافة
  </Button>
</Box>

</Box>


            <TextField label="نص الخبر الكامل" value={form.fullDescription} onChange={e => setForm({ ...form, fullDescription: e.target.value })} fullWidth required multiline rows={4} sx={{ my: 2 }} />
            <FormControlLabel control={<Checkbox checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />} label="مميزة (عرض في الصفحة الرئيسية)" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>إلغاء</Button>
            <Button onClick={handleSave} variant="contained">{editMode ? 'تعديل' : 'إضافة'}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminDashboardLayout>
  );
}
