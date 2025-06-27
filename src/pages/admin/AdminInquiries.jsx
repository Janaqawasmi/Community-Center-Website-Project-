import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Chip,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LinkIcon from "@mui/icons-material/Link";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import MessageIcon from "@mui/icons-material/Message";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MuiAlert from "@mui/material/Alert";
import { db } from "../../components/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import RequireAdmin from "../../components/auth/RequireAdmin";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminInquiries() {
  const textFieldStyle = {
    "& .MuiInputBase-input": {
      textAlign: "right",
      direction: "rtl",
      fontFamily: "Cairo, sans-serif",
    },
    "& .MuiInputLabel-root": {
      left: 0,
      right: "auto",
      transformOrigin: "top left",
      fontFamily: "Cairo, sans-serif",
      fontSize: "0.9rem",
      fontWeight: "bold",
      color: "#666",
    },
    "& label.Mui-focused": {
      color: "#005588",
    },
    mb: 2,
  };

  // States للاستفسارات
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [replyFilter, setReplyFilter] = useState("");
  const [departments, setDepartments] = useState([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    msgId: "",
    replyText: "",
    customerEmail: "",
    customerName: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, inquiryId: "" });

  // State لنافذة تفاصيل الاستفسار
  const [detailsDialog, setDetailsDialog] = useState({
    open: false,
    inquiry: null,
  });

  // States لمعلومات التواصل
  const [contactInfo, setContactInfo] = useState(null);
  const [loadingContactInfo, setLoadingContactInfo] = useState(true);
  const [savingContactInfo, setSavingContactInfo] = useState(false);

  // States عامة
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tabValue, setTabValue] = useState(0);

  // ألوان التصميم
  const primaryColor = "#005588";
  const gradientColor = "linear-gradient(180deg, #00b0f0 0%, #003366 100%)";

  // Validation Schema لمعلومات التواصل
  const contactValidationSchema = Yup.object({
    address: Yup.string().required("العنوان مطلوب"),
    phone_number: Yup.string().required("رقم الهاتف مطلوب"),
    email: Yup.string()
      .email("صيغة البريد الإلكتروني غير صحيحة")
      .required("البريد الإلكتروني مطلوب"),
    working_days: Yup.string().required("أيام العمل مطلوبة"),
    working_hours: Yup.string().required("ساعات العمل مطلوبة"),
    waze_link: Yup.string().url("رابط غير صالح"),
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Functions للاستفسارات
  const fetchMessages = async () => {
    try {
      const snapshot = await getDocs(collection(db, "contactMessages"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const uniqueDepartments = [
        ...new Set(data.map((d) => d.department).filter(Boolean)),
      ];
      setMessages(data);
      setFilteredMessages(data);
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error("خطأ في جلب الاستفسارات:", error);
      showSnackbar("❌ خطأ في جلب الاستفسارات", "error");
    }
  };

  const handleDelete = async (docId) => {
    try {
      if (!docId || typeof docId !== "string") return;

      await deleteDoc(doc(db, "contactMessages", docId));
      const updated = messages.filter((msg) => msg.id !== docId);
      setMessages(updated);
      setFilteredMessages(updated);
      showSnackbar("✅ تم حذف الاستفسار نهائيًا");
    } catch (err) {
      console.error("🔥 خطأ في الحذف:", err);
      showSnackbar("❌ حدث خطأ أثناء الحذف", "error");
    }
  };

  const sendEmailReply = async (
    customerEmail,
    customerName,
    replyText,
    originalMessage
  ) => {
    try {
      const subject = "رد على استفسارك - المركز الجماهيري بيت حنينا";
      const body = `السلام عليكم ورحمة الله وبركاته ${customerName}،\n\nشكراً جزيلاً لتواصلك مع المركز الجماهيري بيت حنينا.\n\n${replyText}\n\nنتطلع دائماً لخدمتك.\n\nمع أطيب التحيات،\nفريق المركز الجماهيري بيت حنينا`;

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        customerEmail
      )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.open(gmailUrl, "_blank");

      console.log("✅ تم فتح Gmail في المتصفح");
      return { success: true };
    } catch (error) {
      console.error("❌ خطأ في فتح Gmail:", error);
      return {
        success: false,
        error: error.message || "خطأ غير معروف",
      };
    }
  };

  const handleSendReply = async (msgId, replyValue) => {
    try {
      if (!msgId || typeof msgId !== "string") return;
      if (!replyValue.trim()) {
        showSnackbar("⚠️ لا يمكن إرسال رد فارغ", "warning");
        return;
      }

      const message = messages.find((m) => m.id === msgId);
      if (!message) {
        showSnackbar("❌ الرسالة غير موجودة", "error");
        return;
      }

      setConfirmDialog({
        open: true,
        msgId,
        replyText: replyValue,
        customerEmail: message.email,
        customerName: `${message.first_name} ${message.last_name}`,
      });
    } catch (err) {
      console.error("🔥 خطأ في معالجة الرد:", err);
      showSnackbar("❌ حدث خطأ", "error");
    }
  };

  const confirmSendReply = async () => {
    const { msgId, replyText, customerEmail, customerName } = confirmDialog;

    try {
      setSendingEmail(true);

      const message = messages.find((m) => m.id === msgId);

      const emailResult = await sendEmailReply(
        customerEmail,
        customerName,
        replyText,
        message.message
      );

      if (emailResult.success) {
        const docRef = doc(db, "contactMessages", msgId);
        await updateDoc(docRef, {
          reply: replyText,
          repliedAt: serverTimestamp(),
          repliedBy: "admin",
          emailSent: true,
          emailSentAt: serverTimestamp(),
        });

        const updatedMessages = messages.map((msg) =>
          msg.id === msgId
            ? {
                ...msg,
                reply: replyText,
                emailSent: true,
              }
            : msg
        );
        setMessages(updatedMessages);

        showSnackbar("✅ تم فتح Gmail - أكمل الإرسال من هناك");
      } else {
        showSnackbar("❌ فشل في فتح Gmail", "error");
      }
    } catch (err) {
      console.error("🔥 خطأ في إعداد الرد:", err);
      showSnackbar("❌ فشل في إعداد الرد", "error");
    } finally {
      setSendingEmail(false);
      setConfirmDialog({
        open: false,
        msgId: "",
        replyText: "",
        customerEmail: "",
        customerName: "",
      });
    }
  };

  const handleFilterChange = () => {
    let updated = [...messages];

    if (departmentFilter) {
      updated = updated.filter((m) => m.department === departmentFilter);
    }

    if (replyFilter === "replied") {
      updated = updated.filter((m) => m.emailSent === true);
    } else if (replyFilter === "unreplied") {
      updated = updated.filter((m) => !m.emailSent);
    }

    setFilteredMessages(updated);
  };

  // فتح نافذة التفاصيل
  const openDetailsDialog = (inquiry) => {
    setDetailsDialog({
      open: true,
      inquiry: inquiry,
    });
  };

  // إغلاق نافذة التفاصيل
  const closeDetailsDialog = () => {
    setDetailsDialog({
      open: false,
      inquiry: null,
    });
  };

  // تحديث الرد في نافذة التفاصيل
  const updateReplyInDialog = (newReply) => {
    const updatedMessages = messages.map((msg) =>
      msg.id === detailsDialog.inquiry.id
        ? { ...msg, reply: newReply }
        : msg
    );
    setMessages(updatedMessages);
    
    setDetailsDialog({
      ...detailsDialog,
      inquiry: { ...detailsDialog.inquiry, reply: newReply }
    });
  };

  // Functions لمعلومات التواصل
  const fetchContactInfo = async () => {
    try {
      setLoadingContactInfo(true);
      const docRef = doc(db, "siteInfo", "9ib8qFqM732MnTlg6YGz");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setContactInfo(docSnap.data());
      } else {
        const defaultInfo = {
          address: "",
          phone_number: "",
          email: "",
          working_days: "",
          working_hours: "",
          waze_link: "",
        };
        setContactInfo(defaultInfo);
      }
    } catch (error) {
      console.error("خطأ في جلب معلومات التواصل:", error);
      showSnackbar("خطأ في جلب البيانات", "error");
    } finally {
      setLoadingContactInfo(false);
    }
  };

  const handleContactInfoSubmit = async (values) => {
    try {
      setSavingContactInfo(true);
      const docRef = doc(db, "siteInfo", "9ib8qFqM732MnTlg6YGz");

      await updateDoc(docRef, {
        ...values,
        updatedAt: serverTimestamp(),
        updatedBy: "admin",
      });

      setContactInfo(values);
      showSnackbar("✅ تم حفظ معلومات التواصل بنجاح");
    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error);
      showSnackbar("❌ حدث خطأ أثناء الحفظ", "error");
    } finally {
      setSavingContactInfo(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchContactInfo();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [departmentFilter, replyFilter, messages]);

  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <Box p={4} sx={{ direction: "rtl", fontFamily: "Cairo, sans-serif" }}>
          {/* Header */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              pt: 1,
              pb: 2,
              mb: 2,
              direction: "rtl",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={500}
              sx={{
                fontFamily: "Cairo, sans-serif",
                fontSize: { xs: "1.8rem", sm: "2.3rem" },
                textAlign: "right",
              }}
            >
              إدارة التواصل والاستفسارات
            </Typography>
          </Box>

          {/* Tabs */}
          <Paper
            elevation={2}
            sx={{ borderRadius: "16px", overflow: "hidden" }}
          >
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  fontFamily: "Cairo, sans-serif",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  py: 2,
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: primaryColor,
                  height: 3,
                },
              }}
            >
              <Tab
                icon={<QuestionAnswerIcon />}
                iconPosition="start"
                label="إدارة الاستفسارات"
                sx={{ color: primaryColor }}
              />
              <Tab
                icon={<SettingsIcon />}
                iconPosition="start"
                label="إعدادات معلومات التواصل"
                sx={{ color: primaryColor }}
              />
            </Tabs>

            {/* Tab 1: إدارة الاستفسارات */}
            <TabPanel value={tabValue} index={0}>
              <Box p={3}>
                {/* Filters */}
                <Box
                  mb={3}
                  display="flex"
                  gap={2}
                  flexWrap="wrap"
                  justifyContent="center"
                >
                  <TextField
                    select
                    label="فلتر حسب القسم"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    sx={{
                      minWidth: 220,
                      "& .MuiInputBase-input": {
                        textAlign: "right",
                        direction: "rtl",
                      },
                    }}
                  >
                    <MenuItem value="">كل الأقسام</MenuItem>
                    {departments.map((dept, index) => (
                      <MenuItem key={index} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="فلتر حسب حالة الرد"
                    value={replyFilter}
                    onChange={(e) => setReplyFilter(e.target.value)}
                    sx={{
                      minWidth: 220,
                      "& .MuiInputBase-input": {
                        textAlign: "right",
                        direction: "rtl",
                      },
                    }}
                  >
                    <MenuItem value="">الكل</MenuItem>
                    <MenuItem value="replied">تم الرد</MenuItem>
                    <MenuItem value="unreplied">لم يتم الرد</MenuItem>
                  </TextField>
                </Box>

                {/* Responsive Table */}
                <TableContainer
                  component={Paper}
                  sx={{ 
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    overflow: "hidden"
                  }}
                >
                  <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                    <TableHead
                      sx={{
                        bgcolor: "#f8fafc",
                        "& .MuiTableCell-head": {
                          fontWeight: "bold",
                          color: "#1e40af",
                          fontFamily: "Cairo, sans-serif",
                          padding: { xs: "8px 4px", sm: "16px" },
                        },
                      }}
                    >
                      <TableRow>
                        <TableCell sx={{ width: { xs: "35%", sm: "25%" } }}>
                          الاسم الكامل
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            width: { xs: "25%", sm: "20%" },
                            display: { xs: 'none', sm: 'table-cell' }
                          }}
                        >
                          القسم
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            width: { xs: "0%", sm: "20%" },
                            display: { xs: 'none', md: 'table-cell' }
                          }}
                        >
                          التاريخ
                        </TableCell>
                        <TableCell 
                          align="center" 
                          sx={{ width: { xs: "30%", sm: "15%" } }}
                        >
                          الحالة
                        </TableCell>
                        <TableCell 
                          align="center" 
                          sx={{ width: { xs: "35%", sm: "20%" } }}
                        >
                          الإجراءات
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredMessages.map((msg) => (
                        <TableRow
                          key={msg.id}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#f8fafc",
                              cursor: "pointer",
                            },
                            backgroundColor: msg.emailSent
                              ? "#f0f9ff"
                              : "inherit",
                          }}
                        >
                          <TableCell 
                            sx={{ 
                              fontFamily: "Cairo, sans-serif",
                              cursor: "pointer",
                              padding: { xs: "8px 4px", sm: "16px" },
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                            onClick={() => openDetailsDialog(msg)}
                          >
                            <Box>
                              <Typography 
                                variant="body2" 
                                fontWeight="bold"
                                sx={{ 
                                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                {`${msg.first_name} ${msg.last_name}`}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  display: { xs: 'block', sm: 'none' },
                                  fontSize: "0.65rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                {msg.department}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              fontFamily: "Cairo, sans-serif",
                              display: { xs: 'none', sm: 'table-cell' },
                              padding: { xs: "8px 4px", sm: "16px" },
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: { xs: "0.75rem", sm: "0.875rem" }
                            }}
                          >
                            {msg.department}
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              fontFamily: "Cairo, sans-serif",
                              display: { xs: 'none', md: 'table-cell' },
                              padding: { xs: "8px 4px", sm: "16px" },
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: { xs: "0.75rem", sm: "0.875rem" }
                            }}
                          >
                            {msg.timestamp?.toDate
                              ? msg.timestamp.toDate().toLocaleDateString("en-US")
                              : "—"}
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{ 
                              padding: { xs: "4px 2px", sm: "16px" }
                            }}
                          >
                            {msg.emailSent ? (
                              <Chip
                                label="تم الرد"
                                color="success"
                                size="small"
                                sx={{ 
                                  fontFamily: "Cairo, sans-serif",
                                  fontSize: { xs: "0.6rem", sm: "0.75rem" },
                                  height: { xs: "20px", sm: "24px" },
                                  "& .MuiChip-label": {
                                    padding: { xs: "0 4px", sm: "0 8px" }
                                  }
                                }}
                              />
                            ) : (
                              <Chip
                                label="في الانتظار"
                                color="warning"
                                size="small"
                                sx={{ 
                                  fontFamily: "Cairo, sans-serif",
                                  fontSize: { xs: "0.6rem", sm: "0.75rem" },
                                  height: { xs: "20px", sm: "24px" },
                                  "& .MuiChip-label": {
                                    padding: { xs: "0 4px", sm: "0 8px" }
                                  }
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{ 
                              padding: { xs: "4px 2px", sm: "16px" }
                            }}
                          >
                            <Stack 
                              direction="row" 
                              spacing={{ xs: 0.5, sm: 1 }} 
                              justifyContent="center"
                            >
                              <IconButton
                                color="primary"
                                onClick={() => openDetailsDialog(msg)}
                                size="small"
                                sx={{ 
                                  padding: { xs: "4px", sm: "8px" },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: { xs: "1rem", sm: "1.25rem" }
                                  }
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => setDeleteDialog({ open: true, inquiryId: msg.id })}
                                size="small"
                                sx={{ 
                                  padding: { xs: "4px", sm: "8px" },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: { xs: "1rem", sm: "1.25rem" }
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredMessages.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="center"
                            sx={{
                              py: 4,
                              fontFamily: "Cairo, sans-serif",
                              color: "#64748b",
                            }}
                          >
                            لا توجد استفسارات
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>

            {/* Tab 2: إعدادات معلومات التواصل */}
            <TabPanel value={tabValue} index={1}>
              <Box p={3}>
                {loadingContactInfo ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="400px"
                  >
                    <CircularProgress size={50} />
                  </Box>
                ) : (
                  contactInfo && (
                    <Formik
                      initialValues={{
                        address: contactInfo.address || "",
                        phone_number: contactInfo.phone_number || "",
                        email: contactInfo.email || "",
                        working_days: contactInfo.working_days || "",
                        working_hours: contactInfo.working_hours || "",
                        waze_link: contactInfo.waze_link || "",
                      }}
                      validationSchema={contactValidationSchema}
                      onSubmit={handleContactInfoSubmit}
                      enableReinitialize
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                      }) => (
                        <Form>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Card
                                elevation={2}
                                sx={{
                                  borderRadius: "16px",
                                  border: `2px solid ${primaryColor}20`,
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                                  },
                                  transition: "all 0.3s ease",
                                }}
                              >
                                <CardContent>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    mb={2}
                                  >
                                    <SettingsIcon
                                      sx={{ color: primaryColor, ml: 1 }}
                                    />
                                    <Typography
                                      variant="h6"
                                      fontWeight="bold"
                                      sx={{ fontFamily: "Cairo, sans-serif" }}
                                    >
                                      جميع معلومات التواصل
                                    </Typography>
                                  </Box>
                                  <Divider sx={{ mb: 3 }} />

                                  <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                      <TextField
                                        fullWidth
                                        label="العنوان"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.address &&
                                          Boolean(errors.address)
                                        }
                                        helperText={
                                          touched.address && errors.address
                                        }
                                        InputLabelProps={{ shrink: true }}
                                        sx={textFieldStyle}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <TextField
                                        fullWidth
                                        label="رابط الواز (اختياري)"
                                        name="waze_link"
                                        value={values.waze_link}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.waze_link &&
                                          Boolean(errors.waze_link)
                                        }
                                        helperText={
                                          touched.waze_link && errors.waze_link
                                        }
                                        InputProps={{
                                          startAdornment: (
                                            <LinkIcon
                                              sx={{
                                                color: primaryColor,
                                                ml: 1,
                                              }}
                                            />
                                          ),
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        sx={textFieldStyle}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <TextField
                                        fullWidth
                                        label="رقم الهاتف"
                                        name="phone_number"
                                        value={values.phone_number}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.phone_number &&
                                          Boolean(errors.phone_number)
                                        }
                                        helperText={
                                          touched.phone_number &&
                                          errors.phone_number
                                        }
                                        InputLabelProps={{ shrink: true }}
                                        sx={textFieldStyle}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <TextField
                                        fullWidth
                                        label="البريد الإلكتروني"
                                        name="email"
                                        type="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.email && Boolean(errors.email)
                                        }
                                        helperText={
                                          touched.email && errors.email
                                        }
                                        InputProps={{
                                          startAdornment: (
                                            <EmailIcon
                                              sx={{
                                                color: primaryColor,
                                                ml: 1,
                                              }}
                                            />
                                          ),
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        sx={textFieldStyle}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <TextField
                                        fullWidth
                                        label="أيام العمل"
                                        name="working_days"
                                        value={values.working_days}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.working_days &&
                                          Boolean(errors.working_days)
                                        }
                                        helperText={
                                          touched.working_days &&
                                          errors.working_days
                                        }
                                        placeholder="مثال: السبت - الخميس"
                                        InputLabelProps={{ shrink: true }}
                                        sx={textFieldStyle}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <TextField
                                        fullWidth
                                        label="ساعات العمل"
                                        name="working_hours"
                                        value={values.working_hours}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.working_hours &&
                                          Boolean(errors.working_hours)
                                        }
                                        helperText={
                                          touched.working_hours &&
                                          errors.working_hours
                                        }
                                        placeholder="مثال: 9:00 - 16:00"
                                        InputLabelProps={{ shrink: true }}
                                        sx={textFieldStyle}
                                      />
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>
                            </Grid>

                            {/* زر الحفظ */}
                            <Grid item xs={12}>
                              <Box textAlign="center" mt={3}>
                                <Button
                                  type="submit"
                                  disabled={savingContactInfo}
                                  sx={{
                                    padding: "12px 40px",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    fontFamily: "Cairo, sans-serif",
                                    color: "#FFFFFF",
                                    background: savingContactInfo
                                      ? "linear-gradient(180deg, #999 0%, #666 100%)"
                                      : gradientColor,
                                    borderRadius: "30px",
                                    transition: "all 0.3s ease-in-out",
                                    boxShadow: savingContactInfo
                                      ? "0 2px 8px rgba(0,0,0,0.1)"
                                      : "0 4px 15px rgba(0, 181, 240, 0.3)",
                                    "&:hover": !savingContactInfo && {
                                      transform: "translateY(-2px)",
                                      background:
                                        "linear-gradient(180deg, #1ac4ff 0%, #004477 100%)",
                                    },
                                    "&:disabled": { cursor: "not-allowed" },
                                  }}
                                >
                                  {savingContactInfo
                                    ? "جاري الحفظ..."
                                    : "حفظ التغييرات"}
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  )
                )}
              </Box>
            </TabPanel>
          </Paper>

          {/* نافذة تفاصيل الاستفسار */}
          <Dialog
            open={detailsDialog.open}
            onClose={closeDetailsDialog}
            maxWidth="sm"
            fullWidth
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: { xs: 0, sm: "12px" },
                fontFamily: "Cairo, sans-serif",
                maxHeight: "70vh",
                margin: { xs: 0, sm: "24px" },
                width: { xs: "100%", sm: "500px" },
                maxWidth: { xs: "100%", sm: "500px" },
              },
            }}
          >
            <DialogTitle
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: primaryColor,
                fontFamily: "Cairo, sans-serif",
                borderBottom: "1px solid #e2e8f0",
                p: 1.5,
                fontSize: "1rem",
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <QuestionAnswerIcon sx={{ fontSize: "1.2rem" }} />
                تفاصيل الاستفسار
              </Box>
            </DialogTitle>
            <DialogContent sx={{ direction: "rtl", fontFamily: "Cairo, sans-serif", p: 1.5 }}>
              {detailsDialog.inquiry && (
                <Card elevation={1} sx={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Grid container spacing={1}>
                      {/* الاسم واسم العائلة */}
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          الاسم
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.8rem" }}>
                          {detailsDialog.inquiry.first_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          اسم العائلة
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.8rem" }}>
                          {detailsDialog.inquiry.last_name}
                        </Typography>
                      </Grid>
                      
                      {/* تاريخ الإرسال */}
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          تاريخ الإرسال
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.8rem" }}>
                          {detailsDialog.inquiry.timestamp?.toDate
                            ? detailsDialog.inquiry.timestamp.toDate().toLocaleString("en-US")
                            : "غير محدد"}
                        </Typography>
                      </Grid>
                      
                      {/* نص الاستفسار */}
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "block", mb: 0.3 }}>
                          نص الاستفسار
                        </Typography>
                        <Box
                          sx={{
                            p: 1,
                            bgcolor: "#f8fafc",
                            borderRadius: 1,
                            border: "1px solid #e2e8f0",
                            minHeight: "40px",
                            maxHeight: "80px",
                            overflow: "auto",
                          }}
                        >
                          <Typography variant="body2" sx={{ lineHeight: 1.4, fontSize: "0.8rem" }}>
                            {detailsDialog.inquiry.message}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* الرد على الاستفسار */}
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "block", mb: 0.3 }}>
                          الرد على الاستفسار
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          value={detailsDialog.inquiry.reply || ""}
                          onChange={(e) => updateReplyInDialog(e.target.value)}
                          placeholder="اكتب ردك هنا..."
                          disabled={detailsDialog.inquiry.emailSent}
                          sx={{
                            "& .MuiInputBase-input": {
                              textAlign: "right",
                              direction: "rtl",
                              fontFamily: "Cairo, sans-serif",
                              fontSize: "0.8rem",
                              padding: "8px",
                            },
                            "& .MuiOutlinedInput-root": {
                              minHeight: "60px",
                            },
                            mb: 0.5,
                          }}
                        />
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box>
                            {detailsDialog.inquiry.emailSent ? (
                              <Chip
                                label="تم إرسال الرد"
                                color="success"
                                size="small"
                                sx={{ 
                                  fontFamily: "Cairo, sans-serif", 
                                  fontSize: "0.65rem",
                                  height: "22px",
                                }}
                              />
                            ) : (
                              <Chip
                                label="في انتظار الرد"
                                color="warning"
                                size="small"
                                sx={{ 
                                  fontFamily: "Cairo, sans-serif", 
                                  fontSize: "0.65rem",
                                  height: "22px",
                                }}
                              />
                            )}
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleSendReply(detailsDialog.inquiry.id, detailsDialog.inquiry.reply || "")
                            }
                            disabled={
                              !detailsDialog.inquiry.reply?.trim() ||
                              detailsDialog.inquiry.emailSent ||
                              sendingEmail
                            }
                            sx={{
                              background: primaryColor,
                              fontFamily: "Cairo, sans-serif",
                              fontSize: "0.7rem",
                              py: 0.5,
                              px: 1.5,
                              minWidth: "80px",
                              height: "28px",
                              "&:hover": {
                                background: "#004477",
                              },
                            }}
                          >
                            {sendingEmail ? "إرسال..." : "إرسال"}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </DialogContent>
            <DialogActions sx={{ padding: "8px 16px", borderTop: "1px solid #e2e8f0" }}>
              <Button
                onClick={closeDetailsDialog}
                sx={{ fontFamily: "Cairo, sans-serif", fontSize: "0.8rem" }}
              >
                إغلاق
              </Button>
              <Button
                color="error"
                size="small"
                onClick={() => {
                  closeDetailsDialog();
                  setDeleteDialog({ open: true, inquiryId: detailsDialog.inquiry?.id });
                }}
                startIcon={<DeleteIcon sx={{ fontSize: "0.9rem" }} />}
                sx={{ fontFamily: "Cairo, sans-serif", fontSize: "0.8rem" }}
              >
                حذف
              </Button>
            </DialogActions>
          </Dialog>

          {/* نافذة تأكيد الإرسال */}
          <Dialog
            open={confirmDialog.open}
            onClose={() =>
              !sendingEmail &&
              setConfirmDialog({ ...confirmDialog, open: false })
            }
            maxWidth="sm"
            fullWidth
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "16px",
                fontFamily: "Cairo, sans-serif",
              },
            }}
          >
            <DialogTitle
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#1e40af",
                fontFamily: "Cairo, sans-serif",
              }}
            >
              تأكيد إرسال الرد عبر Gmail
            </DialogTitle>
            <DialogContent
              sx={{ direction: "rtl", fontFamily: "Cairo, sans-serif" }}
            >
              <Typography variant="body1" mb={2}>
                سيتم فتح Gmail لإرسال هذا الرد إلى:
              </Typography>
              <Typography variant="body2" color="primary" mb={1}>
                <strong>الاسم:</strong> {confirmDialog.customerName}
              </Typography>
              <Typography variant="body2" color="primary" mb={2}>
                <strong>البريد:</strong> {confirmDialog.customerEmail}
              </Typography>
              <Typography variant="body2" mb={1}>
                <strong>الرد:</strong>
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography variant="body2">
                  {confirmDialog.replyText}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                mt={2}
                display="block"
              >
                ملاحظة: سيتم فتح Gmail في نافذة جديدة مع البيانات معبأة مسبقاً
              </Typography>
            </DialogContent>
            <DialogActions sx={{ padding: "16px 24px" }}>
              <Button
                onClick={() =>
                  setConfirmDialog({ ...confirmDialog, open: false })
                }
                disabled={sendingEmail}
                sx={{ fontFamily: "Cairo, sans-serif" }}
              >
                إلغاء
              </Button>
              <Button
                onClick={confirmSendReply}
                variant="contained"
                disabled={sendingEmail}
                sx={{
                  background: "#2563eb",
                  fontFamily: "Cairo, sans-serif",
                }}
              >
                {sendingEmail ? "جاري التحضير..." : "فتح Gmail"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar للتنبيهات */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <MuiAlert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%", fontFamily: "Cairo, sans-serif" }}
              elevation={6}
              variant="filled"
            >
              {snackbar.message}
            </MuiAlert>
          </Snackbar>

          {/* نافذة تأكيد الحذف */}
          <ConfirmDeleteDialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, inquiryId: "" })}
            onConfirm={async () => {
              await handleDelete(deleteDialog.inquiryId);
              setDeleteDialog({ open: false, inquiryId: "" });
            }}
            message="هل أنت متأكد أنك تريد حذف هذا الاستفسار؟"
          />
        </Box>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}