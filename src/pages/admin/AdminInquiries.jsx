import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, TextField, MenuItem,
  CircularProgress, Snackbar, Dialog, DialogTitle, DialogContent, 
  DialogActions, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import MuiAlert from '@mui/material/Alert';
import { db } from '../../components/firebase';
import {
  collection, getDocs, deleteDoc, doc, updateDoc, getDoc, serverTimestamp
} from 'firebase/firestore';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import RequireAdmin from '../../components/auth/RequireAdmin';

export default function AdminInquiries() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [replyFilter, setReplyFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, msgId: '', replyText: '', customerEmail: '', customerName: '' });

  const fetchMessages = async () => {
    const snapshot = await getDocs(collection(db, 'contactMessages'));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const uniqueDepartments = [...new Set(data.map(d => d.department).filter(Boolean))];
    setMessages(data);
    setFilteredMessages(data);
    setDepartments(uniqueDepartments);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDelete = async (docId) => {
    try {
      if (!docId || typeof docId !== 'string') return;

      await deleteDoc(doc(db, 'contactMessages', docId));
      const updated = messages.filter((msg) => msg.id !== docId);
      setMessages(updated);
      setFilteredMessages(updated);
      showSnackbar('✅ تم حذف الاستفسار نهائيًا');
    } catch (err) {
      console.error('🔥 خطأ في الحذف:', err);
      showSnackbar('❌ حدث خطأ أثناء الحذف', 'error');
    }
  };

  // دالة إرسال البريد الإلكتروني المؤقتة (mailto)
  const sendEmailReply = async (customerEmail, customerName, replyText, originalMessage) => {
    try {
      const subject = 'رد على استفسارك - المركز المجتمعي';
      const body = `السلام عليكم ورحمة الله وبركاته ${customerName}،

شكراً جزيلاً لتواصلك مع المركز المجتمعي.

استفسارك الأصلي:
"${originalMessage}"

ردنا عليك:
${replyText}

نتطلع دائماً لخدمتك.

مع أطيب التحيات،
فريق المركز المجتمعي`;

      // فتح تطبيق البريد للإرسال (في نفس النافذة)
      window.location.href = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      console.log('✅ تم فتح تطبيق البريد');
      return { success: true };

    } catch (error) {
      console.error('❌ خطأ في فتح البريد:', error);
      return { 
        success: false, 
        error: error.message || 'خطأ غير معروف' 
      };
    }
  };

  const handleSendReply = async (msgId, replyValue) => {
    try {
      if (!msgId || typeof msgId !== 'string') return;
      if (!replyValue.trim()) {
        showSnackbar('⚠️ لا يمكن إرسال رد فارغ', 'warning');
        return;
      }

      const message = messages.find(m => m.id === msgId);
      if (!message) {
        showSnackbar('❌ الرسالة غير موجودة', 'error');
        return;
      }

      // فتح نافذة التأكيد
      setConfirmDialog({
        open: true,
        msgId,
        replyText: replyValue,
        customerEmail: message.email,
        customerName: `${message.first_name} ${message.last_name}`
      });
    } catch (err) {
      console.error('🔥 خطأ في معالجة الرد:', err);
      showSnackbar('❌ حدث خطأ', 'error');
    }
  };

  const confirmSendReply = async () => {
    const { msgId, replyText, customerEmail, customerName } = confirmDialog;
    
    try {
      setSendingEmail(true);
      
      const message = messages.find(m => m.id === msgId);
      
      // إرسال البريد الإلكتروني
      const emailResult = await sendEmailReply(
        customerEmail, 
        customerName, 
        replyText, 
        message.message
      );

      if (emailResult.success) {
        // تحديث قاعدة البيانات بتسجيل أن الرد تم إرساله
        const docRef = doc(db, 'contactMessages', msgId);
        await updateDoc(docRef, {
          reply: replyText,
          repliedAt: serverTimestamp(),
          repliedBy: 'admin',
          emailSent: true,
          emailSentAt: serverTimestamp()
        });

        // تحديث الحالة المحلية
        const updatedMessages = messages.map((msg) =>
          msg.id === msgId ? { 
            ...msg, 
            reply: replyText, 
            emailSent: true 
          } : msg
        );
        setMessages(updatedMessages);

        showSnackbar('✅ تم إرسال الرد بنجاح عبر البريد الإلكتروني');
      } else {
        showSnackbar('❌ فشل في إرسال البريد الإلكتروني', 'error');
        console.error('EmailJS Error:', emailResult.error);
      }
    } catch (err) {
      console.error('🔥 خطأ في إرسال الرد:', err);
      showSnackbar('❌ فشل في إرسال الرد', 'error');
    } finally {
      setSendingEmail(false);
      setConfirmDialog({ open: false, msgId: '', replyText: '', customerEmail: '', customerName: '' });
    }
  };

  // دالة اختبار (معطلة مؤقتاً)
  // const testEmailService = async () => {
  //   console.log('اختبار البريد معطل مؤقتاً');
  //   return true;
  // };

  const handleFilterChange = () => {
    let updated = [...messages];

    if (departmentFilter) {
      updated = updated.filter(m => m.department === departmentFilter);
    }

    if (replyFilter === 'replied') {
      updated = updated.filter(m => m.reply?.trim());
    } else if (replyFilter === 'unreplied') {
      updated = updated.filter(m => !m.reply?.trim());
    }

    setFilteredMessages(updated);
  };

  useEffect(() => {
    handleFilterChange();
  }, [departmentFilter, replyFilter, messages]);

  return (
    <RequireAdmin>
      <AdminDashboardLayout>
        <Box p={4} sx={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
          <Typography variant="h4" mb={3} color="primary" fontWeight="bold" textAlign="center">
            لوحة إدارة الاستفسارات
          </Typography>

          <Box mb={3} display="flex" gap={2} flexWrap="wrap" justifyContent="center">
            <TextField
              select
              label="فلتر حسب القسم"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              sx={{ 
                minWidth: 220,
                '& .MuiInputBase-input': {
                  textAlign: 'right',
                  direction: 'rtl'
                }
              }}
            >
              <MenuItem value="">كل الأقسام</MenuItem>
              {departments.map((dept, index) => (
                <MenuItem key={index} value={dept}>{dept}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="فلتر حسب حالة الرد"
              value={replyFilter}
              onChange={(e) => setReplyFilter(e.target.value)}
              sx={{ 
                minWidth: 220,
                '& .MuiInputBase-input': {
                  textAlign: 'right',
                  direction: 'rtl'
                }
              }}
            >
              <MenuItem value="">الكل</MenuItem>
              <MenuItem value="replied">تم الرد</MenuItem>
              <MenuItem value="unreplied">لم يتم الرد</MenuItem>
            </TextField>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead sx={{ 
                bgcolor: '#f8fafc',
                '& .MuiTableCell-head': {
                  fontWeight: 'bold',
                  color: '#1e40af',
                  fontFamily: 'Cairo, sans-serif'
                }
              }}>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>العائلة</TableCell>
                  <TableCell>البريد</TableCell>
                  <TableCell>الهاتف</TableCell>
                  <TableCell>القسم</TableCell>
                  <TableCell>الرسالة</TableCell>
                  <TableCell>التاريخ</TableCell>
                  <TableCell>الرد</TableCell>
                  <TableCell align="center">الحالة</TableCell>
                  <TableCell align="center">إرسال</TableCell>
                  <TableCell align="center">حذف</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMessages.map((msg) => (
                  <TableRow 
                    key={msg.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f8fafc'
                      },
                      backgroundColor: msg.emailSent ? '#f0f9ff' : 'inherit'
                    }}
                  >
                    <TableCell sx={{ fontFamily: 'Cairo, sans-serif' }}>{msg.first_name}</TableCell>
                    <TableCell sx={{ fontFamily: 'Cairo, sans-serif' }}>{msg.last_name}</TableCell>
                    <TableCell sx={{ fontFamily: 'Cairo, sans-serif' }}>{msg.email}</TableCell>
                    <TableCell sx={{ fontFamily: 'Cairo, sans-serif' }}>{msg.phone}</TableCell>
                    <TableCell sx={{ fontFamily: 'Cairo, sans-serif' }}>{msg.department}</TableCell>
                    <TableCell sx={{ 
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontFamily: 'Cairo, sans-serif'
                    }}>
                      {msg.message}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Cairo, sans-serif' }}>
                      {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleString('ar-EG') : '—'}
                    </TableCell>
                    <TableCell sx={{ minWidth: '200px' }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        value={msg.reply || ""}
                        onChange={(e) => {
                          const updated = messages.map((m) =>
                            m.id === msg.id ? { ...m, reply: e.target.value } : m
                          );
                          setMessages(updated);
                        }}
                        placeholder="اكتب ردك هنا..."
                        disabled={msg.emailSent}
                        sx={{
                          '& .MuiInputBase-input': {
                            textAlign: 'right',
                            direction: 'rtl',
                            fontFamily: 'Cairo, sans-serif'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {msg.emailSent ? (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: 1,
                          color: '#16a34a'
                        }}>
                          <EmailIcon fontSize="small" />
                          <Typography variant="caption" sx={{ fontFamily: 'Cairo, sans-serif' }}>
                            تم الإرسال
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Cairo, sans-serif' }}>
                          في الانتظار
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleSendReply(msg.id, msg.reply || "")}
                        disabled={!msg.reply?.trim() || msg.emailSent || sendingEmail}
                        sx={{
                          '&:disabled': {
                            color: '#94a3b8'
                          }
                        }}
                      >
                        {sendingEmail ? <CircularProgress size={20} /> : <SendIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(msg.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMessages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ 
                      py: 4,
                      fontFamily: 'Cairo, sans-serif',
                      color: '#64748b'
                    }}>
                      لا توجد استفسارات
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* نافذة تأكيد الإرسال */}
          <Dialog 
            open={confirmDialog.open} 
            onClose={() => !sendingEmail && setConfirmDialog({ ...confirmDialog, open: false })}
            maxWidth="sm"
            fullWidth
            sx={{
              '& .MuiDialog-paper': {
                borderRadius: '16px',
                fontFamily: 'Cairo, sans-serif'
              }
            }}
          >
            <DialogTitle sx={{ 
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#1e40af',
              fontFamily: 'Cairo, sans-serif'
            }}>
              تأكيد إرسال الرد
            </DialogTitle>
            <DialogContent sx={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
              <Typography variant="body1" mb={2}>
                هل أنت متأكد من إرسال هذا الرد إلى:
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
              <Box sx={{ 
                p: 2, 
                bgcolor: '#f8fafc', 
                borderRadius: 2,
                border: '1px solid #e2e8f0'
              }}>
                <Typography variant="body2">
                  {confirmDialog.replyText}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px' }}>
              <Button 
                onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
                disabled={sendingEmail}
                sx={{ fontFamily: 'Cairo, sans-serif' }}
              >
                إلغاء
              </Button>
              <Button 
                onClick={confirmSendReply}
                variant="contained"
                disabled={sendingEmail}
                startIcon={sendingEmail ? <CircularProgress size={16} /> : <SendIcon />}
                sx={{ 
                  background: '#2563eb',
                  fontFamily: 'Cairo, sans-serif'
                }}
              >
                {sendingEmail ? 'جاري الإرسال...' : 'إرسال الرد'}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <MuiAlert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: '100%', fontFamily: 'Cairo, sans-serif' }}
              elevation={6}
              variant="filled"
            >
              {snackbar.message}
            </MuiAlert>
          </Snackbar>
        </Box>
      </AdminDashboardLayout>
    </RequireAdmin>
  );
}