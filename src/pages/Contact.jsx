import React, { useState, useEffect } from 'react';
import {
  Grid, TextField, Typography, Button, Paper, Box, Snackbar, useMediaQuery
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { sendMessage } from '../utils/contact_firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase';

export default function Contact() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [siteInfo, setSiteInfo] = useState(null);
  const [departments, setDepartments] = useState([]);

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
        const querySnapshot = await getDocs(collection(db, 'heroSection'));
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
    <Box sx={{ p: 4, direction: 'rtl', bgcolor: '#f4faff' }}>
      <Typography variant="h4" textAlign="center" mb={2} fontWeight="bold" color="primary">
        تواصل معنا
      </Typography>

      <Grid container spacing={4} mb={4} direction={isMobile ? 'column-reverse' : 'row'}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" color="#007cb9" mb={2}>معلومات التواصل</Typography>
            {siteInfo && (
              <>
                <Typography mb={1}><FaMapMarkerAlt /> العنوان: {siteInfo.address}</Typography>
                <Typography mb={1}><FaPhoneAlt /> الهاتف: {siteInfo.phone_number}</Typography>
                <Typography mb={1}><FaEnvelope /> البريد الإلكتروني: {siteInfo.email}</Typography>

                <Box mt={3} pt={2} borderTop="1px solid #e0f0fa">
                  <Typography variant="subtitle1" color="#007cb9" gutterBottom><FaClock /> ساعات العمل:</Typography>
                  <Typography variant="body2">{siteInfo.working_days || ""}</Typography>
                  <Typography variant="body2">{siteInfo.working_hours || ""}</Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              height: '100%',
              minHeight: 280
            }}
          >
            <iframe
              src="https://www.google.com/maps?q=طريق بيت حنينا 10, القدس, إسرائيل&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              title="موقع المركز الجماهيري بيت حنينا"
            />
          </Box>

          {siteInfo?.waze_link && (
            <Box textAlign="center" mt={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  يمكنك أيضًا الوصول إلى المركز عبر تطبيق Waze:
                </Typography>
                <a
                  href={siteInfo.waze_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/public-center-website.firebasestorage.app/o/waze.jpeg?alt=media&token=7c13195c-cc0d-45dd-a0af-2c8e5c561ec3"
                    alt="افتح في Waze"
                    style={{
                      width: '50px',
                      height: 'auto',
                      cursor: 'pointer',
                      borderRadius: '5px'
                    }}
                  />
                </a>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>

      <Typography variant="h5" textAlign="center" mb={2} fontWeight="bold" color="primary">
        أرسل لنا رسالة
      </Typography>

      <Paper elevation={3} sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="الاسم" name="first_name"
                    value={values.first_name} onChange={handleChange}
                    error={touched.first_name && Boolean(errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="اسم العائلة" name="last_name"
                    value={values.last_name} onChange={handleChange}
                    error={touched.last_name && Boolean(errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                    inputProps={{ style: { textAlign: 'right' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="البريد الإلكتروني" name="email"
                    type="email" value={values.email} onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    inputProps={{ style: { textAlign: 'right' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="رقم الهاتف" name="phone"
                    type="tel" value={values.phone} onChange={handleChange}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    inputProps={{ style: { textAlign: 'right' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    name="department"
                    label="اختر القسم"
                    value={values.department}
                    onChange={handleChange}
                    SelectProps={{ native: true }}
                    error={touched.department && Boolean(errors.department)}
                    helperText={touched.department && errors.department}
                  >
                    <option value="">-- اختر القسم --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth label="موضوع الرسالة" name="message"
                    multiline rows={4} value={values.message}
                    onChange={handleChange}
                    error={touched.message && Boolean(errors.message)}
                    helperText={touched.message && errors.message}
                    inputProps={{ style: { textAlign: 'right' } }}
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
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                    sx={{ px: 4 }}
                  >
                    {isLoading ? 'جاري الإرسال...' : 'إرسال'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>

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
