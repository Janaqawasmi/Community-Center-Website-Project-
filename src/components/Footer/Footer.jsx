import { Box, Container, Typography, Grid, Link, IconButton, Button } from '@mui/material';
import { Facebook, Instagram, WhatsApp, Email, LocationOn, Phone } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";
import defaultLogo from '../../assets/logo.png';
import wazeIcon from '../../assets/waze2.png';
import NavButton from '../layout/Buttons/NavButton';

export default function Footer() {
  const sectionColor = '#D05F14';
  const [siteInfo, setSiteInfo] = useState(null);
  const [sections, setSections] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const footerRef = useRef(null);
const [showMiniFooter, setShowMiniFooter] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.offsetHeight;
    setShowMiniFooter(scrollPosition >= pageHeight - 50); // when near bottom
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const docRef = doc(db, 'siteInfo', '9ib8qFqM732MnTlg6YGz');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSiteInfo(docSnap.data());
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

  useEffect(() => {
    if (isExpanded && footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isExpanded]);

  if (!siteInfo) {
    return (
      <Box sx={{ backgroundColor: '#eeeeee', p: 4, textAlign: 'center' }}>
        <Typography>...جاري تحميل معلومات التذييل</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Collapsed Footer Bar */}
      {!isExpanded && (
        <Box
          sx={{
            backgroundColor: '#ffffff',
            borderTop: '6px solid #003366',
            py: 2,
            px: 3,
            direction: 'rtl',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative', // instead of fixed
            bottom: 'unset' ,// not needed anymore
            width: '100%',
            zIndex: 999,
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={siteInfo.logo_url || defaultLogo} alt="Logo" style={{ width: 40 }} />
            <Typography fontWeight="bold" color="#003366" fontSize="1rem">
              المركز الجماهيري بيت حنينا
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" fontWeight="bold">الأقسام</Typography>
            <Typography variant="body2" fontWeight="bold">روابط مهمة</Typography>
            <Typography variant="body2" fontWeight="bold">تواصل معنا</Typography>
          </Box>
          <IconButton onClick={() => setIsExpanded(true)}>
            ⬆️
          </IconButton>
        </Box>
      )}

      {/* Expanded Footer */}
      {isExpanded && (
        <Box
          ref={footerRef}
          sx={{
            backgroundColor: '#ffffff',
            borderTop: '6px solid #003366',
            mt: 8,
            pt: 6,
            pb: 0,
            direction: 'rtl',
            position: 'relative'
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={5} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
              {/* Logo and Slogan */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <img src={siteInfo.logo_url || defaultLogo} alt="Logo" style={{ width: 130, marginBottom: 12 }} />
                    <Typography variant="h5" fontWeight="bold" color="#003366" sx={{ mb: 1 }}>
                      المركز الجماهيري بيت حنينا
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {siteInfo.slogan || 'معًا نبني مجتمعًا متماسكًا وداعمًا للجميع 🧡'}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    href="/volunteer"
                    sx={{
                      borderColor: '#003366',
                      color: '#003366',
                      fontWeight: 'bold',
                      borderRadius: '25px',
                      px: 4,
                      py: 1,
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#003366',
                        color: '#fff',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    🌟 انضم كمتطوع
                  </Button>
                </Box>
              </Grid>

              {/* Sections */}
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="h6" fontWeight="bold" color="#003366" sx={{ mb: 2 }}>
                  الأقسام
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {sections.map(sec => (
                    <Box key={sec.id} component="li" sx={{ mb: 0.3 }}>
                      <Link href={`/sections/${sec.id}`} underline="hover" sx={{ color: '#666', fontSize: '0.9rem', '&:hover': { color: sectionColor } }}>
                        {sec.title}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* Important Links and Social */}
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="h6" fontWeight="bold" color="#003366" sx={{ mb: 2 }}>
                  روابط مهمة
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 4 }}>
                  {[
                    { text: 'الرئيسية', href: '/' },
                    { text: 'الدورات', href: '/programs' },
                    { text: 'أخبارنا', href: '/news' },
                    { text: 'تواصل معنا', href: '/contact' }
                  ].map((link, i) => (
                    <Box key={i} component="li" sx={{ mb: 0.3 }}>
                      <Link href={link.href} underline="hover" sx={{ color: '#666', fontSize: '0.9rem', '&:hover': { color: sectionColor } }}>
                        {link.text}
                      </Link>
                    </Box>
                  ))}
                </Box>
                <Typography variant="h6" fontWeight="bold" color="#003366" sx={{ mb: 2.5 }}>
                  تابعونا
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {siteInfo.FacebookLink && (
                    <IconButton href={siteInfo.FacebookLink} target="_blank" sx={{ color: '#1877f2', backgroundColor: '#f8f9fa', '&:hover': { backgroundColor: '#1877f2', color: '#fff' } }}>
                      <Facebook />
                    </IconButton>
                  )}
                  {siteInfo.instagramLink && (
                    <IconButton href={siteInfo.instagramLink} target="_blank" sx={{ color: '#e4405f', backgroundColor: '#f8f9fa', '&:hover': { backgroundColor: '#e4405f', color: '#fff' } }}>
                      <Instagram />
                    </IconButton>
                  )}
                  {siteInfo.WhatsAppLink && (
                    <IconButton href={siteInfo.WhatsAppLink} target="_blank" sx={{ color: '#25d366', backgroundColor: '#f8f9fa', '&:hover': { backgroundColor: '#25d366', color: '#fff' } }}>
                      <WhatsApp />
                    </IconButton>
                  )}
                </Box>
              </Grid>

              {/* Contact Info */}
              <Grid item xs={12} sm={6} md={5}>
                <Typography variant="h6" fontWeight="bold" color="#003366" sx={{ mb: 2 }}>
                  تواصل معنا
                </Typography>
                <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <LocationOn fontSize="small" sx={{ color: '#003366' }} />
                    <Typography variant="body2">{siteInfo.address}</Typography>
                    {siteInfo.waze_link && (
                      <IconButton href={siteInfo.waze_link} target="_blank" sx={{ p: 0.1 }}>
                        <img src={wazeIcon} alt="Waze" width="40" height="40" />
                      </IconButton>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Phone fontSize="small" sx={{ color: '#003366' }} />
                    <Typography variant="body2">{siteInfo.phone_number}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Email fontSize="small" sx={{ color: '#003366' }} />
                    <Typography variant="body2">{siteInfo.email}</Typography>
                  </Box>
                </Box>

<Typography variant="subtitle2" fontWeight="bold" color="#003366" sx={{ mt: 2.5 }}>
  ساعات استقبال المركز والرد الهاتفي
</Typography>
<Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, backgroundColor: 'white', borderRadius: 2, p: 2 }}>
  {(siteInfo.reception_hours || []).map((s, i) => (
    <Box
      key={i}
      component="li"
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        gap: 1.5,
        fontSize: '0.85rem',
        mb: i < siteInfo.reception_hours.length - 1 ? 1 : 0
      }}
    >
      <Typography variant="body2" fontWeight="bold" sx={{ color: '#003366', minWidth: '100px' }}>{s.day}:</Typography>
      <Typography variant="body2" sx={{ color: s.hours === 'مغلق' ? '#d32f2f' : '#2e7d32', fontWeight: 500 }}>{s.hours}</Typography>
    </Box>
  ))}
</Box>




              </Grid>
              
            </Grid>

            {/* Collapse Button */}
           <Box sx={{ textAlign: 'center', mt: 0, mb: 0 }}>
 <IconButton 
  onClick={() => setIsExpanded(false)}
  sx={{ fontSize: '1.2rem', padding: '4px', mb: 0 }}
>
  ⬇️
</IconButton>

</Box>


            {/* Copyright */}
            <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1, mt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ color: '#888', fontSize: '0.85rem' }}>
                جميع الحقوق محفوظة © {new Date().getFullYear()} المركز الجماهيري بيت حنينا
              </Typography>
              <NavButton to="/login" sx={{ fontSize: '12px', color: '#666', '&:hover': { color: '#003366', textDecoration: 'underline' } }}>
                تسجيل دخول للإدارة فقط
              </NavButton>
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
}
