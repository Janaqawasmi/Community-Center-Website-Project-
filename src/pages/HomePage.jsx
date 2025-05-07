import React from "react";
import EventCalendar from '../components/EventCalendar';

import { AppBar, Toolbar, Typography, Button, Grid, Card, CardContent, CardMedia, Container, TextField, Box } from "@mui/material";

export default function HomePage() {
  return (
    <>
      {/* شريط التنقل */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            المركز الجماهيري بيت حنينا
          </Typography>
          <Button color="inherit">الرئيسية</Button>
          <Button color="inherit">البرامج</Button>
          <Button color="inherit">الفعاليات</Button>
          <Button color="inherit">من نحن</Button>
        </Toolbar>
      </AppBar>

      {/* قسم الترحيب */}
      <Box
        sx={{
          height: { xs: "300px", md: "450px" },
          backgroundImage: `url('/your-hero-image.jpg')`, // استبدلها بالصورة الحقيقية
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          مرحباً بكم في المركز الجماهيري بيت حنينا
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          نربط مجتمعنا من خلال البرامج والفعاليات
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 4 }}>
          عرض البرامج
        </Button>
      </Box>

      {/* قسم من نحن */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>من نحن</Typography>
        <Typography variant="body1" color="text.secondary">
          المركز الجماهيري بيت حنينا يربط المجتمع من خلال البرامج والفعاليات المختلفة.
        </Typography>
      </Container>

      {/* قسم البرامج */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>برامجنا</Typography>
        <Grid container spacing={4}>
          {["تعليم", "ترفيه", "ورشات عمل"].map((program, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  image={`/program${index + 1}.jpg`} // استبدلها بالصور الحقيقية
                  alt={program}
                  height="200"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {program}
                  </Typography>
                  <Typography>
                    وصف قصير عن هذا البرنامج.
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    اعرف المزيد
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* قسم الفعاليات القادمة */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>الفعاليات القادمة</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">فعالية مجتمعية</Typography>
            <Typography variant="subtitle1">10 يونيو</Typography>
            <Typography variant="body2">2:00 مساءً - 4:00 مساءً</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">درس فنون</Typography>
            <Typography variant="subtitle1">5 يوليو الساعة 11 صباحًا</Typography>
            <Typography variant="body2">انضم إلى درس الفنون...</Typography>
            <Button variant="contained" color="primary" sx={{ mt: 1 }}>
              سجل الآن
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* 🗓️ قسم لائحة الفعاليات */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>لائحة الفعاليات</Typography>
        <EventCalendar />
      </Container>

      {/* قسم تواصل معنا */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>تواصل معنا</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">العنوان</Typography>
            <Typography>2186 شارع فارنونغا، جينيريستي، الرمز البريدي 18344</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>الهاتف</Typography>
            <Typography>(360) 122-488788</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>البريد الإلكتروني</Typography>
            <Typography>co-ta@beithanina.cov</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box component="form" noValidate autoComplete="off">
              <TextField fullWidth label="الاسم" margin="normal" />
              <TextField fullWidth label="البريد الإلكتروني" margin="normal" />
              <TextField fullWidth label="الرسالة" multiline rows={4} margin="normal" />
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                إرسال
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
