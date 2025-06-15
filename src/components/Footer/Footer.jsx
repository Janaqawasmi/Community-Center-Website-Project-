import { Box, Container, Typography, Grid, Link, IconButton, Button } from '@mui/material';
import { Facebook, Instagram, WhatsApp, Email, LocationOn, Phone } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";
import defaultLogo from '../../assets/logo.png';


export default function Footer() {
  const sectionColor = '#D05F14'; // Brand orange
  const [siteInfo, setSiteInfo] = useState(null);
const [sections, setSections] = useState([]);
useEffect(() => {
  const fetchSiteInfo = async () => {
    try {
      const docRef = doc(db, 'siteInfo', '9ib8qFqM732MnTlg6YGz');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("✅ siteInfo data:", docSnap.data());
        setSiteInfo(docSnap.data());
      } else {
        console.warn("⚠️ siteInfo document not found!");
      }
    } catch (error) {
      console.error("❌ Error fetching siteInfo:", error);
    }
  };

  const fetchSections = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "sections"));
      const sectionList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSections(sectionList);
    } catch (err) {
      console.error("❌ Error fetching sections:", err);
    }
  };

  fetchSiteInfo();
  fetchSections();
}, []);


  if (!siteInfo) {
    return (
      <Box sx={{ backgroundColor: '#eeeeee', p: 4, textAlign: 'center' }}>
        <Typography>...جاري تحميل معلومات التذييل</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#eeeeee',
        borderTop: '6px solid #0077b6',
        mt: 8,
        pt: 4,
        pb: 2,
        fontFamily: 'Cairo, sans-serif',
        direction: 'rtl',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo & Slogan */}
<Grid item xs={12} md={3}>
  <Box textAlign="center" mb={2}>
    <img
      src={siteInfo.logo_url || defaultLogo}
      alt="شعار المركز"
      style={{ width: 120, maxWidth: '100%', marginBottom: 8 }}
    />
    <Typography
      variant="h5"
      fontWeight="bold"
      color="primary"
      sx={{ mt: 1 }}
    >
      المركز الجماهيري بيت حنينا
    </Typography>
    <Typography variant="body1" fontWeight="500" mt={1}>
      {siteInfo.slogan || 'معًا نبني مجتمعًا متماسكًا وداعمًا للجميع 🧡'}
    </Typography>
  </Box>
</Grid>


            {/* Dynamic Sections */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>الأقسام</Typography>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {sections.map(sec => (
                <li key={sec.id}>
                  <Link href={`/sections/${sec.id}`} underline="hover">{sec.title}</Link>
                </li>
              ))}
            </ul>
          </Grid>
          {/* Navigation Links */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              روابط مهمة
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link href="/" underline="hover">الرئيسية</Link></li>
              <li><Link href="/programs" underline="hover">الدورات</Link></li>
              <li><Link href="/news" underline="hover">أخبارنا</Link></li>
              <li><Link href="/contact" underline="hover">تواصل معنا</Link></li>
            </ul>
          </Grid>

          <Grid item xs={12} md={3}>
  {/* تواصل معنا */}
  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
    تواصل معنا
  </Typography>

  <Box display="flex" alignItems="center" gap={1} mb={1}>
    <LocationOn fontSize="small" />
    <Typography variant="body2">{siteInfo.address}</Typography>
  </Box>

  <Box display="flex" alignItems="center" gap={1} mb={1}>
    <Phone fontSize="small" />
    <Typography variant="body2">{siteInfo.phone_number}</Typography>
  </Box>

  <Box display="flex" alignItems="center" gap={1} mb={1}>
    <Email fontSize="small" />
    <Typography variant="body2">{siteInfo.email}</Typography>
  </Box>

  {siteInfo.waze_link && (
    <Button
      variant="outlined"
      href={siteInfo.waze_link}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        borderColor: sectionColor,
        color: sectionColor,
        mt: 2,
        borderRadius: '20px',
        px: 3,
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: sectionColor,
          color: '#fff'
        }
      }}
    >
      🚗 الوصول عبر Waze
    </Button>
  )}



  {/* تابعونا (Social Icons) */}
{/* تابعونا (Social Icons) */}
<Box mt={4}>
  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
    تابعونا
  </Typography>
  <Box display="flex" gap={1}>
    {siteInfo.FacebookLink && (
      <IconButton
        href={siteInfo.FacebookLink}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: '#1877F2' }} // Facebook Blue
      >
        <Facebook />
      </IconButton>
    )}
    {siteInfo.instagramLink && (
      <IconButton
        href={siteInfo.instagramLink}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: '#E1306C' }} // Instagram Pink
      >
        <Instagram />
      </IconButton>
    )}
    {siteInfo.WhatsAppLink && (
      <IconButton
        href={siteInfo.WhatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: '#25D366' }} // WhatsApp Green
      >
        <WhatsApp />
      </IconButton>
    )}
  </Box>
</Box>


  {/* Volunteer Button */}
  <Button
    variant="outlined"
    href="/volunteer"
    sx={{
      mt: 3,
      borderColor: sectionColor,
      color: sectionColor,
      fontWeight: 'bold',
      borderRadius: '20px',
      px: 3,
      '&:hover': {
        backgroundColor: sectionColor,
        color: '#fff',
      }
    }}
  >
    🌟 انضم كمتطوع
  </Button>
</Grid>

        </Grid>

        {/* Footer Bottom Bar */}
        <Box sx={{ pt: 3 }}>
          <Typography variant="body2" align="center" sx={{ color: '#888' }}>
            جميع الحقوق محفوظة © {new Date().getFullYear()} المركز الجماهيري بيت حنينا
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
