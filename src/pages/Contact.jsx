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

export default function Contact() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [siteInfo, setSiteInfo] = useState(null);
  const [departments, setDepartments] = useState([]);

  const buttonColor = ' #005588';
  const headerGradient = "linear-gradient(180deg, #00b0f0 0%, #003366 100%)";

  // إضافة useCallback لمنع إعادة التحميل
    const handleCaptchaChange = useCallback((value) => {
      setCaptchaVerified(!!value);
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
         await sendMessage(values);
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
    <Box sx={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <Box mb={4}>
        <HeroSection pageId="contactUs" />
      </Box>

      <Box mx={{ xs: 2, md: 7 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'right',
            mt: 0,
            mb: 4,
            px: 0,
            direction: 'rtl'
          }}
        >
          <RoundedButton
            label="أرسل رسالة"
            onClick={() => {
              document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
            }}
            color={buttonColor}
          />
        </Box>

        <Grid container spacing={4} mb={3}>
          <Grid item xs={12}>
            <PrettyCard title="معلومات التواصل">
              {/* Remaining UI content stays unchanged */}
            </PrettyCard>
          </Grid>
        </Grid>

    {/* Contact Form */}
        <Box id="contact-form" sx={{ mb: 4 }}>
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
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth 
                        placeholder="الاسم" 
                        name="first_name"
                        value={values.first_name} 
                        onChange={handleChange}
                        error={touched.first_name && Boolean(errors.first_name)}
                        helperText={touched.first_name && errors.first_name}
                        inputProps={{ 
                          style: { textAlign: 'right', direction: 'rtl' }
                        }}
                        InputProps={{
                          style: { direction: 'rtl' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth 
                        placeholder="اسم العائلة" 
                        name="last_name"
                        value={values.last_name} 
                        onChange={handleChange}
                        error={touched.last_name && Boolean(errors.last_name)}
                        helperText={touched.last_name && errors.last_name}
                        inputProps={{ 
                          style: { textAlign: 'right', direction: 'rtl' }
                        }}
                        InputProps={{
                          style: { direction: 'rtl' }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth 
                        placeholder="البريد الإلكتروني" 
                        name="email"
                        type="email" 
                        value={values.email} 
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        inputProps={{ 
                          style: { textAlign: 'right', direction: 'rtl' }
                        }}
                        InputProps={{
                          style: { direction: 'rtl' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth 
                        placeholder="رقم الهاتف" 
                        name="phone"
                        type="tel" 
                        value={values.phone} 
                        onChange={handleChange}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                        inputProps={{ 
                          style: { textAlign: 'right', direction: 'rtl' }
                        }}
                        InputProps={{
                          style: { direction: 'rtl' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        name="department"
                        placeholder="اختر القسم"
                        value={values.department}
                        onChange={handleChange}
                        SelectProps={{ 
                          native: true,
                          displayEmpty: true
                        }}
                        error={touched.department && Boolean(errors.department)}
                        helperText={touched.department && errors.department}
                        sx={{
                          '& .MuiInputBase-input': {
                            textAlign: 'right',
                            direction: 'rtl',
                            paddingRight: '14px'
                          },
                          '& .MuiSelect-icon': {
                            left: 7,
                            right: 'auto'
                          }
                        }}
                      >
                        <option value="" style={{ textAlign: 'right', direction: 'rtl' }}>اختر القسم</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.name} style={{ textAlign: 'right', direction: 'rtl' }}>
                            {dept.name}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth 
                        placeholder="موضوع الرسالة" 
                        name="message"
                        multiline 
                        rows={4} 
                        value={values.message}
                        onChange={handleChange}
                        error={touched.message && Boolean(errors.message)}
                        helperText={touched.message && errors.message}
                        inputProps={{ 
                          style: { textAlign: 'right', direction: 'rtl' }
                        }}
                        InputProps={{
                          style: { direction: 'rtl' }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} textAlign="center">
                      <ReCAPTCHA
                        sitekey="6Le2DxsrAAAAAHoYVOpDRby_DGrmAQzu8IB32mdQ"
                        onChange={handleCaptchaChange}
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
                        size="normal"
                        theme="light"
                        hl="ar"
                      />
                    </Grid>

                    <Grid item xs={12} textAlign="center">
                      <Button
                        disableRipple
                        type="submit"
                        disabled={isLoading}
                        sx={{
                          position: 'relative',
                          padding: '12px 32px',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          fontFamily: 'Cairo, sans-serif',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          color: '#FFFFFF',
                          background: isLoading 
                            ? 'linear-gradient(180deg, #999 0%, #666 100%)' 
                            : headerGradient,
                          borderRadius: '30px',
                          border: 'none',
                          minWidth: '150px',
                          minHeight: '50px',
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
        </Box>
      </Box>

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
