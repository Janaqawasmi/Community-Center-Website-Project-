import { Box, Container, Typography, Grid, Link, IconButton, Button } from '@mui/material';
import { Facebook, Instagram, WhatsApp, Email, LocationOn, Phone } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";
import defaultLogo from '../../assets/logo.png';

export default function Footer() {
  const sectionColor = '#D05F14'; // Brand orange
  const [siteInfo, setSiteInfo] = useState(null);

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

  fetchSiteInfo();
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
            <Box display="flex" alignItems="center" mb={1}>
              <img
                src={siteInfo.logo_url || defaultLogo}
                alt="شعار المركز"
                style={{ width: 60, marginLeft: 10 }}
              />
              <Typography variant="h6" fontWeight="bold" color="primary">
                المركز الجماهيري بيت حنينا
              </Typography>
            </Box>
            <Typography variant="body2">
              معًا نبني مجتمعًا متماسكًا وداعمًا للجميع 🧡
            </Typography>
          </Grid>

          {/* Navigation Links */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              روابط مهمة
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link href="/" underline="hover">الرئيسية</Link></li>
              <li><Link href="/sections" underline="hover">الأقسام</Link></li>
              <li><Link href="/programs" underline="hover">الدورات</Link></li>
              <li><Link href="/news" underline="hover">أخبارنا</Link></li>
              <li><Link href="/contact" underline="hover">تواصل معنا</Link></li>
            </ul>
          </Grid>

          {/* Contact + Waze */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              تواصل معنا
            </Typography>
            <Typography variant="body2">
              <LocationOn fontSize="small" /> {siteInfo.address}
            </Typography>
            <Typography variant="body2">
              <Phone fontSize="small" /> {siteInfo.phone_number}
            </Typography>
            <Typography variant="body2">
              <Email fontSize="small" /> {siteInfo.email}
            </Typography>

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
          </Grid>

          {/* Newsletter + Social + Volunteer */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              النشرة البريدية
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              اشترك لتصلك أخبار المركز والبرامج الجديدة.
            </Typography>

            <Box
              component="form"
              onSubmit={(e) => e.preventDefault()}
              display="flex"
              gap={1}
              flexDirection="row"
              alignItems="center"
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: sectionColor,
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1.2,
                  '&:hover': {
                    backgroundColor: '#b3470f',
                  },
                }}
              >
                إرسال
              </Button>
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                  direction: 'rtl',
                }}
              />
            </Box>

            {/* Social Icons */}
            <Box mt={3}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                تابعونا
              </Typography>
              {siteInfo.FacebookLink && (
                <IconButton href={siteInfo.FacebookLink} target="_blank" rel="noopener noreferrer">
                  <Facebook />
                </IconButton>
              )}
              {siteInfo.instagramLink && (
                <IconButton href={siteInfo.instagramLink} target="_blank" rel="noopener noreferrer">
                  <Instagram />
                </IconButton>
              )}
              {siteInfo.WhatsAppLink && (
                <IconButton href={siteInfo.WhatsAppLink} target="_blank" rel="noopener noreferrer">
                  <WhatsApp />
                </IconButton>
              )}
            </Box>

            {/* Volunteer Button */}
            <Button
              variant="outlined"
              href="/volunteer"
              sx={{
                mt: 2,
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
