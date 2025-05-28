import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Chip
} from '@mui/material';
import { db } from '../../components/firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function AdminSections() {
  const [sections, setSections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({});
  const [fieldKey, setFieldKey] = useState('');
  const [newFieldKey, setNewFieldKey] = useState('');

  const fetchSections = async () => {
    const snapshot = await getDocs(collection(db, 'sections'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSections(data);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setCurrentId(null);
    setFormData({});
    setOpenDialog(true);
  };

  const handleOpenEdit = (section) => {
    setIsEdit(true);
    setCurrentId(section.id);
    setFormData({ ...section });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    const dataCopy = { ...formData };
    delete dataCopy.id;

    if (isEdit) {
      await updateDoc(doc(db, 'sections', currentId), dataCopy);
    } else {
      await addDoc(collection(db, 'sections'), dataCopy);
    }

    setOpenDialog(false);
    fetchSections();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'sections', id));
    fetchSections();
  };

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddField = () => {
    if (newFieldKey && !formData[newFieldKey]) {
      setFormData(prev => ({ ...prev, [newFieldKey]: '' }));
      setNewFieldKey('');
    }
  };

  const handleDeleteField = (key) => {
    const updated = { ...formData };
    delete updated[key];
    setFormData(updated);
  };

  return (
    <AdminDashboardLayout>
      <Box sx={{ padding: 4, direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
        <Typography variant="h4" gutterBottom>
          إدارة الأقسام
        </Typography>

        <Button variant="contained" onClick={handleOpenAdd}>
          إضافة قسم جديد
        </Button>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>الاسم</TableCell>
                <TableCell>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((sec) => (
                <TableRow key={sec.id}>
                  <TableCell>{sec.title || sec.name || sec.subtitle || sec.id}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEdit(sec)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(sec.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>{isEdit ? 'تعديل القسم' : 'إضافة قسم'}</DialogTitle>
          <DialogContent>
            {Object.keys(formData).map((key) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <TextField
                  label={key}
                  value={formData[key]}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  fullWidth
                />
                <IconButton onClick={() => handleDeleteField(key)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Box mt={3} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="إضافة حقل جديد"
                value={newFieldKey}
                onChange={(e) => setNewFieldKey(e.target.value)}
              />
              <Button variant="outlined" onClick={handleAddField}>
                إضافة الحقل
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
            <Button onClick={handleSave} variant="contained">حفظ</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminDashboardLayout>
  );
}
