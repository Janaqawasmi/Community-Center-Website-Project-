import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid, TextField, Typography, Button, Paper, Box, Snackbar, useMediaQuery
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import { SiWaze } from 'react-icons/si';
import ReCAPTCHA from 'react-google-recaptcha';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { sendMessage } from '../utils/contact_firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase';
import HeroSection from "../components/HeroSection";
import RoundedButton from '../components/layout/Buttons/RoundedButton'; 
import PrettyCard from '../components/layout/PrettyCard'; // ✅ Use the shared component
import { trackPageView } from "../components/Data Analysis/utils/trackPageView"; 
import { useLocation } from "react-router-dom";
import { Select, MenuItem } from '@mui/material';
import { FormControl, InputLabel } from '@mui/material';
import wazeIcon from '../assets/waze2.png';

export default function Contact() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [siteInfo, setSiteInfo] = useState(null);
  const [departments, setDepartments] = useState([]);

  // لون للزر - التدرج الأزرق الجديد
  const buttonColor = ' #005588';
  const headerGradient = "linear-gradient(180deg, #00b0f0 0%, #003366 100%)";

  // إضافة useCallback لمنع إعادة التحميل
    const handleCaptchaChange = useCallback((token) => {
     setCaptchaVerified(!!token);
     setRecaptchaToken(token || "");
     }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const ref = doc(db, 'siteInfo', '9ib8qFqM732MnTlg6YGz');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setSiteInfo(snap.data());
        }
      } catch (error) {
        console.error("Failed to fetch site info:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sections'));
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().title || doc.id
        }));
        setDepartments(fetched);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchSiteInfo();
    fetchDepartments();
  }, []);

  // إضافة useEffect لحل مشكلة reCAPTCHA
    useEffect(() => {
      // حل مشكلة Cross-Origin لـ reCAPTCHA
      if (typeof window !== 'undefined') {
        // تنظيف السكريبت السابق إن وجد
        const existingScript = document.querySelector('script[src*="recaptcha"]');
        if (existingScript) {
          existingScript.remove();
        }
        
        // إضافة سكريبت reCAPTCHA جديد
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }, []);
    
  // Track page view only once per session 
useEffect(() => {
  const path = location.pathname;
  const key = `viewed_${path}`;
  const lastViewed = localStorage.getItem(key);
  const today = new Date().toDateString();

  if (lastViewed !== today) {
    trackPageView(path);
    localStorage.setItem(key, today);
  } 
}, [location.pathname]);

  const validationSchema = Yup.object({
    first_name: Yup.string().required("الاسم مطلوب"),
    last_name: Yup.string().required("اسم العائلة مطلوب"),
    email: Yup.string().email("صيغة البريد الإلكتروني غير صحيحة").required("البريد الإلكتروني مطلوب"),
    phone: Yup.string().required("رقم الهاتف مطلوب"),
    message: Yup.string().required("محتوى الرسالة مطلوب"),
    department: Yup.string().required("القسم مطلوب")
  });

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
    department: ""
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (!captchaVerified) {
      showSnackbar("يرجى التحقق من أنك لست روبوتاً", 'warning');
      return;
    }

   setIsLoading(true);
       try {
        await sendMessage({
  ...values,
  recaptchaToken: recaptchaToken,
});
         showSnackbar("✅ تم إرسال الرسالة بنجاح");
         resetForm();
         setCaptchaVerified(false);
         // إعادة تعيين reCAPTCHA
         if (window.grecaptcha) {
           window.grecaptcha.reset();
         }
       } catch (err) {
         showSnackbar("حدث خطأ أثناء إرسال الرسالة", 'error');
       } finally {
         setIsLoading(false);
       }
     };

  return (
    <Box sx={{ direction: "rtl" }}>
      <Box mb={2}>
        <HeroSection pageId="contactUs" />
      </Box>

      {/* معلومات التواصل والنموذج - مع تقليل المسافات */}
      <Box mx={{ xs: 2, md: 6 }} mt={1}>
        <Grid container spacing={3} maxWidth="1200px" mx="auto">
          {/* معلومات التواصل */}
          <Grid item xs={12} sm={6} md={6}>
            <PrettyCard title="معلومات التواصل">
              {siteInfo && (
                <Grid container direction="column" spacing={2}>
                  {/* العنوان مع رابط الويز */}
                  <Grid item>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box component="span" sx={{ color: buttonColor }}>
                        <FaMapMarkerAlt size={16} />
                      </Box>
                      <Typography sx={{ fontSize: '0.95rem' }}>
                        <strong>العنوان:</strong> {siteInfo.address}
                      </Typography>
         {siteInfo?.waze_link && (
  <a
    href={siteInfo.waze_link}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: 'none' }}
  >
    <Box
      component="img"
      src={wazeIcon}
      alt="Waze"
      sx={{
        width: 40,         // ✅ Bigger width
        height: 40,        // ✅ Bigger height
        objectFit: 'contain',
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        ml: 1,
      }}
    />
  </a>
)}



                    </Box>
                  </Grid>

                  {/* ساعات العمل */}
                  <Grid item>
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      <Box component="span" sx={{ color: buttonColor, mt: 0.5 }}>
                        <FaClock size={16} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 'bold' }}>
                          ساعات الاستقبال:
                        </Typography>
                        {Array.isArray(siteInfo?.reception_hours) && siteInfo.reception_hours.map((entry, index) => (
                          <Typography key={index} sx={{ fontSize: '0.9rem' }}>
                            {entry.day}: {entry.hours}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  {/* الهاتف */}
                  <Grid item>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box component="span" sx={{ color: buttonColor }}>
                        <FaPhoneAlt size={16} />
                      </Box>
                      <Typography sx={{ fontSize: '0.95rem' }}>
                        <strong>الهاتف:</strong> {siteInfo.phone_number}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* البريد الإلكتروني */}
                  <Grid item>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box component="span" sx={{ color: buttonColor }}>
                        <FaEnvelope size={16} />
                      </Box>
                      <Typography sx={{ fontSize: '0.95rem' }}>
                        <strong>البريد الإلكتروني:</strong> {siteInfo.email}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </PrettyCard>
          </Grid>

          {/* نموذج التواصل */}
          <Grid item xs={12} md={6} id="contact-form">
            <PrettyCard title="أرسل لنا رسالة">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={false}
                validateOnMount={false}
              >
                {({ values, errors, touched, handleChange }) => (
                  <Form noValidate>
                    <Grid container spacing={0.5}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth 
                          size="small" 
                          placeholder="الاسم" 
                          name="first_name"
                          value={values.first_name} 
                          onChange={handleChange}
                          error={touched.first_name && Boolean(errors.first_name)}
                          helperText={touched.first_name && errors.first_name}
                          inputProps={{
                            style: {
                              textAlign: 'right',
                              direction: 'rtl',
                              padding: '6px 10px',
                              fontSize: '0.85rem'
                            }
                          }}
                          InputProps={{
                            style: {
                              direction: 'rtl',
                              fontSize: '0.85rem'
                            }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth 
                          size="small"
                          placeholder="اسم العائلة" 
                          name="last_name"
                          value={values.last_name} 
                          onChange={handleChange}
                          error={touched.last_name && Boolean(errors.last_name)}
                          helperText={touched.last_name && errors.last_name}
                          inputProps={{ 
                            style: { 
                              textAlign: 'right', 
                              direction: 'rtl',
                              padding: '6px 10px',
                              fontSize: '0.85rem'
                            }
                          }}
                          InputProps={{
                            style: {
                              direction: 'rtl',
                              fontSize: '0.85rem'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth 
                          size="small" 
                          placeholder="البريد الإلكتروني" 
                          name="email"
                          type="email" 
                          value={values.email} 
                          onChange={handleChange}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          inputProps={{ 
                            style: { 
                              textAlign: 'right', 
                              direction: 'rtl',
                              padding: '6px 10px',
                              fontSize: '0.85rem'
                            }
                          }}
                          InputProps={{
                            style: {
                              direction: 'rtl',
                              fontSize: '0.85rem'
                            }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth 
                          size="small"
                          placeholder="رقم الهاتف" 
                          name="phone"
                          type="tel" 
                          value={values.phone} 
                          onChange={handleChange}
                          error={touched.phone && Boolean(errors.phone)}
                          helperText={touched.phone && errors.phone}
                          inputProps={{ 
                            style: { 
                              textAlign: 'right', 
                              direction: 'rtl',
                              padding: '6px 10px',
                              fontSize: '0.85rem'
                            }
                          }}
                          InputProps={{
                            style: {
                              direction: 'rtl',
                              fontSize: '0.85rem'
                            }
                          }}
                        />
                      </Grid>
 <Grid item xs={12}>
<FormControl fullWidth size="small" error={touched.department && Boolean(errors.department)}>
  <Select
    displayEmpty
    name="department"
    value={values.department}
    onChange={handleChange}
    sx={{
      direction: 'rtl',
      textAlign: 'right',
      fontSize: '0.85rem',
      minHeight: '40px',
      '& .MuiSelect-icon': {
        left: 7,
        right: 'auto',
      }
    }}
    MenuProps={{
    PaperProps: {
      style: {
        maxHeight: 280, // ✅ Make the menu shorter
        direction: 'rtl',
      },
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
    disableAutoFocusItem: true,
  }}
  >
    <MenuItem value="" disabled>
      <span style={{ color: '#888' }}>اختر القسم</span>
    </MenuItem>
    {departments.map((dept) => (
      <MenuItem key={dept.id} value={dept.name}>
        {dept.name}
      </MenuItem>
    ))}
  </Select>

  {touched.department && errors.department && (
    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
      {errors.department}
    </Typography>
  )}
</FormControl>

</Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth 
                          size="small"
                          placeholder="موضوع الرسالة" 
                          name="message"
                          multiline 
                          rows={2.5} 
                          value={values.message}
                          onChange={handleChange}
                          error={touched.message && Boolean(errors.message)}
                          helperText={touched.message && errors.message}
                          inputProps={{
                            style: {
                              textAlign: 'right',
                              direction: 'rtl',
                              padding: '6px 10px',
                              fontSize: '0.85rem'
                            }
                          }}
                          InputProps={{
                            style: {
                              direction: 'rtl',
                              fontSize: '0.85rem'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} textAlign="center">
                        <Box 
                          sx={{ 
                            transform: 'scale(0.85)', 
                            transformOrigin: 'center',
                            mb: -1
                          }}
                        >
                          <ReCAPTCHA
                            sitekey="6Le2DxsrAAAAAHoYVOpDRby_DGrmAQzu8IB32mdQ"
                            onChange={handleCaptchaChange}
                            size="normal"
                            onExpired={() => {
                              setCaptchaVerified(false);
                              console.log('reCAPTCHA expired');
                            }}
                            onError={(error) => {
                              setCaptchaVerified(false);
                              console.error('reCAPTCHA error:', error);
                            }}
                            onLoadCallback={() => {
                              console.log('reCAPTCHA loaded successfully');
                            }}
                            theme="light"
                            hl="ar"
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} textAlign="center">
                        <Button
                          disableRipple
                          type="submit"
                          disabled={isLoading}
                          sx={{
                            position: 'relative',
                            padding: '6px 16px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            fontFamily: 'Cairo, sans-serif',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            color: '#FFFFFF',
                            background: isLoading 
                              ? 'linear-gradient(180deg, #999 0%, #666 100%)' 
                              : headerGradient,
                            borderRadius: '25px',
                            border: 'none',
                            minWidth: '100px',
                            minHeight: '36px',
                            transition: 'all 0.3s ease-in-out',
                            textTransform: 'none',
                            boxShadow: isLoading 
                              ? '0 2px 8px rgba(0,0,0,0.1)' 
                              : '0 4px 15px rgba(0, 181, 240, 0.3)',
                            
                            '&:hover': !isLoading ? {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(0, 181, 240, 0.4)',
                              background: 'linear-gradient(180deg, #1ac4ff 0%, #004477 100%)',
                            } : {},
                            
                            '&:focus': {
                              outline: 'none',
                            },

                            '&:disabled': {
                              cursor: 'not-allowed',
                            }
                          }}
                        >
                          {isLoading ? 'جاري الإرسال...' : 'إرسال'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </PrettyCard>
          </Grid>
        </Grid>     
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}