import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, List, ListItem
} from '@mui/material';
import { db } from '../../components/firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy
} from 'firebase/firestore';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RequireAdmin from '../../components/auth/RequireAdmin';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { setDoc } from 'firebase/firestore';

export default function AdminSections() {
  const [sections, setSections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({});
  const [newFieldKey, setNewFieldKey] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);


// Function to validate if a string is a valid URL
function isValidURL(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
   const q = query(collection(db, 'sections'), orderBy('order'));
const snapshot = await getDocs(q);
const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSections(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  };
const handleOpenAdd = () => {
  setIsEdit(false);
  setCurrentId(null);
  setFormData({
    title: '',
    description: '',
    goals: [],
    imageGallery: [],
    programs: [],
    heroImage: '',
  });
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
    if (!formData.title || formData.title.trim() === '') {
  alert('يرجى إدخال اسم القسم قبل الحفظ.');
  return;
}

    if (dataCopy.image && !dataCopy.image.includes("firebase")) {
      try {
        const firebaseURL = await uploadImageFromURL(dataCopy.image, `section-${Date.now()}.jpg`);
        dataCopy.image = firebaseURL;
      } catch (err) {
        alert("فشل تحميل الصورة. تأكد من أن الرابط صحيح.");
        return;
      }
    }if (formData.heroImage) {
  if (!isValidURL(formData.heroImage)) {
    alert("رابط صورة الترويسة غير صالح. تأكد من أنه يبدأ بـ http أو https.");
    return;
  }

  // ✅ Skip uploading and store the direct link
  dataCopy.heroImage = formData.heroImage;
} else {
  dataCopy.heroImage = ''; // Ensure the field is set
}



if (isEdit) {
  await updateDoc(doc(db, 'sections', currentId), dataCopy);
} else {
  const sectionRef = await addDoc(collection(db, 'sections'), {
    ...dataCopy,
    order: sections.length,
  });

  await setDoc(doc(db, 'heroSection', sectionRef.id), {
    title: dataCopy.title,
    subtitle: '',
   imageURL: dataCopy.heroImage || '',

    bgGradient: 'linear-gradient(180deg, #00b0f0 0%, #003366 100%)',
  });
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

  // Manual move up/down functions as fallback
  const moveSection = async (index, direction) => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
    
    // Update Firebase
    await Promise.all(
      newSections.map((sec, idx) =>
        updateDoc(doc(db, 'sections', sec.id), { order: idx })
      )
    );
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);

    // Update Firebase
    try {
      await Promise.all(
        items.map((sec, index) =>
          updateDoc(doc(db, 'sections', sec.id), { order: index })
        )
      );
    } catch (error) {
      console.error('Error updating order:', error);
      fetchSections(); // Revert on error
    }
  };

  const DraggableListView = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(provided, snapshot) => (
          <List
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{
              backgroundColor: snapshot.isDraggingOver ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: 1
            }}
          >
            {sections.map((section, index) => (
              <Draggable key={section.id} draggableId={section.id} index={index}>
                {(provided, snapshot) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    sx={{
                      backgroundColor: snapshot.isDragging ? 'rgba(25, 118, 210, 0.08)' : '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 1,
                      boxShadow: snapshot.isDragging ? '0 5px 15px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
                      transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      cursor: snapshot.isDragging ? 'grabbing' : 'default',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        {...provided.dragHandleProps}
                        sx={{
                          cursor: 'grab',
                          '&:active': { cursor: 'grabbing' },
                          display: 'flex',
                          alignItems: 'center',
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        <DragHandleIcon />
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {section.title || section.name || section.subtitle || section.id}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        onClick={() => handleOpenEdit(section)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setSectionToDelete(section.id);
                          setConfirmOpen(true);
                        }}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );

  const TableView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الترتيب</TableCell>
            <TableCell>الاسم</TableCell>
            <TableCell>الإجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sections.map((section, index) => (
            <TableRow key={section.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUpwardIcon />
                  </IconButton>
                  <Typography>{index + 1}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                  >
                    <ArrowDownwardIcon />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                {section.title || section.name || section.subtitle || section.id}
              </TableCell>
              <TableCell>
                <IconButton 
                  onClick={() => handleOpenEdit(section)}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => {
                    setSectionToDelete(section.id);
                    setConfirmOpen(true);
                  }}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
// 👇 Add this before the return statement
const fieldLabels = {
  title: 'اسم القسم',
  description: 'مقدمة',
  goals: 'الأهداف',
  imageGallery: 'معرض الصور',
  programs: 'البرامج',
};


  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <Box sx={{ padding: 4, direction: 'rtl',  }}>
          <Typography variant="h4" gutterBottom>إدارة الأقسام</Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button variant="contained" onClick={handleOpenAdd}>
              إضافة قسم جديد
            </Button>
       
          </Box>

         <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
  ↕️ استخدمي الأسهم لتغيير الترتيب
</Typography>


<TableView />

          {/* Add/Edit Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>{isEdit ? 'تعديل القسم' : 'إضافة قسم'}</DialogTitle>
            <DialogContent>
              {Object.keys(formData).map((key) => (
                <Box key={key} sx={{ mt: 2 }}>
                  {Array.isArray(formData[key]) ? (
                    <Box sx={{ width: '100%' }}>
                     <Typography sx={{ mb: 1, fontWeight: 'bold' }}>{fieldLabels[key] || key}</Typography>

                      {formData[key].map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <TextField
                            fullWidth
                            value={item}
                            onChange={(e) => {
                              const newArray = [...formData[key]];
                              newArray[idx] = e.target.value;
                              handleFieldChange(key, newArray);
                            }}
                          />
                          <IconButton
                            color="error"
                            onClick={() => {
                              setDeleteTarget({ key, index: idx });
                              setConfirmDeleteOpen(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                     <Button
  variant="outlined"
  onClick={() => handleFieldChange(key, [...formData[key], ""])}
>
  إضافة عنصر إلى {fieldLabels[key] || key}
</Button>

                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <TextField
  label={fieldLabels[key] || key}

                        value={formData[key]}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        fullWidth
                      />
                      <IconButton
                        onClick={() => {
                          setDeleteTarget({ key });
                          setConfirmDeleteOpen(true);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              ))}
              <Box mt={3} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  label="إضافة حقل جديد"
                  value={newFieldKey}
                  onChange={(e) => setNewFieldKey(e.target.value)}
                />
                <Button variant="outlined" onClick={handleAddField}>إضافة الحقل</Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
              <Button onClick={handleSave} variant="contained">حفظ</Button>
            </DialogActions>
          </Dialog>

          {/* Confirm Delete Section */}
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>⚠️ تأكيد الحذف</DialogTitle>
            <DialogContent>
              <Typography>هل أنت متأكد أنك تريد حذف هذا القسم بالكامل؟</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>إلغاء</Button>
              <Button
                onClick={async () => {
                  await handleDelete(sectionToDelete);
                  setConfirmOpen(false);
                  setSectionToDelete(null);
                }}
                color="error"
                variant="contained"
              >
                نعم، احذف
              </Button>
            </DialogActions>
          </Dialog>

          {/* Confirm Delete Field or Array Item */}
          <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
            <DialogTitle>⚠️ تأكيد الحذف</DialogTitle>
            <DialogContent>
              <Typography>هل أنت متأكد أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDeleteOpen(false)}>إلغاء</Button>
              <Button
                onClick={() => {
                  if (deleteTarget) {
                    const { key, index } = deleteTarget;
                    if (typeof index === 'number') {
                      const newArray = [...formData[key]];
                      newArray.splice(index, 1);
                      handleFieldChange(key, newArray);
                    } else {
                      handleDeleteField(key);
                    }
                  }
                  setConfirmDeleteOpen(false);
                  setDeleteTarget(null);
                }}
                color="error"
                variant="contained"
              >
                نعم، احذف
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}