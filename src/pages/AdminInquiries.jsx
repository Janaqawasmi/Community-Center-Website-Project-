import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, TextField, MenuItem,
  CircularProgress, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import MuiAlert from '@mui/material/Alert';
import { db, auth } from '../components/firebase';
import {
  collection, getDocs, deleteDoc, doc, updateDoc, getDoc, serverTimestamp
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';

export default function AdminInquiries() {
  const [user, loading] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [replyFilter, setReplyFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const ADMIN_EMAIL = 'ddwayat95@gmail.com';

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

  const handleReplySave = async (msgId, replyValue) => {
    try {
      if (!msgId || typeof msgId !== 'string') return;
      if (!replyValue.trim()) {
        showSnackbar('⚠️ لا يمكن حفظ رد فارغ', 'warning');
        return;
      }

      const docRef = doc(db, 'contactMessages', msgId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        showSnackbar('❌ المستند غير موجود', 'error');
        return;
      }

      await updateDoc(docRef, {
        reply: replyValue,
        repliedAt: serverTimestamp(),
        repliedBy: user?.email || "unknown"
      });

      const updatedMessages = messages.map((msg) =>
        msg.id === msgId ? { ...msg, reply: replyValue } : msg
      );
      setMessages(updatedMessages);

      showSnackbar('✅ تم حفظ الرد بنجاح');
    } catch (err) {
      console.error('🔥 خطأ في حفظ الرد:', err);
      showSnackbar('❌ فشل في حفظ الرد', 'error');
    }
  };

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

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>جارٍ التحقق من الدخول...</Typography>
      </Box>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box p={4} sx={{ direction: 'rtl' }}>
      <Typography variant="h4" mb={3} color="primary" fontWeight="bold" textAlign="center">
        لوحة إدارة الاستفسارات
      </Typography>

      <Box mb={3} display="flex" gap={2} flexWrap="wrap" justifyContent="center">
        <TextField
          select
          label="فلتر حسب القسم"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          sx={{ minWidth: 220 }}
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
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">الكل</MenuItem>
          <MenuItem value="replied">تم الرد</MenuItem>
          <MenuItem value="unreplied">لم يتم الرد</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>العائلة</TableCell>
              <TableCell>البريد</TableCell>
              <TableCell>الهاتف</TableCell>
              <TableCell>القسم</TableCell>
              <TableCell>الرسالة</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell>الرد</TableCell>
              <TableCell align="center">حفظ</TableCell>
              <TableCell align="center">حذف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMessages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell>{msg.first_name}</TableCell>
                <TableCell>{msg.last_name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>{msg.phone}</TableCell>
                <TableCell>{msg.department}</TableCell>
                <TableCell>{msg.message}</TableCell>
                <TableCell>
                  {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleString() : '—'}
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={msg.reply || ""}
                    onChange={(e) => {
                      const updated = messages.map((m) =>
                        m.id === msg.id ? { ...m, reply: e.target.value } : m
                      );
                      setMessages(updated);
                    }}
                    onKeyDown={(e) => {
                      // ✅ فقط لو ضغط Ctrl + Enter يتم الحفظ
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault();
                        handleReplySave(msg.id, msg.reply || "");
                      } else if (e.key === 'Enter') {
                        // ❌ امنع الحفظ التلقائي بدون Ctrl
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleReplySave(msg.id, msg.reply || "")}
                  >
                    <SaveIcon />
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
                <TableCell colSpan={10} align="center">لا توجد استفسارات</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
