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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LinkIcon from '@mui/icons-material/Link';
import RequireAdmin from '../../components/auth/RequireAdmin';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { setDoc } from 'firebase/firestore';
import { compressImage } from '../../utils/compressImage';
import { deleteImage } from '../../utils/deleteImage';
import { uploadImage } from '../../utils/uploadImage';
import { withProgress } from '../../utils/withProgress';
import 'nprogress/nprogress.css';

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
  const [uploadingImages, setUploadingImages] = useState({});
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);

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
  await withProgress(async () => {
    const q = query(collection(db, 'sections'), orderBy('order'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSections(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  });
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
    programCards: [
      {
        name: '',
        description: '',
        conditions: '',
        qualifications: '',
        phone: '',
        image: ''
      }
    ]
  });
  setOpenDialog(true);
};

  const handleOpenEdit = (section) => {
    setIsEdit(true);
    setCurrentId(section.id);
    setFormData({ ...section });
    setOpenDialog(true);
    setFormData({ 
  ...section, 
  programCards: section.programCards || [] // ensure it's defined
});

  };

  // Handle file upload for image gallery


const handleImageUpload = async (files, galleryIndex) => {
  const fileArray = Array.from(files);

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    const uploadKey = `${galleryIndex}-${i}`;

    try {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));
      console.log("📂 Selected file:", file);

      // Compress image before upload
      const compressed = await compressImage(file);
      const storagePath = `sections/gallery/${Date.now()}-${i}.jpg`;

      // Upload image WITHOUT updating Firestore inside the helper
    const imageUrl = await withProgress(() =>
  uploadImage({
    file: compressed,
    storagePath,
    firestorePath: [],
    field: ''
  })
);


      // Update Firestore manually
      const updatedGallery = [...(formData.imageGallery || []), imageUrl];
      await updateDoc(doc(db, 'sections', currentId), {
        imageGallery: updatedGallery
      });

      // Update local state for UI
      setFormData(prev => ({
        ...prev,
        imageGallery: updatedGallery
      }));

    } catch (error) {
      console.error('🚫 Image upload error:', error);
      alert(`فشل في رفع الصورة ${file.name}`);
    } finally {
      setUploadingImages(prev => {
        const updated = { ...prev };
        delete updated[uploadKey];
        return updated;
      });
    }
  }
};

  // Handle URL addition to gallery
  const handleAddImageURL = (url, galleryIndex) => {
    if (!isValidURL(url)) {
      alert('الرجاء إدخال رابط صحيح للصورة');
      return;
    }
    
    const newGallery = [...formData.imageGallery];
    newGallery.push(url);
    handleFieldChange('imageGallery', newGallery);
  };

  // Handle image deletion from gallery
  const handleDeleteGalleryImage = async (index) => {
    const imageUrl = formData.imageGallery[index];
    
    try {
      // If it's a Firebase Storage URL, delete from storage
      if (imageUrl.includes('firebase') && imageUrl.includes('appspot.com')) {
        await deleteImage(imageUrl);
      }
      
      // Remove from gallery array
      const newGallery = [...formData.imageGallery];
      newGallery.splice(index, 1);
      handleFieldChange('imageGallery', newGallery);
      
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('فشل في حذف الصورة من التخزين، لكن تم حذفها من المعرض');
      
      // Still remove from gallery even if storage deletion fails
      const newGallery = [...formData.imageGallery];
      newGallery.splice(index, 1);
      handleFieldChange('imageGallery', newGallery);
    }
  };

const handleSave = async () => {
  await withProgress(async () => {
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
    }

    if (formData.heroImage) {
      if (!isValidURL(formData.heroImage)) {
        alert("رابط صورة الترويسة غير صالح. تأكد من أنه يبدأ بـ http أو https.");
        return;
      }
      dataCopy.heroImage = formData.heroImage;
    } else {
      dataCopy.heroImage = '';
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
  });
};


const handleDelete = async (id) => {
  await withProgress(async () => {
    await deleteDoc(doc(db, 'sections', id));
    fetchSections();
  });
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
  await withProgress(async () => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
    await Promise.all(
      newSections.map((sec, idx) =>
        updateDoc(doc(db, 'sections', sec.id), { order: idx })
      )
    );
  });
};

const handleDragEnd = async (result) => {
  if (!result.destination) return;

  await withProgress(async () => {
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);

    await Promise.all(
      items.map((sec, index) =>
        updateDoc(doc(db, 'sections', sec.id), { order: index })
      )
    );
  });
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

  // Field labels
  const fieldLabels = {
    title: 'اسم القسم',
    description: 'مقدمة',
    goals: 'الأهداف',
    imageGallery: 'معرض الصور',
    programs: 'البرامج',
  };

  // Image Gallery Component
  const ImageGalleryField = ({ images, onAddUrl, onUploadFiles, onDeleteImage }) => {
    const [urlInput, setUrlInput] = useState('');

    return (
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ mb: 2, fontWeight: 'bold' }}>معرض الصور</Typography>
        
        {/* Upload Controls */}
        <Box sx={{ mb: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            إضافة صور جديدة:
          </Typography>
          
          {/* File Upload */}
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onUploadFiles(e.target.files, 'gallery')}
              style={{ display: 'none' }}
              id="gallery-file-input"
            />
            <label htmlFor="gallery-file-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                sx={{ mr: 1 }}
              >
                رفع من الجهاز
              </Button>
            </label>
          </Box>
          
          {/* URL Input */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="أو أدخل رابط الصورة هنا"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={() => {
                if (urlInput.trim()) {
                  onAddUrl(urlInput.trim(), 'gallery');
                  setUrlInput('');
                }
              }}
            >
              إضافة
            </Button>
          </Box>
        </Box>

        {/* Image Preview Grid */}
        {images && images.length > 0 && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: 2, 
            mt: 2 
          }}>
            {images.map((imageUrl, idx) => (
              <Box key={idx} sx={{ position: 'relative', aspectRatio: '1/1' }}>
                <img
                  src={imageUrl}
                  alt={`Gallery ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <Box
                  sx={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    color: 'text.secondary'
                  }}
                >
                  صورة غير متاحة
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                  }}
                  onClick={() => onDeleteImage(idx)}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Upload Progress */}
        {Object.keys(uploadingImages).length > 0 && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f8ff', borderRadius: 1 }}>
            <Typography variant="body2" color="primary">
              جارٍ رفع {Object.keys(uploadingImages).length} صورة...
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <Box sx={{ padding: 2, direction: 'rtl' }}>
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
 {Object.keys(formData).map((key) => {
  if (key === 'programCards') return null; // ✅ safe to skip
  return (
    <Box key={key} sx={{ mt: 2 }}>
      {key === 'imageGallery' ? (
        <ImageGalleryField
          images={formData.imageGallery}
          onAddUrl={handleAddImageURL}
          onUploadFiles={handleImageUpload}
          onDeleteImage={handleDeleteGalleryImage}
        />
      ) : Array.isArray(formData[key]) ? (
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
            {fieldLabels[key] || key}
          </Typography>
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
  );
})}


  {/* 🔽 INSERT THIS CODE HERE (program cards UI) 🔽 */}
{formData.programCards?.map((card, idx) => (
  <Box key={idx} sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography sx={{ fontWeight: 'bold' }}>بطاقة البرنامج #{idx + 1}</Typography>
      <IconButton
        color="error"
        onClick={() => {
          const updated = [...formData.programCards];
          updated.splice(idx, 1); // delete
          handleFieldChange('programCards', updated);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>

    <TextField
      fullWidth
      label="اسم البرنامج"
      value={card.name}
      onChange={(e) => {
        const updated = [...formData.programCards];
        updated[idx].name = e.target.value;
        handleFieldChange('programCards', updated);
      }}
      sx={{ mb: 2 }}
    />

    <TextField
      fullWidth
      label="الوصف"
      multiline
      rows={2}
      value={card.description}
      onChange={(e) => {
        const updated = [...formData.programCards];
        updated[idx].description = e.target.value;
        handleFieldChange('programCards', updated);
      }}
      sx={{ mb: 2 }}
    />

    <TextField
      fullWidth
      label="الشروط"
      value={card.conditions}
      onChange={(e) => {
        const updated = [...formData.programCards];
        updated[idx].conditions = e.target.value;
        handleFieldChange('programCards', updated);
      }}
      sx={{ mb: 2 }}
    />

    <TextField
      fullWidth
      label="المؤهلات"
      value={card.qualifications}
      onChange={(e) => {
        const updated = [...formData.programCards];
        updated[idx].qualifications = e.target.value;
        handleFieldChange('programCards', updated);
      }}
      sx={{ mb: 2 }}
    />

    <TextField
      fullWidth
      label="الهاتف"
      value={card.phone}
      onChange={(e) => {
        const updated = [...formData.programCards];
        updated[idx].phone = e.target.value;
        handleFieldChange('programCards', updated);
      }}
      sx={{ mb: 2 }}
    />

    <TextField
      fullWidth
      label="رابط الصورة"
      value={card.image}
      onChange={(e) => {
        const updated = [...formData.programCards];
        updated[idx].image = e.target.value;
        handleFieldChange('programCards', updated);
      }}
      sx={{ mb: 2 }}
    />
  </Box>
))}

  <Button
    variant="outlined"
onClick={() =>
  handleFieldChange('programCards', [
    ...formData.programCards,
    {
      name: '',
      description: '',
      conditions: '',
      qualifications: '',
      phone: '',
      image: ''
    }
  ])
}

    sx={{ mt: 2 }}
  >
    إضافة بطاقة برنامج
  </Button>
  {/* 🔼 END OF INSERTED CODE 🔼 */}
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