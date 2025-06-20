import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../components/firebase';
import AdminItemsManager from './AdminItemsManager';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, List, ListItem, ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminDashboardLayout from "../../../components/AdminDashboardLayout";

export default function AdminPrograms() {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [openCategoriesDialog, setOpenCategoriesDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // جلب التصنيفات من فايرستور
  const fetchCategories = async () => {
    const snap = await getDocs(collection(db, "programCategories"));
    setCategoryOptions(snap.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    })));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // حذف تصنيف
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
      await deleteDoc(doc(db, "programCategories", categoryId));
      fetchCategories();
    }
  };

  // إضافة تصنيف جديد
  const handleAddCategory = async () => {
    if (newCategory.trim() === '') return;
    await addDoc(collection(db, "programCategories"), { name: newCategory.trim() });
    setNewCategory('');
    fetchCategories();
  };

  return (
            <AdminDashboardLayout>
    
    
      {/* العنوان وزر إدارة التصنيفات وزر إضافة دورة */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
       
        <Box>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mr: 150, mt: 4 }}
            onClick={() => setOpenCategoriesDialog(true)}
          >
            إدارة التصنيفات
          </Button>
        </Box>
      </Box>

      {/* Dialog إدارة التصنيفات */}
      <Dialog open={openCategoriesDialog} onClose={() => setOpenCategoriesDialog(false)}>
        <DialogTitle>إدارة التصنيفات</DialogTitle>
        <DialogContent>
          <List>
            {categoryOptions.map(cat => (
              <ListItem key={cat.id}
                secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => handleDeleteCategory(cat.id)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                <ListItemText primary={cat.name} />
              </ListItem>
            ))}
          </List>
          <TextField
            fullWidth
            margin="dense"
            label="تصنيف جديد"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAddCategory();
            }}
          />
          <Button variant="contained" color="primary" onClick={handleAddCategory} sx={{ mt: 1 }}>
            إضافة تصنيف
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoriesDialog(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>

      <AdminItemsManager
        collectionName="programs"
        itemLabel="الدورات"
        fields={[
          { name: "name", label: "اسم الدورة", required: true },
          { name: "category", label: "التصنيفات", required: true, type: "multiselect" },
          { name: "price", label: "السعر", required: true, type: "number" },
          { name: "capacity", label: "عدد المقاعد", required: true, type: "number" },
          { name: "classNumber", label: "חוג", required: true },
          { name: "groupNumber", label: "קבוצה", required: true },
          { name: "digit5", label: "ספרה 5", required: true },
          { name: "description", label: "الوصف" },
          { name: "date", label: "تاريخ الدورة", type: "date" },
          { name: "time", label: "وقت الدورة", type: "time" },
        ]}
        filters={["category", "classNumber", "groupNumber", "featured"]}
        categoryOptions={categoryOptions.map(c => c.name)}
        fetchCategories={fetchCategories}
      />
    </AdminDashboardLayout>
  );
}
