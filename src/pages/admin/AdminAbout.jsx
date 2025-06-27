import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon
} from "@mui/icons-material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../components/firebase";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import { withProgress } from '../../utils/withProgress';


export default function AdminAbout() {
  const [aboutData, setAboutData] = useState(null);
  const [editData, setEditData] = useState({});
  const [editMode, setEditMode] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, field: null, message: '', goalIndex: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);
  const [editingGoalText, setEditingGoalText] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [expandedGoals, setExpandedGoals] = useState({});
  const [openSections, setOpenSections] = useState({});
  const navigate = useNavigate();

  const fieldLabels = {
    about_us_text: "نبذة عن المركز",
    vision_title: "عنوان الرؤية",
    vision: "الرؤية",
    message_title: "عنوان الرسالة", 
    message: "الرسالة",
    justifications_title: "عنوان المبررات",
    justifications: "المبررات",
    goals_title: "عنوان الأهداف",
    goals: "الأهداف"
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {

  setLoading(true);
  await withProgress(async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "siteInfo", "about us");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAboutData(data);
        setEditData(data);
      } else {
        showSnackbar("لم يتم العثور على البيانات", "error");
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      showSnackbar("خطأ في تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  });
};


  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: true }));
  };

  const handleCancel = (field) => {
    setEditMode(prev => ({ ...prev, [field]: false }));
    setEditData(prev => ({ ...prev, [field]: aboutData[field] }));
  };

const handleSave = async (field) => {

  try {
    setSaving(true);
    const docRef = doc(db, "siteInfo", "about us");
    
    await updateDoc(docRef, {
      [field]: editData[field]
    });

    setAboutData(prev => ({ ...prev, [field]: editData[field] }));
    setEditMode(prev => ({ ...prev, [field]: false }));
    showSnackbar("تم حفظ التعديلات بنجاح");
    
  } catch (error) {
    console.error("Error updating data:", error);
    showSnackbar("خطأ في حفظ التعديلات", "error");
  } finally {
    setSaving(false);
  }
};


  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteConfirm = (field) => {
    let message = '';
    switch(field) {
      case 'about_us_text':
        message = 'هل أنت متأكد من حذف نبذة عن المركز؟ سيتم حذف المحتوى بالكامل وإخفاءه من الصفحة الرئيسية.';
        break;
      case 'vision':
        message = 'هل أنت متأكد من حذف نص الرؤية؟ سيتم حذف المحتوى بالكامل وإخفاء قسم الرؤية من الصفحة.';
        break;
      case 'vision_title':
        message = 'هل أنت متأكد من حذف عنوان الرؤية؟ سيؤدي هذا إلى إخفاء قسم الرؤية بالكامل.';
        break;
      case 'message':
        message = 'هل أنت متأكد من حذف نص الرسالة؟ سيتم حذف المحتوى بالكامل وإخفاء قسم الرسالة من الصفحة.';
        break;
      case 'message_title':
        message = 'هل أنت متأكد من حذف عنوان الرسالة؟ سيؤدي هذا إلى إخفاء قسم الرسالة بالكامل.';
        break;
      case 'justifications':
        message = 'هل أنت متأكد من حذف نص المبررات؟ سيتم حذف المحتوى بالكامل وإخفاء قسم المبررات من الصفحة.';
        break;
      case 'justifications_title':
        message = 'هل أنت متأكد من حذف عنوان المبررات؟ سيؤدي هذا إلى إخفاء قسم المبررات بالكامل.';
        break;
      case 'goals_title':
        message = 'هل أنت متأكد من حذف عنوان الأهداف؟ سيؤدي هذا إلى إخفاء قسم الأهداف بالكامل.';
        break;
      case 'goals':
        message = 'هل أنت متأكد من حذف جميع الأهداف؟ سيتم حذف جميع الأهداف المضافة وإخفاء قسم الأهداف بالكامل ولا يمكن استرجاعها.';
        break;
      default:
        message = 'هل أنت متأكد من حذف هذا المحتوى؟ سيؤدي هذا إلى إخفاءه من الصفحة الرئيسية.';
    }
    setDeleteDialog({ open: true, field, message });
  };

  const handleDeleteGoalConfirm = (index, goalText) => {
    const message = `هل أنت متأكد من حذف هذا الهدف؟\n\n"${goalText}"\n\nسيتم حذف الهدف نهائياً ولا يمكن استرجاعه.`;
    setDeleteDialog({ 
      open: true, 
      field: 'single_goal', 
      message, 
      goalIndex: index 
    });
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      const field = deleteDialog.field;
      const docRef = doc(db, "siteInfo", "about us");
      
      if (field === 'goals') {
        await updateDoc(docRef, { [field]: [] });
        setAboutData(prev => ({ ...prev, [field]: [] }));
        setEditData(prev => ({ ...prev, [field]: [] }));
        showSnackbar("تم حذف جميع الأهداف - سيتم إخفاء قسم الأهداف من الصفحة");
      } else if (field === 'single_goal') {
        const updatedGoals = editData.goals.filter((_, i) => i !== deleteDialog.goalIndex);
        await updateDoc(docRef, { goals: updatedGoals });
        setAboutData(prev => ({ ...prev, goals: updatedGoals }));
        setEditData(prev => ({ ...prev, goals: updatedGoals }));
        
        if (updatedGoals.length === 0) {
          showSnackbar("تم حذف آخر هدف - سيتم إخفاء قسم الأهداف من الصفحة");
        } else {
          showSnackbar("تم حذف الهدف بنجاح");
        }
      } else {
        await updateDoc(docRef, { [field]: '' });
        setAboutData(prev => ({ ...prev, [field]: '' }));
        setEditData(prev => ({ ...prev, [field]: '' }));
        
        const isTitle = field.includes('_title');
        if (isTitle) {
          showSnackbar("تم حذف العنوان - سيتم إخفاء القسم بالكامل من الصفحة");
        } else {
          showSnackbar("تم حذف المحتوى - سيتم إخفاء القسم من الصفحة");
        }
      }
      
      setDeleteDialog({ open: false, field: null, message: '', goalIndex: null });
      
    } catch (error) {
      console.error("Error deleting data:", error);
      showSnackbar("خطأ في حذف المحتوى", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    
    try {
      setSaving(true);
      const updatedGoals = [...(editData.goals || []), newGoal.trim()];
      const docRef = doc(db, "siteInfo", "about us");
      
      await updateDoc(docRef, { goals: updatedGoals });
      
      setAboutData(prev => ({ ...prev, goals: updatedGoals }));
      setEditData(prev => ({ ...prev, goals: updatedGoals }));
      setNewGoal('');
      showSnackbar("تم إضافة الهدف بنجاح");
      
    } catch (error) {
      console.error("Error adding goal:", error);
      showSnackbar("خطأ في إضافة الهدف", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGoal = async (index) => {
    handleDeleteGoalConfirm(index, editData.goals[index]);
  };

  const handleEditGoal = (index) => {
    setEditingGoalIndex(index);
    setEditingGoalText(editData.goals[index]);
  };

  const handleCancelEditGoal = () => {
    setEditingGoalIndex(null);
    setEditingGoalText('');
  };

  const handleSaveGoal = async (index) => {
    if (!editingGoalText.trim()) return;
    
    try {
      setSaving(true);
      const updatedGoals = [...editData.goals];
      updatedGoals[index] = editingGoalText.trim();
      
      const docRef = doc(db, "siteInfo", "about us");
      await updateDoc(docRef, { goals: updatedGoals });
      
      setAboutData(prev => ({ ...prev, goals: updatedGoals }));
      setEditData(prev => ({ ...prev, goals: updatedGoals }));
      setEditingGoalIndex(null);
      setEditingGoalText('');
      showSnackbar("تم تحديث الهدف بنجاح");
      
    } catch (error) {
      console.error("Error updating goal:", error);
      showSnackbar("خطأ في تحديث الهدف", "error");
    } finally {
      setSaving(false);
    }
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const toggleGoalExpansion = (goalIndex) => {
    setExpandedGoals(prev => ({
      ...prev,
      [goalIndex]: !prev[goalIndex]
    }));
  };

  const toggleSection = (sectionName) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const hasContent = (field) => {
    if (field === 'goals') {
      return aboutData && aboutData.goals && Array.isArray(aboutData.goals) && aboutData.goals.length > 0;
    }
    return aboutData && aboutData[field] && aboutData[field].toString().trim().length > 0;
  };

  const renderTableRow = (titleField, contentField, sectionName, isGoals = false, isSingleField = false) => {
    const isOpen = openSections[sectionName];
    let titleValue = '';
    let contentValue = '';
    let isHidden = false;
    
    if (isSingleField) {
      contentValue = aboutData[contentField] || '';
      isHidden = !hasContent(contentField);
    } else {
      titleValue = aboutData[titleField] || '';
      contentValue = aboutData[contentField] || '';
      isHidden = !hasContent(contentField) || !hasContent(titleField);
    }
    
    return (
      <>
        <TableRow 
          onClick={() => toggleSection(sectionName)}
          sx={{ 
            cursor: 'pointer',
            backgroundColor: isHidden ? '#fff3e0' : 'white',
            '&:hover': { 
              backgroundColor: isHidden ? '#ffecb3' : '#f5f5f5' 
            },
            borderLeft: isHidden ? '4px solid #ff9800' : '4px solid transparent'
          }}
        >
          <TableCell sx={{ width: '300px', textAlign: 'right', direction: 'rtl' }}>
            <Box display="flex" alignItems="center" gap={1}>
              {isHidden && (
                <Box sx={{ fontSize: '16px', color: '#f57c00' }}>⚠️</Box>
              )}
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {isSingleField 
                  ? fieldLabels[contentField] 
                  : (fieldLabels[titleField] || titleField)
                }
              </Typography>
            </Box>
          </TableCell>
          <TableCell sx={{ textAlign: 'right', direction: 'rtl' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: isHidden ? '#f57c00' : '#666',
                fontStyle: isHidden ? 'italic' : 'normal'
              }}
            >
              {isHidden 
                ? 'هذا القسم مخفي من الصفحة الرئيسية لعدم وجود محتوى'
                : isSingleField
                  ? `المحتوى: ${contentValue ? `${contentValue.toString().length} حرف` : 'فارغ'}`
                  : `العنوان: ${titleValue ? truncateText(titleValue, 50) : 'غير محدد'} | المحتوى: ${contentValue ? `${contentValue.toString().length} حرف` : 'فارغ'}`
              }
            </Typography>
          </TableCell>
          <TableCell sx={{ width: '100px', textAlign: 'center' }}>
            <Typography variant="body2" color="primary">
              {isOpen ? 'إغلاق' : 'فتح'}
            </Typography>
          </TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell colSpan={3} sx={{ p: 0, border: 'none' }}>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, backgroundColor: '#fafafa' }}>
                {isGoals 
                  ? renderGoalsContent() 
                  : isSingleField 
                    ? renderSingleFieldContent(contentField)
                    : renderSectionContent(titleField, contentField)
                }
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  const renderSingleFieldContent = (field) => {
    const isEditing = editMode[field];
    const value = isEditing ? editData[field] || '' : aboutData[field] || '';

    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            {fieldLabels[field]}
          </Typography>
          <Box>
            {!isEditing ? (
              <>
                <IconButton size="small" color="primary" onClick={() => handleEdit(field)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDeleteConfirm(field)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton size="small" color="success" onClick={() => handleSave(field)} disabled={saving}>
                  {saving ? <CircularProgress size={20} /> : <SaveIcon fontSize="small" />}
                </IconButton>
                <IconButton size="small" color="secondary" onClick={() => handleCancel(field)} disabled={saving}>
                  <CancelIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={6}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={!isEditing}
          variant={isEditing ? "outlined" : "filled"}
          sx={{
            '& .MuiInputBase-input': {
              textAlign: 'right',
              direction: 'rtl',
              lineHeight: 1.6
            }
          }}
          placeholder={isEditing ? `اكتب ${fieldLabels[field]} هنا...` : ''}
        />
        
        {value && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
            عدد الأحرف: {value.length}
          </Typography>
        )}
      </Box>
    );
  };

  const renderSectionContent = (titleField, contentField) => {
    const isTitleEditing = editMode[titleField];
    const isContentEditing = editMode[contentField];
    const titleValue = isTitleEditing ? editData[titleField] || '' : aboutData[titleField] || '';
    const contentValue = isContentEditing ? editData[contentField] || '' : aboutData[contentField] || '';

    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              العنوان
            </Typography>
            <Box>
              {!isTitleEditing ? (
                <>
                  <IconButton size="small" color="primary" onClick={() => handleEdit(titleField)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteConfirm(titleField)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton size="small" color="success" onClick={() => handleSave(titleField)} disabled={saving}>
                    {saving ? <CircularProgress size={20} /> : <SaveIcon fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" color="secondary" onClick={() => handleCancel(titleField)} disabled={saving}>
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
          
          <TextField
            fullWidth
            size="small"
            value={titleValue}
            onChange={(e) => handleInputChange(titleField, e.target.value)}
            disabled={!isTitleEditing}
            variant={isTitleEditing ? "outlined" : "filled"}
            sx={{ '& .MuiInputBase-input': { textAlign: 'right', direction: 'rtl' } }}
            placeholder={isTitleEditing ? 'اكتب العنوان هنا...' : ''}
          />
        </Box>

        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              المحتوى
            </Typography>
            <Box>
              {!isContentEditing ? (
                <>
                  <IconButton size="small" color="primary" onClick={() => handleEdit(contentField)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteConfirm(contentField)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton size="small" color="success" onClick={() => handleSave(contentField)} disabled={saving}>
                    {saving ? <CircularProgress size={20} /> : <SaveIcon fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" color="secondary" onClick={() => handleCancel(contentField)} disabled={saving}>
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            value={contentValue}
            onChange={(e) => handleInputChange(contentField, e.target.value)}
            disabled={!isContentEditing}
            variant={isContentEditing ? "outlined" : "filled"}
            sx={{
              '& .MuiInputBase-input': {
                textAlign: 'right',
                direction: 'rtl',
                lineHeight: 1.6
              }
            }}
            placeholder={isContentEditing ? 'اكتب المحتوى هنا...' : ''}
          />
          
          {contentValue && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
              عدد الأحرف: {contentValue.length}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  const renderGoalsContent = () => {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              عنوان قسم الأهداف
            </Typography>
            <Box>
              {!editMode['goals_title'] ? (
                <>
                  <IconButton size="small" color="primary" onClick={() => handleEdit('goals_title')}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteConfirm('goals_title')}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton size="small" color="success" onClick={() => handleSave('goals_title')} disabled={saving}>
                    {saving ? <CircularProgress size={20} /> : <SaveIcon fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" color="secondary" onClick={() => handleCancel('goals_title')} disabled={saving}>
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
          
          <TextField
            fullWidth
            size="small"
            value={editMode['goals_title'] ? editData['goals_title'] || '' : aboutData['goals_title'] || ''}
            onChange={(e) => handleInputChange('goals_title', e.target.value)}
            disabled={!editMode['goals_title']}
            variant={editMode['goals_title'] ? "outlined" : "filled"}
            sx={{ '& .MuiInputBase-input': { textAlign: 'right', direction: 'rtl' } }}
            placeholder={editMode['goals_title'] ? 'اكتب عنوان الأهداف هنا...' : ''}
          />
        </Box>

        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              إدارة الأهداف
            </Typography>
            <IconButton size="small" color="error" onClick={() => handleDeleteConfirm('goals')}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
              إضافة هدف جديد
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                size="small"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="اكتب الهدف الجديد..."
                sx={{ '& .MuiInputBase-input': { textAlign: 'right', direction: 'rtl' } }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddGoal}
                disabled={!newGoal.trim() || saving}
                sx={{ minWidth: 100 }}
              >
                إضافة
              </Button>
            </Box>
          </Paper>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
              الأهداف الحالية ({editData.goals?.length || 0})
            </Typography>
            {editData.goals?.map((goal, index) => {
              const isEditing = editingGoalIndex === index;
              
              return (
                <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1, textAlign: 'right', direction: 'rtl', lineHeight: 1.6 }}>
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 24,
                          height: 24,
                          backgroundColor: '#1976d2',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          ml: 1
                        }}>
                          {index + 1}
                        </Box>
                      </Box>
                      
                      {isEditing ? (
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          value={editingGoalText}
                          onChange={(e) => setEditingGoalText(e.target.value)}
                          sx={{ '& .MuiInputBase-input': { textAlign: 'right', direction: 'rtl' } }}
                          placeholder="تعديل الهدف..."
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Box>
                          <Box sx={{ 
                            textAlign: 'right', 
                            direction: 'rtl',
                            lineHeight: 1.6,
                            fontSize: '1rem',
                            mb: goal.length > 150 ? 1 : 0
                          }}>
                            {goal.length > 150 && !expandedGoals[index]
                              ? truncateText(goal, 150)
                              : goal
                            }
                          </Box>
                          
                          {goal.length > 150 && (
                            <Button
                              size="small"
                              onClick={() => toggleGoalExpansion(index)}
                              sx={{
                                color: '#1976d2',
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                                fontSize: '0.75rem',
                                minHeight: 'auto',
                                padding: '2px 4px',
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                  textDecoration: 'underline',
                                }
                              }}
                            >
                              {expandedGoals[index] ? 'عرض أقل' : 'اقرأ المزيد'}
                            </Button>
                          )}
                        </Box>
                      )}
                    </Box>
                    
                    <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {isEditing ? (
                        <>
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => handleSaveGoal(index)}
                            disabled={saving || !editingGoalText.trim()}
                          >
                            {saving ? <CircularProgress size={16} /> : <SaveIcon fontSize="small" />}
                          </IconButton>
                          <IconButton
                            color="secondary"
                            size="small"
                            onClick={handleCancelEditGoal}
                            disabled={saving}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEditGoal(index)}
                            disabled={saving}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteGoal(index)}
                            disabled={saving}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                </Paper>
              );
            })}
            
            {(!editData.goals || editData.goals.length === 0) && (
              <Typography 
                color="text.secondary" 
                sx={{ textAlign: 'center', py: 4, fontStyle: 'italic' }}
              >
                لا توجد أهداف مضافة حتى الآن
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <Container sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>جاري تحميل البيانات...</Typography>
        </Container>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold',
            color: '#000',
            direction: 'rtl',
            textAlign: 'right'
          }}
        >
          عن المركز
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: '#666', direction: 'rtl' }}>
          يمكنك تعديل وإدارة محتوى صفحة "عن المركز" من هنا. الأقسام الفارغة لن تظهر في الصفحة الرئيسية.
        </Typography>
      </Box>

      <Box sx={{ direction: "rtl", backgroundColor: '#fff' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>
                    اسم القسم
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>
                    الحالة والمعلومات
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    الإجراء
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderTableRow(null, 'about_us_text', 'about_us', false, true)}
                {renderTableRow('vision_title', 'vision', 'vision')}
                {renderTableRow('message_title', 'message', 'message')}
                {renderTableRow('justifications_title', 'justifications', 'justifications')}
                {renderTableRow('goals_title', 'goals', 'goals', true)}
              </TableBody>
            </Table>
          </TableContainer>

          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 16, left: 16 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />
          </Fab>
        </Container>

        <ConfirmDeleteDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, field: null, message: '', goalIndex: null })}
          onConfirm={handleDelete}
          message={deleteDialog.message}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminDashboardLayout>
  );
}