import React, { useState, useEffect } from 'react';
import {
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Divider,
  Alert,
  Snackbar,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
  Fab,
  Collapse,
  Paper,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel
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
  AddBox
} from '@mui/icons-material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../components/firebase';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import { withProgress } from '../../utils/withProgress';

export default function AdminAbout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [aboutData, setAboutData] = useState({
    about_us_text: '',
    vision_title: 'الرؤية',
    vision: '',
    message_title: 'الرسالة',
    message: '',
    justifications_title: 'المبررات',
    justifications: '',
    goals_title: 'الأهداف',
    goals: [],
    custom_sections: [] // إضافة الأقسام المخصصة
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newGoal, setNewGoal] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalDialog, setGoalDialog] = useState(false);
  const [previewMode, setPreviewMode] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    vision: false,
    message: false,
    justifications: false,
    goals: false
  });

  // حالات للأقسام المخصصة
  const [customSectionDialog, setCustomSectionDialog] = useState(false);
  const [newCustomSection, setNewCustomSection] = useState({
    title: '',
    content: '',
    color: '#2563eb',
    icon: 'Info'
  });
  const [editingCustomSection, setEditingCustomSection] = useState(null);

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
    { name: 'ألوان', value: 'ColorLens', component: <ColorLens /> }
  ];

  // دالة للحصول على الأيقونة
  const getIcon = (iconName) => {
    const iconObj = availableIcons.find(icon => icon.value === iconName);
    return iconObj ? iconObj.component : <Info />;
  };

  // جلب البيانات من Firebase
  const fetchAboutData = async () => {
  setLoading(true);
  await withProgress(async () => {
    try {
      const docRef = doc(db, "siteInfo", "about us");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAboutData({
          about_us_text: data.about_us_text || '',
          vision_title: data.vision_title || 'الرؤية',
          vision: data.vision || '',
          message_title: data.message_title || 'الرسالة',
          message: data.message || '',
          justifications_title: data.justifications_title || 'المبررات',
          justifications: data.justifications || '',
          goals_title: data.goals_title || 'الأهداف',
          goals: data.goals || [],
          custom_sections: data.custom_sections || []
        });
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      showSnackbar('حدث خطأ في تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  });
};


  // حفظ البيانات في Firebase
const saveAboutData = async () => {
  setSaving(true);
  await withProgress(async () => {
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
  });
};


  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field, value) => {
    setAboutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // إدارة الأهداف
  const addGoal = () => {
    if (newGoal.trim()) {
      setAboutData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }));
      setNewGoal('');
      setGoalDialog(false);
    }
  };

  const editGoal = (index, newValue) => {
    setAboutData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? newValue : goal)
    }));
    setEditingGoal(null);
  };

  const deleteGoal = (index) => {
    setAboutData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  // إدارة الأقسام المخصصة
  const addCustomSection = () => {
    if (newCustomSection.title.trim() && newCustomSection.content.trim()) {
      setAboutData(prev => ({
        ...prev,
        custom_sections: [...prev.custom_sections, { 
          ...newCustomSection,
          id: Date.now() // معرف فريد
        }]
      }));
      setNewCustomSection({
        title: '',
        content: '',
        color: '#2563eb',
        icon: 'Info'
      });
      setCustomSectionDialog(false);
    }
  };

  const editCustomSection = (index, updatedSection) => {
    setAboutData(prev => ({
      ...prev,
      custom_sections: prev.custom_sections.map((section, i) => 
        i === index ? updatedSection : section
      )
    }));
    setEditingCustomSection(null);
  };

  const deleteCustomSection = (index) => {
    setAboutData(prev => ({
      ...prev,
      custom_sections: prev.custom_sections.filter((_, i) => i !== index)
    }));
  };

  const togglePreview = (field) => {
    setPreviewMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // مكون العنوان الجميل (مثل الصور)
  const StyledTitle = ({ title, color, children }) => (
    <Box sx={{ position: 'relative', mb: 4 }}>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          borderRadius: '50px 0 50px 0',
          padding: { xs: '12px 24px', md: '16px 32px' },
          display: 'inline-block',
          boxShadow: `0 4px 20px ${color}40`,
          transform: 'skew(-5deg)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, transparent 30%, ${color}20 50%, transparent 70%)`,
            animation: 'shine 3s infinite'
          },
          '@keyframes shine': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' }
          }
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontamily: 'Cairo, sans-serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transform: 'skew(5deg)',
            fontSize: { xs: '1.1rem', md: '1.4rem' }
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );

  // مكون القسم القابل للطي مع تصميم محسن
  const CollapsibleSection = ({ title, children, icon, section, color = '#2563eb' }) => (
    <Card sx={{ 
      mb: 3, 
      boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.1)',
      borderRadius: isMobile ? 3 : 4,
      overflow: 'hidden',
      border: `2px solid ${color}20`
    }}>
      <Box
        onClick={() => toggleSection(section)}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          borderBottom: expandedSections[section] ? `2px solid ${color}20` : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: `linear-gradient(135deg, ${color}25, ${color}15)`,
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 2, md: 3 } // تحسين المسافات
        }}>
          <Box sx={{ 
            color: color, 
            display: 'flex',
            fontSize: { xs: 24, md: 28 } // تحسين حجم الأيقونات
          }}>
            {icon}
          </Box>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{ 
              fontWeight: 'bold', 
              color: color,
              fontSize: isMobile ? '1.2rem' : '1.4rem'
            }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton 
          sx={{ 
            color: color,
            '&:hover': {
              backgroundColor: `${color}20`,
              transform: 'rotate(180deg)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {expandedSections[section] ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      
      <Collapse in={expandedSections[section]}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          {children}
        </CardContent>
      </Collapse>
    </Card>
  );

  // مكون النص مع المعاينة
  const TextFieldWithPreview = ({ label, value, onChange, multiline = false, rows = 4, field }) => (
    <Box>
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
          {label}
        </Typography>
        <Button
          size="small"
          onClick={() => togglePreview(field)}
          startIcon={previewMode[field] ? <Edit /> : <Visibility />}
          sx={{ 
            color: '#2563eb',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            minWidth: 'auto',
            px: { xs: 1.5, md: 2 },
            gap: 1
          }}
        >
          {previewMode[field] ? 'تعديل' : 'معاينة'}
        </Button>
      </Box>
      
      {previewMode[field] ? (
        <Paper sx={{ 
          p: { xs: 2, md: 2.5 }, 
          backgroundColor: '#f9f9f9',
          minHeight: multiline ? (isMobile ? '120px' : '140px') : (isMobile ? '56px' : '64px'),
          whiteSpace: 'pre-wrap',
          border: '2px solid #e0e0e0',
          borderRadius: 3
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'right', 
              direction: 'rtl',
              fontSize: isMobile ? '0.95rem' : '1rem',
              lineHeight: 1.7
            }}
          >
            {value || 'لا يوجد محتوى'}
          </Typography>
        </Paper>
      ) : (
        <TextField
          fullWidth
          multiline={multiline}
          rows={multiline ? (isMobile ? Math.max(3, rows - 1) : rows) : 1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
      )}
    </Box>
  );

  return (
    <AdminDashboardLayout>
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        direction: 'rtl', 
        pb: isMobile ? 12 : 4
      }}>
        {/* Header مع تصميم جميل */}
        <Typography
  variant="h4"
  fontWeight={500}
  sx={{
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
                fontSize: { xs: '0.9rem', md: '2rem' }
              }}
            >
            </Typography>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchAboutData}
                  disabled={loading}
                  size="medium"
                  sx={{ 
                    gap: 1    // ← المسافة بين الأيقونة والنص
                  }}
                >
                  تحديث
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={saveAboutData}
                  disabled={saving}
                  sx={{ background: '#2563eb',
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
            {/* أزرار إضافة محتوى جديد */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 4,
              flexDirection: isMobile ? 'column' : 'row'
            }}>
           <Button
  variant="contained"
  startIcon={<AddBox />}
  onClick={() => setCustomSectionDialog(true)}
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

            {/* نبذة عن المركز */}
            <CollapsibleSection 
              title="نبذة عن المركز" 
              icon={<Info />}
              section="about"
              color="#2563eb"
            >
              <TextFieldWithPreview
                label="النص التعريفي للمركز"
                value={aboutData.about_us_text}
                onChange={(value) => handleInputChange('about_us_text', value)}
                multiline
                rows={6}
                field="about_us_text"
              />
            </CollapsibleSection>

            {/* الرؤية */}
            <CollapsibleSection 
              title="الرؤية" 
              icon={<Visibility />}
              section="vision"
              color="#10b981"
            >
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="عنوان الرؤية"
                  value={aboutData.vision_title}
                  onChange={(e) => handleInputChange('vision_title', e.target.value)}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      direction: 'rtl',
                      textAlign: 'right',
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
              <TextFieldWithPreview
                label="محتوى الرؤية"
                value={aboutData.vision}
                onChange={(value) => handleInputChange('vision', value)}
                multiline
                rows={5}
                field="vision"
              />
            </CollapsibleSection>

            {/* الرسالة */}
            <CollapsibleSection 
              title="الرسالة" 
              icon={<Edit />}
              section="message"
              color="#f59e0b"
            >
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="عنوان الرسالة"
                  value={aboutData.message_title}
                  onChange={(e) => handleInputChange('message_title', e.target.value)}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      direction: 'rtl',
                      textAlign: 'right',
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
              <TextFieldWithPreview
                label="محتوى الرسالة"
                value={aboutData.message}
                onChange={(value) => handleInputChange('message', value)}
                multiline
                rows={5}
                field="message"
              />
            </CollapsibleSection>

            {/* المبررات */}
            <CollapsibleSection 
              title="المبررات" 
              icon={<Subject />}
              section="justifications"
              color="#ef4444"
            >
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="عنوان المبررات"
                  value={aboutData.justifications_title}
                  onChange={(e) => handleInputChange('justifications_title', e.target.value)}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      direction: 'rtl',
                      textAlign: 'right',
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
              <TextFieldWithPreview
                label="محتوى المبررات"
                value={aboutData.justifications}
                onChange={(value) => handleInputChange('justifications', value)}
                multiline
                rows={5}
                field="justifications"
              />
            </CollapsibleSection>

            {/* الأهداف */}
            <CollapsibleSection 
              title="الأهداف" 
              icon={<Add />}
              section="goals"
              color="#8b5cf6"
            >
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="عنوان الأهداف"
                  value={aboutData.goals_title}
                  onChange={(e) => handleInputChange('goals_title', e.target.value)}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      direction: 'rtl',
                      textAlign: 'right',
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 0
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: isMobile ? '1rem' : '1.1rem'
                  }}
                >
                  قائمة الأهداف ({aboutData.goals.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setGoalDialog(true)}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    backgroundColor: '#8b5cf6',
                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                    px: 3
                  }}
                >
                  إضافة هدف
                </Button>
              </Box>

              <List sx={{ p: 0 }}>
                {aboutData.goals.map((goal, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      border: '2px solid #e0e0e0',
                      borderRadius: 3,
                      mb: 2,
                      backgroundColor: '#f9f9f9',
                      p: { xs: 2, md: 3 },
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'flex-start' : 'center'
                    }}
                  >
                    <ListItemText
                      primary={
                        editingGoal === index ? (
                          <TextField
                            fullWidth
                            value={goal}
                            onChange={(e) => editGoal(index, e.target.value)}
                            onBlur={() => setEditingGoal(null)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                setEditingGoal(null);
                              }
                            }}
                            autoFocus
                            size={isMobile ? "small" : "medium"}
                            multiline={isMobile}
                            rows={isMobile ? 2 : 1}
                          />
                        ) : (
                          <Typography sx={{ 
                            textAlign: 'right',
                            fontSize: isMobile ? '0.95rem' : '1rem',
                            lineHeight: 1.6,
                            fontWeight: 500
                          }}>
                            {index + 1}. {goal}
                          </Typography>
                        )
                      }
                      sx={{ mb: isMobile ? 2 : 0 }}
                    />
                  <Box sx={{
  position: isMobile ? 'static' : 'absolute',
  left: isMobile ? 'auto' : 16,
  transform: isMobile ? 'none' : 'translateY(-50%)',
  top: isMobile ? 'auto' : '50%',
  display: 'flex',
  gap: 1
}}>
  <IconButton
    onClick={() => setEditingGoal(index)}
    size={isMobile ? "small" : "medium"}
  >
    <Edit fontSize={isMobile ? "small" : "medium"} />
  </IconButton>
  <IconButton
    onClick={() => deleteGoal(index)}
    color="error"
    size={isMobile ? "small" : "medium"}
  >
    <Delete fontSize={isMobile ? "small" : "medium"} />
  </IconButton>
</Box>
                  </ListItem>
                ))}
              </List>
            </CollapsibleSection>

            {/* الأقسام المخصصة */}
            {aboutData.custom_sections.map((section, index) => (
              <CollapsibleSection
                key={section.id || index}
                title={section.title}
                icon={getIcon(section.icon)}
                section={`custom_${index}`}
                color={section.color}
              >
                <Box>
                  <TextFieldWithPreview
                    label={`محتوى ${section.title}`}
                    value={section.content}
                    onChange={(value) => {
                      const updatedSections = [...aboutData.custom_sections];
                      updatedSections[index] = { ...section, content: value };
                      setAboutData(prev => ({ ...prev, custom_sections: updatedSections }));
                    }}
                    multiline
                    rows={5}
                    field={`custom_${index}`}
                  />
                  
                  {/* أزرار التحكم في القسم المخصص */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mt: 3,
                    justifyContent: 'flex-end'
                  }}>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => {
                        setNewCustomSection(section);
                        setEditingCustomSection(index);
                        setCustomSectionDialog(true);
                      }}
                      size="small"
                    >
                      تعديل القسم
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => deleteCustomSection(index)}
                      size="small"
                    >
                      حذف القسم
                    </Button>
                  </Box>
                </Box>
              </CollapsibleSection>
            ))}
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

        {/* Dialog لإضافة/تعديل قسم مخصص */}
        <Dialog 
          open={customSectionDialog} 
          onClose={() => {
            setCustomSectionDialog(false);
            setEditingCustomSection(null);
            setNewCustomSection({
              title: '',
              content: '',
              color: '#2563eb',
              icon: 'Info'
            });
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
            {editingCustomSection !== null ? 'تعديل القسم' : 'إضافة قسم جديد'}
          </DialogTitle>
          
          <DialogContent sx={{ p: { xs: 2, md: 3 }, direction: 'rtl' }}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* عنوان القسم */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="عنوان القسم"
                  value={newCustomSection.title}
                  onChange={(e) => setNewCustomSection(prev => ({ ...prev, title: e.target.value }))}
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

              {/* اختيار اللون */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                  <InputLabel>لون القسم</InputLabel>
                  <Select
                    value={newCustomSection.color}
                    onChange={(e) => setNewCustomSection(prev => ({ ...prev, color: e.target.value }))}
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                  <InputLabel>أيقونة القسم</InputLabel>
                  <Select
                    value={newCustomSection.icon}
                    onChange={(e) => setNewCustomSection(prev => ({ ...prev, icon: e.target.value }))}
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
                    background: `linear-gradient(135deg, ${newCustomSection.color}15, ${newCustomSection.color}05)`,
                    border: `2px solid ${newCustomSection.color}20`,
                    borderRadius: 3
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: newCustomSection.color, fontSize: 24 }}>
                      {getIcon(newCustomSection.icon)}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: newCustomSection.color,
                        fontWeight: 'bold'
                      }}
                    >
                      {newCustomSection.title || 'عنوان القسم'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* محتوى القسم */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={isMobile ? 4 : 6}
                  label="محتوى القسم"
                  value={newCustomSection.content}
                  onChange={(e) => setNewCustomSection(prev => ({ ...prev, content: e.target.value }))}
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
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ 
            direction: 'rtl', 
            p: { xs: 2, md: 3 },
            borderTop: '1px solid #e2e8f0'
          }}>
            <Button 
              onClick={() => {
                setCustomSectionDialog(false);
                setEditingCustomSection(null);
                setNewCustomSection({
                  title: '',
                  content: '',
                  color: '#2563eb',
                  icon: 'Info'
                });
              }}
              size={isMobile ? "small" : "medium"}
            >
              إلغاء
            </Button>
            <Button 
              onClick={() => {
                if (editingCustomSection !== null) {
                  editCustomSection(editingCustomSection, newCustomSection);
                  setEditingCustomSection(null);
                } else {
                  addCustomSection();
                }
                setCustomSectionDialog(false);
                setNewCustomSection({
                  title: '',
                  content: '',
                  color: '#2563eb',
                  icon: 'Info'
                });
              }}
              variant="contained" 
              disabled={!newCustomSection.title.trim() || !newCustomSection.content.trim()}
              size={isMobile ? "small" : "medium"}
              sx={{
                background: `linear-gradient(135deg, ${newCustomSection.color}, ${newCustomSection.color}dd)`
              }}
            >
              {editingCustomSection !== null ? 'تعديل' : 'إضافة'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog لإضافة هدف جديد */}
        <Dialog 
          open={goalDialog} 
          onClose={() => setGoalDialog(false)} 
          maxWidth="sm" 
          fullWidth
          fullScreen={isSmallMobile}
        >
          <DialogTitle sx={{ 
            textAlign: 'right', 
            direction: 'rtl',
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            color: 'white'
          }}>
            إضافة هدف جديد
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 3 : 4}
              label="نص الهدف"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              sx={{ 
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  direction: 'rtl',
                  textAlign: 'right',
                  borderRadius: 3
                }
              }}
              size={isMobile ? "small" : "medium"}
            />
          </DialogContent>
          <DialogActions sx={{ direction: 'rtl', p: { xs: 2, md: 3 } }}>
            <Button 
              onClick={() => setGoalDialog(false)}
              size={isMobile ? "small" : "medium"}
            >
              إلغاء
            </Button>
            <Button 
              onClick={addGoal} 
              variant="contained" 
              disabled={!newGoal.trim()}
              size={isMobile ? "small" : "medium"}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
              }}
            >
              إضافة
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