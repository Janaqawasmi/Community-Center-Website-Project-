import React, { useState, useEffect } from 'react';
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

  // لون للزر - التدرج الأزرق الجديد
  const buttonColor = ' #005588';
  const headerGradient = "linear-gradient(180deg, #00b0f0 0%, #003366 100%)";

  

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
    } catch (err) {
      showSnackbar("حدث خطأ أثناء إرسال الرسالة", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box  mb={8} sx={{  direction: "rtl" }}>
      <Box mb={8}>
        <HeroSection pageId="contactUs" />
      </Box>

      {/* الزر في أعلى الصفحة */}
      <Box mx={{ xs: 2, md: 7 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'right',
            mt: 0,
            mb: 4,
            px: 0,
            direction: 'rtl',
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

        {/* معلومات التواصل في PrettyCard */}
        <Grid container spacing={4} mb={3}>
          <Grid item xs={12}>
            <PrettyCard title="معلومات التواصل" >
              {siteInfo && (
                <Grid container spacing={3}>
                  {/* العنوان والهاتف في نفس السطر */}
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {/* العنوان مع رابط الويز */}
                      <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Box component="span" sx={{ color: buttonColor }}>
                            <FaMapMarkerAlt size={20} />
                          </Box>
                          <Typography component="span" sx={{ fontSize: '1.1rem', mr: 0.5 }}>
                            <strong>العنوان:</strong> {siteInfo.address}
                          </Typography>
                          {siteInfo?.waze_link && (
                            <a
                              href={siteInfo.waze_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none', marginRight: '4px' }}
                            >
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  backgroundColor: ' #2D9CDB',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: '0.3s',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    backgroundColor: '#1e7db8',
                                  },
                                }}
                              >
                                <SiWaze size={22} color="#fff" />
                              </Box>
                            </a>
                          )}
                        </Box>
                      </Grid>

                      {/* الهاتف */}
                      <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center">
                          <Box component="span" sx={{ color: buttonColor, ml: 1 }}>
                            <FaPhoneAlt size={20} />
                          </Box>
                          <Typography sx={{ fontSize: '1.1rem' }}>
                            <strong>الهاتف:</strong> {siteInfo.phone_number}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* ساعات العمل والبريد الإلكتروني في نفس السطر */}
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {/* ساعات العمل */}
                      <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="flex-start">
                          <Box component="span" sx={{ color: buttonColor, ml: 1, mt: 0.5 }}>
                            <FaClock size={20} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                              ساعات العمل:
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>{siteInfo.working_days || ""}</Typography>
                            <Typography sx={{ fontSize: '1rem' }}>{siteInfo.working_hours || ""}</Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* البريد الإلكتروني */}
                      <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center">
                          <Box component="span" sx={{ color: buttonColor, ml: 1 }}>
                            <FaEnvelope size={20} />
                          </Box>
                          <Typography sx={{ fontSize: '1.1rem' }}>
                            <strong>البريد الإلكتروني:</strong> {siteInfo.email}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </PrettyCard>
          </Grid>
        </Grid>

        {/* Contact Form */}
        <Box id="contact-form" sx={{ mb: 0 }}>
          <PrettyCard title="أرسل لنا رسالة">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange }) => (
                <Form noValidate>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth label="الاسم" name="first_name"
                        value={values.first_name} onChange={handleChange}
                        error={touched.first_name && Boolean(errors.first_name)}
                        helperText={touched.first_name && errors.first_name}
                        inputProps={{ 
                          style: { textAlign: 'right', direction: 'rtl' }
                        }}
                        InputLabelProps={{
                          style: { right: 24, left: 'auto', transformOrigin: 'top right' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth label="اسم العائلة" name="last_name"
                        value={values.last_name} onChange={handleChange}
                        error={touched.last_name && Boolean(errors.last_name)}
                        helperText={touched.last_name && errors.last_name}
                        inputProps={{ 
                          style: { textAlign: 'right', direction: 'rtl' }
                        }}
                        InputLabelProps={{
                          style: { right: 24, left: 'auto', transformOrigin: 'top right' }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth label="البريد الإلكتروني" name="email"
                        type="email" value={values.email} onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        inputProps={{ 
                          style: { textAlign: 'right', direction: 'rtl' }
                        }}
                        InputLabelProps={{
                          style: { right: 24, left: 'auto', transformOrigin: 'top right' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth label="رقم الهاتف" name="phone"
                        type="tel" value={values.phone} onChange={handleChange}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                        inputProps={{ 
                          style: { textAlign: 'right', direction: 'rtl' }
                        }}
                        InputLabelProps={{
                          style: { right: 24, left: 'auto', transformOrigin: 'top right' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        name="department"
                        value={values.department}
                        onChange={handleChange}
                        SelectProps={{ 
                          native: true
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
                        fullWidth label="موضوع الرسالة" name="message"
                        multiline rows={3} value={values.message}
                        onChange={handleChange}
                        error={touched.message && Boolean(errors.message)}
                        helperText={touched.message && errors.message}
                        inputProps={{ 
                          style: { textAlign: 'right', direction: 'rtl' }
                        }}
                        InputLabelProps={{
                          style: { right: 24, left: 'auto', transformOrigin: 'top right' }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} textAlign="center">
                      <ReCAPTCHA
                        sitekey="6Le2DxsrAAAAAHoYVOpDRby_DGrmAQzu8IB32mdQ"
                        onChange={(val) => setCaptchaVerified(!!val)}
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
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          color: '#FFFFFF',
                          background: isLoading 
                            ? 'linear-gradient(180deg, #999 0%, #666 100%)' 
                            : headerGradient,
                          borderRadius: '28px',
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