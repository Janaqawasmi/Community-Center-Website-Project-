import React, { useState, useEffect } from 'react';
import {
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Alert,
  Snackbar,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Fab,
  Collapse,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import { 
  Save, 
  Refresh, 
  Edit, 
  Add, 
  Delete,
  Info,
  Visibility,
  VisibilityOff,
  ExpandMore,
  ExpandLess,
  ColorLens,
  Title,
  Subject,
  AddBox,
  DragHandle,
  ArrowUpward,
  ArrowDownward,
  List as ListIcon
} from '@mui/icons-material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../components/firebase';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

export default function AdminAbout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // الحالة الرئيسية - مصفوفة واحدة للأقسام
  const [aboutData, setAboutData] = useState({
    sections: []
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [expandedSections, setExpandedSections] = useState({});
  const [previewMode, setPreviewMode] = useState({});

  // حالات للحوار
  const [sectionDialog, setSectionDialog] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    type: 'text',
    color: '#2563eb',
    icon: 'Info'
  });

  // ألوان متاحة للاختيار
  const availableColors = [
    { name: 'أزرق', value: '#2563eb' },
    { name: 'أخضر', value: '#10b981' },
    { name: 'برتقالي', value: '#f59e0b' },
    { name: 'أحمر', value: '#ef4444' },
    { name: 'بنفسجي', value: '#8b5cf6' },
    { name: 'وردي', value: '#ec4899' },
    { name: 'كحلي', value: '#1e40af' },
    { name: 'أخضر داكن', value: '#059669' },
    { name: 'برتقالي داكن', value: '#d97706' },
    { name: 'أحمر داكن', value: '#dc2626' }
  ];

  // أيقونات متاحة
  const availableIcons = [
    { name: 'معلومات', value: 'Info', component: <Info /> },
    { name: 'رؤية', value: 'Visibility', component: <Visibility /> },
    { name: 'تعديل', value: 'Edit', component: <Edit /> },
    { name: 'إضافة', value: 'Add', component: <Add /> },
    { name: 'عنوان', value: 'Title', component: <Title /> },
    { name: 'موضوع', value: 'Subject', component: <Subject /> },
    { name: 'ألوان', value: 'ColorLens', component: <ColorLens /> },
    { name: 'قائمة', value: 'List', component: <ListIcon /> }
  ];

  // أنواع الأقسام المتاحة
  const sectionTypes = [
    { value: 'text', label: 'نص' },
    { value: 'list', label: 'قائمة' }
  ];

  // دالة للحصول على الأيقونة
  const getIcon = (iconName) => {
    const iconObj = availableIcons.find(icon => icon.value === iconName);
    return iconObj ? iconObj.component : <Info />;
  };

  // جلب البيانات من Firebase
  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "siteInfo", "about us");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // إذا كانت البيانات بالهيكل الجديد
        if (data.sections) {
          setAboutData({ sections: data.sections });
        } else {
          // تحويل البيانات القديمة إلى الهيكل الجديد
          const sections = [];
          
          if (data.about_us_text) {
            sections.push({
              id: 'about',
              title: 'نبذة عن المركز',
              content: data.about_us_text,
              type: 'text',
              color: '#2563eb',
              icon: 'Info',
              order: 0
            });
          }
          
          if (data.vision) {
            sections.push({
              id: 'vision',
              title: data.vision_title || 'الرؤية',
              content: data.vision,
              type: 'text',
              color: '#10b981',
              icon: 'Visibility',
              order: 1
            });
          }
          
          if (data.message) {
            sections.push({
              id: 'message',
              title: data.message_title || 'الرسالة',
              content: data.message,
              type: 'text',
              color: '#f59e0b',
              icon: 'Edit',
              order: 2
            });
          }
          
          if (data.justifications) {
            sections.push({
              id: 'justifications',
              title: data.justifications_title || 'المبررات',
              content: data.justifications,
              type: 'text',
              color: '#ef4444',
              icon: 'Subject',
              order: 3
            });
          }
          
          if (data.goals && data.goals.length > 0) {
            sections.push({
              id: 'goals',
              title: data.goals_title || 'الأهداف',
              content: data.goals,
              type: 'list',
              color: '#8b5cf6',
              icon: 'Add',
              order: 4
            });
          }
          
          // إضافة الأقسام المخصصة
          if (data.custom_sections) {
            data.custom_sections.forEach((section, index) => {
              sections.push({
                ...section,
                id: section.id || `custom_${Date.now()}_${index}`,
                type: section.type || 'text',
                order: 5 + index
              });
            });
          }
          
          // ترتيب الأقسام حسب الـ order
          sections.sort((a, b) => a.order - b.order);
          
          setAboutData({ sections });
        }
      } else {
        // إنشاء قسم افتراضي
        setAboutData({
          sections: [
            {
              id: 'about',
              title: 'نبذة عن المركز',
              content: '',
              type: 'text',
              color: '#2563eb',
              icon: 'Info',
              order: 0
            }
          ]
        });
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      showSnackbar('حدث خطأ في تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  // حفظ البيانات في Firebase
  const saveAboutData = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "siteInfo", "about us");
      await updateDoc(docRef, aboutData);
      showSnackbar('تم حفظ التغييرات بنجاح', 'success');
    } catch (error) {
      console.error("Error saving about data:", error);
      showSnackbar('حدث خطأ في حفظ البيانات', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const togglePreview = (field) => {
    setPreviewMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // دوال إدارة الأقسام
  const addSection = () => {
    if (newSection.title.trim() && newSection.content) {
      const sectionToAdd = {
        ...newSection,
        id: `section_${Date.now()}`,
        order: aboutData.sections.length,
        content: newSection.type === 'list' && typeof newSection.content === 'string' 
          ? newSection.content.split('\n').filter(item => item.trim()) 
          : newSection.content
      };
      
      setAboutData(prev => ({
        sections: [...prev.sections, sectionToAdd]
      }));
      
      resetSectionForm();
      setSectionDialog(false);
    }
  };

  const editSection = (sectionId, updatedData) => {
    setAboutData(prev => ({
      sections: prev.sections.map(section => 
        section.id === sectionId ? { 
          ...section, 
          ...updatedData,
          content: updatedData.type === 'list' && typeof updatedData.content === 'string'
            ? updatedData.content.split('\n').filter(item => item.trim())
            : updatedData.content
        } : section
      )
    }));
    
    if (editingSection !== null) {
      setEditingSection(null);
      setSectionDialog(false);
      resetSectionForm();
    }
  };

  const deleteSection = (sectionId) => {
    setAboutData(prev => ({
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const reorderSection = (sectionId, direction) => {
    const currentIndex = aboutData.sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < aboutData.sections.length - 1)
    ) {
      const newSections = [...aboutData.sections];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // تبديل العناصر
      [newSections[currentIndex], newSections[targetIndex]] = 
      [newSections[targetIndex], newSections[currentIndex]];
      
      // إعادة تنظيم الـ order
      newSections.forEach((section, index) => {
        section.order = index;
      });
      
      setAboutData({ sections: newSections });
    }
  };

  const resetSectionForm = () => {
    setNewSection({
      title: '',
      content: '',
      type: 'text',
      color: '#2563eb',
      icon: 'Info'
    });
  };

  const openEditDialog = (section) => {
    setNewSection({
      ...section,
      content: section.type === 'list' && Array.isArray(section.content)
        ? section.content.join('\n')
        : section.content
    });
    setEditingSection(section.id);
    setSectionDialog(true);
  };

  // مكون القسم القابل للطي
  const CollapsibleSection = ({ section, index }) => (
    <Card sx={{ 
      mb: 3, 
      boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.1)',
      borderRadius: isMobile ? 3 : 4,
      overflow: 'hidden',
      border: `2px solid ${section.color}20`
    }}>
      <Box
        onClick={() => toggleSection(section.id)}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          background: `linear-gradient(135deg, ${section.color}15, ${section.color}05)`,
          borderBottom: expandedSections[section.id] ? `2px solid ${section.color}20` : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: `linear-gradient(135deg, ${section.color}25, ${section.color}15)`,
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 2, md: 3 }
        }}>
          <Box sx={{ 
            color: section.color, 
            display: 'flex',
            fontSize: { xs: 24, md: 28 }
          }}>
            {getIcon(section.icon)}
          </Box>
          <Box>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ 
                fontWeight: 'bold', 
                color: section.color,
                fontSize: isMobile ? '1.2rem' : '1.4rem'
              }}
            >
              {section.title}
            </Typography>
            <Chip 
              label={section.type === 'list' ? 'قائمة' : 'نص'} 
              size="small" 
              sx={{ 
                mt: 0.5,
                backgroundColor: `${section.color}20`,
                color: section.color,
                fontSize: '0.75rem'
              }} 
            />
          </Box>
        </Box>
        <IconButton 
          sx={{ 
            color: section.color,
            '&:hover': {
              backgroundColor: `${section.color}20`,
              transform: 'rotate(180deg)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      
      <Collapse in={expandedSections[section.id]}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          {/* عرض المحتوى */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? 1.5 : 0
            }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }}
              >
                المحتوى
              </Typography>
              <Button
                size="small"
                onClick={() => togglePreview(section.id)}
                startIcon={previewMode[section.id] ? <Edit /> : <Visibility />}
                sx={{ 
                  color: section.color,
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  minWidth: 'auto',
                  px: { xs: 1.5, md: 2 },
                  gap: 1
                }}
              >
                {previewMode[section.id] ? 'تعديل' : 'معاينة'}
              </Button>
            </Box>
            
            {previewMode[section.id] ? (
              <Paper sx={{ 
                p: { xs: 2, md: 2.5 }, 
                backgroundColor: '#f9f9f9',
                minHeight: isMobile ? '120px' : '140px',
                whiteSpace: 'pre-wrap',
                border: '2px solid #e0e0e0',
                borderRadius: 3
              }}>
                {section.type === 'list' && Array.isArray(section.content) ? (
                  <Box component="ol" sx={{ m: 0, p: 0, pl: 3 }}>
                    {section.content.map((item, itemIndex) => (
                      <Typography 
                        component="li" 
                        key={itemIndex}
                        variant="body1" 
                        sx={{ 
                          textAlign: 'right', 
                          direction: 'rtl',
                          fontSize: isMobile ? '0.95rem' : '1rem',
                          lineHeight: 1.7,
                          mb: 1
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      textAlign: 'right', 
                      direction: 'rtl',
                      fontSize: isMobile ? '0.95rem' : '1rem',
                      lineHeight: 1.7
                    }}
                  >
                    {section.content || 'لا يوجد محتوى'}
                  </Typography>
                )}
              </Paper>
            ) : (
              section.type === 'list' ? (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    عناصر القائمة ({Array.isArray(section.content) ? section.content.length : 0}):
                  </Typography>
                  {Array.isArray(section.content) && section.content.map((item, itemIndex) => (
                    <Box key={itemIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: section.color, fontWeight: 'bold' }}>
                        {itemIndex + 1}.
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={item}
                        onChange={(e) => {
                          const newContent = [...section.content];
                          newContent[itemIndex] = e.target.value;
                          editSection(section.id, { content: newContent });
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            direction: 'rtl',
                            textAlign: 'right',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }
                        }}
                      />
                      <IconButton
                        onClick={() => {
                          const newContent = section.content.filter((_, i) => i !== itemIndex);
                          editSection(section.id, { content: newContent });
                        }}
                        color="error"
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    startIcon={<Add />}
                    onClick={() => {
                      const newContent = Array.isArray(section.content) ? [...section.content, ''] : [''];
                      editSection(section.id, { content: newContent });
                    }}
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    إضافة عنصر جديد
                  </Button>
                </Box>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  rows={isMobile ? Math.max(3, 4) : 5}
                  value={section.content}
                  onChange={(e) => editSection(section.id, { content: e.target.value })}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      direction: 'rtl',
                      textAlign: 'right',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      borderRadius: 3
                    }
                  }}
                />
              )
            )}
          </Box>
          
          {/* أزرار التحكم */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => openEditDialog(section)}
              size="small"
              sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}
            >
              تعديل القسم
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => deleteSection(section.id)}
              size="small"
              sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}
            >
              حذف
            </Button>
            {index > 0 && (
              <Button
                variant="outlined"
                startIcon={<ArrowUpward />}
                onClick={() => reorderSection(section.id, 'up')}
                size="small"
                sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}
              >
                ↑
              </Button>
            )}
            {index < aboutData.sections.length - 1 && (
              <Button
                variant="outlined"
                startIcon={<ArrowDownward />}
                onClick={() => reorderSection(section.id, 'down')}
                size="small"
                sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}
              >
                ↓
              </Button>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );

  useEffect(() => {
    fetchAboutData();
  }, []);

  return (
    <AdminDashboardLayout>
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        direction: 'rtl', 
        fontFamily: 'Cairo, sans-serif',
        pb: isMobile ? 12 : 4
      }}>
        {/* Header */}
        <Typography
          variant="h4"
          fontWeight={500}
          sx={{
            fontFamily: "Cairo, sans-serif",
            fontSize: { xs: "1.8rem", sm: "2.3rem" },
            textAlign: "right",
            mb: 4
          }}
        >
          إدارة معلومات المركز
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          mt: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b',
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
          >
            إجمالي الأقسام: {aboutData.sections.length}
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchAboutData}
                disabled={loading}
                size="medium"
                sx={{ gap: 1 }}
              >
                تحديث
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={saveAboutData}
                disabled={saving}
                sx={{ 
                  background: '#2563eb',
                  gap: 1
                }}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </Box>
          )}
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: isMobile ? 8 : 12 }}>
            <Typography sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
              جاري تحميل البيانات...
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* زر إضافة قسم جديد */}
            <Box sx={{ mb: 4 }}>
              <Button
                variant="contained"
                startIcon={<AddBox />}
                onClick={() => setSectionDialog(true)}
                sx={{ 
                  background: '#2563eb',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  px: 3,
                  py: 1.5,
                  gap: 1,
                  '&:hover': {
                    background: '#1d4ed8'
                  }
                }}
              >
                إضافة قسم جديد
              </Button>
            </Box>

            {/* عرض الأقسام */}
            {aboutData.sections.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#6c757d' }}>
                  لا توجد أقسام
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', mb: 3 }}>
                  ابدأ بإضافة قسم جديد لمعلومات المركز
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddBox />}
                  onClick={() => setSectionDialog(true)}
                  sx={{ background: '#2563eb' }}
                >
                  إضافة أول قسم
                </Button>
              </Paper>
            ) : (
              aboutData.sections.map((section, index) => (
                <CollapsibleSection
                  key={section.id}
                  section={section}
                  index={index}
                />
              ))
            )}
          </Box>
        )}

        {/* أزرار التحكم العائمة للهواتف */}
        {isMobile && (
          <Box sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            left: 20,
            zIndex: 1000,
            display: 'flex',
            gap: 2,
            justifyContent: 'center'
          }}>
            <Fab
              variant="extended"
              onClick={fetchAboutData}
              disabled={loading}
              sx={{
                backgroundColor: 'white',
                color: '#2563eb',
                border: '1px solid #2563eb',
                gap: 1,
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}
            >
              <Refresh />
              تحديث
            </Fab>
            <Fab
              variant="extended"
              onClick={saveAboutData}
              disabled={saving}
              sx={{
                backgroundColor: '#2563eb',
                color: 'white',
                gap: 1,
                '&:hover': {
                  backgroundColor: '#1d4ed8'
                }
              }}
            >
              <Save />
              {saving ? 'حفظ...' : 'حفظ'}
            </Fab>
          </Box>
        )}

        {/* Dialog لإضافة/تعديل قسم */}
        <Dialog 
          open={sectionDialog} 
          onClose={() => {
            setSectionDialog(false);
            setEditingSection(null);
            resetSectionForm();
          }}
          maxWidth="md" 
          fullWidth
          fullScreen={isSmallMobile}
        >
          <DialogTitle sx={{ 
            textAlign: 'right', 
            direction: 'rtl',
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
            borderBottom: '2px solid #e2e8f0'
          }}>
            {editingSection ? 'تعديل القسم' : 'إضافة قسم جديد'}
          </DialogTitle>
          
          <DialogContent sx={{ p: { xs: 2, md: 3 }, direction: 'rtl' }}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* عنوان القسم */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="عنوان القسم"
                  value={newSection.title}
                  onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      direction: 'rtl',
                      textAlign: 'right',
                      borderRadius: 3
                    }
                  }}
                />
              </Grid>

              {/* نوع القسم */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                  <InputLabel>نوع القسم</InputLabel>
                  <Select
                    value={newSection.type}
                    onChange={(e) => setNewSection(prev => ({ ...prev, type: e.target.value }))}
                    label="نوع القسم"
                    sx={{ direction: 'rtl' }}
                  >
                    {sectionTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* اختيار اللون */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                  <InputLabel>لون القسم</InputLabel>
                  <Select
                    value={newSection.color}
                    onChange={(e) => setNewSection(prev => ({ ...prev, color: e.target.value }))}
                    label="لون القسم"
                    sx={{ direction: 'rtl' }}
                  >
                    {availableColors.map((color) => (
                      <MenuItem key={color.value} value={color.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: color.value,
                              borderRadius: '50%',
                              border: '2px solid #fff',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                          />
                          <Typography>{color.name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* اختيار الأيقونة */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                  <InputLabel>أيقونة القسم</InputLabel>
                  <Select
                    value={newSection.icon}
                    onChange={(e) => setNewSection(prev => ({ ...prev, icon: e.target.value }))}
                    label="أيقونة القسم"
                    sx={{ direction: 'rtl' }}
                  >
                    {availableIcons.map((icon) => (
                      <MenuItem key={icon.value} value={icon.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {icon.component}
                          <Typography>{icon.name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* معاينة التصميم */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  معاينة التصميم:
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    background: `linear-gradient(135deg, ${newSection.color}15, ${newSection.color}05)`,
                    border: `2px solid ${newSection.color}20`,
                    borderRadius: 3
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: newSection.color, fontSize: 24 }}>
                      {getIcon(newSection.icon)}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: newSection.color,
                          fontWeight: 'bold'
                        }}
                      >
                        {newSection.title || 'عنوان القسم'}
                      </Typography>
                      <Chip 
                        label={newSection.type === 'list' ? 'قائمة' : 'نص'} 
                        size="small" 
                        sx={{ 
                          mt: 0.5,
                          backgroundColor: `${newSection.color}20`,
                          color: newSection.color,
                          fontSize: '0.75rem'
                        }} 
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* محتوى القسم */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {newSection.type === 'list' ? 'عناصر القائمة (عنصر في كل سطر):' : 'محتوى القسم:'}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={isMobile ? 4 : 6}
                  label={newSection.type === 'list' ? 'اكتب كل عنصر في سطر منفصل' : 'محتوى القسم'}
                  value={newSection.content}
                  onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      direction: 'rtl',
                      textAlign: 'right',
                      borderRadius: 3
                    }
                  }}
                />
                {newSection.type === 'list' && (
                  <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#666' }}>
                    مثال: اكتب كل عنصر في سطر منفصل
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ 
            direction: 'rtl', 
            p: { xs: 2, md: 3 },
            borderTop: '1px solid #e2e8f0'
          }}>
            <Button 
              onClick={() => {
                setSectionDialog(false);
                setEditingSection(null);
                resetSectionForm();
              }}
              size={isMobile ? "small" : "medium"}
            >
              إلغاء
            </Button>
            <Button 
              onClick={() => {
                if (editingSection) {
                  editSection(editingSection, newSection);
                } else {
                  addSection();
                }
              }}
              variant="contained" 
              disabled={!newSection.title.trim() || !newSection.content}
              size={isMobile ? "small" : "medium"}
              sx={{
                background: `linear-gradient(135deg, ${newSection.color}, ${newSection.color}dd)`
              }}
            >
              {editingSection ? 'تعديل' : 'إضافة'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar للتنبيهات */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ 
            vertical: isMobile ? 'top' : 'bottom', 
            horizontal: 'center' 
          }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ 
              width: '100%', 
              fontSize: isMobile ? '0.9rem' : '1rem',
              borderRadius: 3
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminDashboardLayout>
  );
}