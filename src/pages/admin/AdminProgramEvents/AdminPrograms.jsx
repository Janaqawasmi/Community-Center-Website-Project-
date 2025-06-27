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
import CategoryManager from './CategoryManager'; // استيراد ملف التصنيفات

export default function AdminPrograms() {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [openCategoriesDialog, setOpenCategoriesDialog] = useState(false);
    const [categoriesChanged, setCategoriesChanged] = useState(false); // لمزامنة التحديثات

  
  
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

  

  // إضافة تصنيف جديد
 

  return (
            <AdminDashboardLayout>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button sx={{ mt: 4, ml: 2 }}
          variant="outlined"
          color="primary"
          
          onClick={() => setOpenCategoriesDialog(true)}
        >
          إدارة التصنيفات
        </Button>
      </Box>

      <CategoryManager
        open={openCategoriesDialog}
        onClose={() => setOpenCategoriesDialog(false)}
        onCategoriesChanged={() => setCategoriesChanged(!categoriesChanged)} // لمزامنة التحديث
      />
    
      
      

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
          { name: "instructor_name", label: "اسم المدرب", required: false, type: "text" },
          { name: "meetingNum", label: "عدد اللقاءات", required: false, type: "number" },



        ]}
        filters={["category", "classNumber", "groupNumber", "featured"]}
        categoryOptions={categoryOptions.map(c => c.name)}
        fetchCategories={fetchCategories}
        key={categoriesChanged}
      />
    </AdminDashboardLayout>
  );
}