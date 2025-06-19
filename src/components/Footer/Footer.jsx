import { Box, Container, Typography, Grid, Link, IconButton, Button } from '@mui/material';
import { Facebook, Instagram, WhatsApp, Email, LocationOn, Phone } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";
import defaultLogo from '../../assets/logo.png';
import wazeIcon from '../../assets/waze2.png';
import NavButton from '../NavButton';

export default function Footer() {
  const sectionColor = '#D05F14';
  const [siteInfo, setSiteInfo] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const docRef = doc(db, 'siteInfo', '9ib8qFqM732MnTlg6YGz');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
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
        backgroundColor: '#ffffff',
        borderTop: '6px solid #003366',
        mt: 8,
        pt: 6,
        pb: 3,
        direction: 'rtl',
        position: 'relative' // ✅ important

      }}
    >
      <Container maxWidth="lg">
     <Grid 
  container 
  spacing={5} // 👈 increase this to add more horizontal space
  sx={{
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  }}
>

          {/* Logo & Slogan Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                height: '100%',
              }}
            >
              {/* Logo and Title */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
             <img
  src={siteInfo.logo_url || defaultLogo}
  alt="شعار المركز"
  style={{ 
    width: 130,                    // ⬅️ Bigger logo
    maxWidth: '100%', 
    marginBottom: 12,
    display: 'block',
    marginLeft: 'auto',            // ⬅️ Center horizontally
    marginRight: 'auto'
  }}
/>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="#003366"
                  sx={{ mb: 1, lineHeight: 1.8 }}
                >
                  المركز الجماهيري بيت حنينا
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ lineHeight: 1.4 }}
                >
                  {siteInfo.slogan || 'معًا نبني مجتمعًا متماسكًا وداعمًا للجميع 🧡'}
                </Typography>
              </Box>

              {/* Volunteer Button */}
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

          {/* Dynamic Sections Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ height: '100%', textAlign: 'right' }}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color="#003366"
                sx={{ mb: 2, borderBottom: '2px solid #f0f0f0', pb: 1, textAlign: 'right' }}
              >
                الأقسام
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'right' }}>
                {sections.map(sec => (
                  <Box 
                    component="li" 
                    key={sec.id}
                    sx={{ mb: 0.3, textAlign: 'right' }}
                  >
                    <Link 
                      href={`/sections/${sec.id}`} 
                      underline="hover" 
                      sx={{ 
                        color: '#666',
                        fontSize: '0.9rem',
                        transition: 'color 0.2s ease',
                        lineHeight: 1.2,
                        '&:hover': {
                          color: sectionColor,
                        }
                      }}
                    >
                      {sec.title}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Important Links Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ height: '100%', textAlign: 'right' }}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color="#003366"
                sx={{ mb: 2, borderBottom: '2px solid #f0f0f0', pb: 1, textAlign: 'right' }}
              >
                روابط مهمة
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', padding: 0, margin: 0, mb: 4, textAlign: 'right' }}>
                {[
                  { text: 'الرئيسية', href: '/' },
                  { text: 'الدورات', href: '/programs' },
                  { text: 'أخبارنا', href: '/news' },
                  { text: 'تواصل معنا', href: '/contact' }
                ].map((link, index) => (
                  <Box 
                    component="li" 
                    key={index}
                    sx={{ mb: 0.3, textAlign: 'right' }}
                  >
                    <Link 
                      href={link.href} 
                      underline="hover" 
                      sx={{ 
                        color: '#666',
                        fontSize: '0.9rem',
                        transition: 'color 0.2s ease',
                        lineHeight: 1.2,
                        '&:hover': {
                          color: sectionColor,
                        }
                      }}
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>

              {/* Social Media Section */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography 
  variant="h6" 
  fontWeight="bold" 
  color="#003366"
  sx={{ mb: 2.5, mt: 2, textAlign: 'right' }} // 👈 move up with mt
>
  تابعونا
</Typography>

                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-start', 
                    alignItems: 'center', 
                    gap: 1
                  }}
                >
                  {siteInfo.FacebookLink && (
                    <IconButton
                      href={siteInfo.FacebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: '#1877f2',
                        backgroundColor: '#f8f9fa',
                        '&:hover': {
                          backgroundColor: '#1877f2',
                          color: '#fff',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Facebook />
                    </IconButton>
                  )}
                  {siteInfo.instagramLink && (
                    <IconButton
                      href={siteInfo.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: '#e4405f',
                        backgroundColor: '#f8f9fa',
                        '&:hover': {
                          backgroundColor: '#e4405f',
                          color: '#fff',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Instagram />
                    </IconButton>
                  )}
                  {siteInfo.WhatsAppLink && (
                    <IconButton
                      href={siteInfo.WhatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: '#25d366',
                        backgroundColor: '#f8f9fa',
                        '&:hover': {
                          backgroundColor: '#25d366',
                          color: '#fff',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                        width: 40,
                        height: 40,
                      }}
                    >
                      <WhatsApp />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Contact Info Column */}
          <Grid item xs={12} sm={6} md={5}>
            <Box sx={{ height: '100%' }}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color="#003366"
                sx={{ mb: 2, borderBottom: '2px solid #f0f0f0', pb: 1 }}
              >
                تواصل معنا
              </Typography>
              
              {/* Contact Information */}
<Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {/* Address with Waze */}
             <Box 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1.2, 
  }}
>
  <LocationOn 
    fontSize="small" 
    sx={{ color: '#003366', mt: 0.2, flexShrink: 0 }} 
  />
  
  {/* Address + Waze grouped together */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography 
      variant="body2" 
      sx={{ lineHeight: 1.4 }}
    >
      {siteInfo.address}
    </Typography>
    {siteInfo.waze_link && (
      <IconButton
        href={siteInfo.waze_link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ 
          p: 0.1,
          flexShrink: 0,
          '&:hover': {
            transform: 'scale(1.1)',
          },
          transition: 'transform 0.2s ease',
        }}
      >
        <img
          src={wazeIcon}
          alt="Waze"
          width="40"
          height="40"
          style={{ display: 'block' }}
        />
      </IconButton>
    )}
  </Box>
</Box>


                {/* Phone */}
              <Box 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1.5, 
    mb: 2 
  }}
>

                  <Phone 
                    fontSize="small" 
                    sx={{ color: '#003366', flexShrink: 0 }} 
                  />
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    {siteInfo.phone_number}
                  </Typography>
                </Box>

                {/* Email */}
             <Box 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1.5, 
    mb: 2 
  }}
>

                  <Email 
                    fontSize="small" 
                    sx={{ color: '#003366', flexShrink: 0 }} 
                  />
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    {siteInfo.email}
                  </Typography>
                </Box>
              </Box>

<Box>
<Typography 
  variant="subtitle2"
  fontWeight="bold" 
  color="#003366"
  sx={{ mt: 2.5, mb: -0.1 }} // 👈 shift up and give more space below
>
  ساعات استقبال المركز والرد الهاتفي
</Typography>


  <Box 
    component="ul" 
    sx={{ 
      listStyle: 'none', 
      padding: 0, 
      margin: 0,
      backgroundColor: 'white',
      borderRadius: 2,
      p: 2
    }}
  >
    {[
      { day: 'الأحد – الخميس', hours: '9:00 - 17:00' },
      { day: 'الجمعة', hours: 'مغلق' },
      { day: 'السبت', hours: '9:00 - 17:00' }
    ].map((schedule, index) => (
      <Box 
        component="li" 
        key={index}
        sx={{ 
          mb: index < 2 ? 1 : 0,
          display: 'flex',
          justifyContent: 'flex-start', // align to right side
          alignItems: 'center',
          gap: 1.5, // small gap between day and hours
          fontSize: '0.85rem'
        }}
      >
        <Typography 
          variant="body2" 
          fontWeight="bold"
          sx={{ color: '#003366', minWidth: '100px' }}
        >
          {schedule.day}:
        </Typography>
        <Typography 
          variant="body2"
          sx={{ 
            color: schedule.hours === 'مغلق' ? '#d32f2f' : '#2e7d32',
            fontWeight: 500
          }}
        >
          {schedule.hours}
        </Typography>
      </Box>
    ))}
  </Box>
</Box>

            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
<Box 
  sx={{ 
    borderTop: '1px solid #e0e0e0',
    pt: 1, 
    mt: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}
>
  <Typography 
    variant="body2" 
    sx={{ 
      color: '#888',
      fontSize: '0.85rem'
    }}
  >
    جميع الحقوق محفوظة © {new Date().getFullYear()} المركز الجماهيري بيت حنينا
  </Typography>

  <NavButton
    to="/login"
    sx={{
      fontSize: '12px',
      color: '#666',
      textTransform: 'uppercase',
      '&:hover': {
        color: '#003366',
        textDecoration: 'underline'
      }
    }}
  >
    تسجيل دخول للإدارة فقط
  </NavButton>
</Box>

        
      </Container>
      
    </Box>
  );
}

