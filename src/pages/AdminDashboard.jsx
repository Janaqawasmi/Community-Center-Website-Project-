// src/pages/AdminDashboard.jsx
/*
This acts as the main admin page, showing an overview of all sections and letting the admin choose which section to edit.

You could think of it like a menu or homepage for the admin.*/


import { useState, useEffect } from 'react';
import { db } from '../components/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import {
  Container, Typography, TextField, Button, Grid, Paper
} from '@mui/material';

export default function AdminDashboard() {
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', imageURL: '' });

  useEffect(() => {
    const fetchSections = async () => {
      const querySnapshot = await getDocs(collection(db, 'sections'));
      const sectionList = [];
      querySnapshot.forEach(doc => {
        sectionList.push({ id: doc.id, ...doc.data() });
      });
      setSections(sectionList);
    };
    fetchSections();
  }, []);

  const handleSelect = (section) => {
    setSelected(section);
    setForm({ title: section.title || '', subtitle: section.subtitle || '', imageURL: section.imageURL || '' });
  };

  const handleSave = async () => {
    if (!selected) return;
    const sectionRef = doc(db, 'sections', selected.id);
    await updateDoc(sectionRef, {
      title: form.title,
      subtitle: form.subtitle,
      imageURL: form.imageURL,
    });
    alert('Section updated successfully');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>🛠 لوحة تحكم المدير</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6">الأقسام:</Typography>
          {sections.map(sec => (
            <Paper key={sec.id} onClick={() => handleSelect(sec)} sx={{ p: 2, mb: 1, cursor: 'pointer' }}>
              {sec.title || sec.id}
            </Paper>
          ))}
        </Grid>
        <Grid item xs={12} md={8}>
          {selected && (
            <>
              <Typography variant="h6">تعديل القسم: {selected.id}</Typography>
              <TextField fullWidth label="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} sx={{ my: 1 }} />
              <TextField fullWidth label="الوصف" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} sx={{ my: 1 }} />
              <TextField fullWidth label="رابط الصورة" value={form.imageURL} onChange={(e) => setForm({ ...form, imageURL: e.target.value })} sx={{ my: 1 }} />
              <Button variant="contained" color="primary" onClick={handleSave}>💾 حفظ التغييرات</Button>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
