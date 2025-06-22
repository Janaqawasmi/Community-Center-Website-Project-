import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  List, ListItem, ListItemText, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "../../../components/firebase";
import {
  collection, getDocs, addDoc, deleteDoc, doc, query, where, updateDoc, arrayRemove
} from "firebase/firestore";

// دالة لحذف التصنيف من كل الدورات
const deleteCategoryFromPrograms = async (categoryName) => {
  const q = query(collection(db, "programs"), where("category", "array-contains", categoryName));
  const snapshot = await getDocs(q);
  const batchUpdates = snapshot.docs.map(programDoc =>
    updateDoc(doc(db, "programs", programDoc.id), {
      category: arrayRemove(categoryName)
    })
  );
  await Promise.all(batchUpdates);
};

export default function CategoryManager({ open, onClose, onCategoriesChanged }) {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // جلب التصنيفات
 const fetchCategories = async () => {
  const snap = await getDocs(collection(db, "programCategories"));
  setCategoryOptions(snap.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name
  })));
  // هنا أضف السطر التالي:
  if (props.setCategoryOptions) {
    props.setCategoryOptions(snap.docs.map(doc => doc.data().name));
  }
};

  useEffect(() => {
    if (open) fetchCategories();
    // eslint-disable-next-line
  }, [open]);

  // حذف تصنيف مع التحقق
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`هل أنت متأكد من حذف التصنيف "${categoryName}" من النظام وجميع الدورات؟`)) {
      // 1. حذف التصنيف من كولكشن التصنيفات
      await deleteDoc(doc(db, "programCategories", categoryId));
      // 2. حذف التصنيف من جميع الدورات التي تحتويه
      await deleteCategoryFromPrograms(categoryName);
      fetchCategories();
    }
  };

  // إضافة تصنيف جديد
  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return;
    await addDoc(collection(db, "programCategories"), { name: newCategory.trim() });
    setNewCategory("");
    fetchCategories();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>إدارة التصنيفات</DialogTitle>
      <DialogContent>
        <List>
          {categoryOptions.map(cat => (
            <ListItem key={cat.id}
              secondaryAction={
                <IconButton edge="end" color="error" onClick={() => handleDeleteCategory(cat.id, cat.name)}>
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
            if (e.key === "Enter") handleAddCategory();
          }}
        />
        <Button variant="contained" color="primary" onClick={handleAddCategory} sx={{ mt: 1 }}>
          إضافة تصنيف
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إغلاق</Button>
      </DialogActions>
    </Dialog>
  );
}
