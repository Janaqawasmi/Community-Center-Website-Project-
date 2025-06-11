import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../components/firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

export default function AdminFooter() {
  const [footerData, setFooterData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newFieldKey, setNewFieldKey] = useState('');

  const docRef = doc(db, 'siteInfo', '9ib8qFqM732MnT1g6YGz');

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFooterData(docSnap.data());
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleFieldChange = (key, value) => {
    setFooterData(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteField = (key) => {
    const updated = { ...footerData };
    delete updated[key];
    setFooterData(updated);
  };

  const handleAddField = () => {
    if (newFieldKey && !footerData[newFieldKey]) {
      setFooterData(prev => ({ ...prev, [newFieldKey]: '' }));
      setNewFieldKey('');
    }
  };

  const handleSave = async () => {
    await updateDoc(docRef, footerData);
    setEditMode(false);
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <Box p={4} textAlign="center">
          <Typography>جاري تحميل بيانات التذييل...</Typography>
        </Box>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <Box sx={{ padding: 4, direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
        <Typography variant="h4" gutterBottom>
          إدارة معلومات التذييل
        </Typography>

        <Button variant="contained" onClick={() => setEditMode(true)}>
          تعديل معلومات التذييل
        </Button>

        <Box component={Paper} sx={{ mt: 4, p: 3 }}>
          {Object.entries(footerData).map(([key, value]) => (
            <Box key={key} mb={2}>
              <Typography variant="subtitle2">{key}</Typography>
              <Typography variant="body1" sx={{ direction: 'ltr' }}>{value}</Typography>
            </Box>
          ))}
        </Box>

        <Dialog open={editMode} onClose={() => setEditMode(false)} maxWidth="md" fullWidth>
          <DialogTitle>تعديل معلومات التذييل</DialogTitle>
          <DialogContent>
            {Object.keys(footerData).map((key) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <TextField
                  label={key}
                  value={footerData[key]}
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
            <Button onClick={() => setEditMode(false)}>إلغاء</Button>
            <Button onClick={handleSave} variant="contained">حفظ</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminDashboardLayout>
  );
}
