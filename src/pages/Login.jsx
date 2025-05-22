import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper,
  CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetSent(false);

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('فشل في تسجيل الدخول: تحقق من البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني أولًا");
      return;
    }

    try {
      await sendPasswordResetEmail(getAuth(), email);
      setResetSent(true);
      setError('');
    } catch (err) {
      setError("فشل في إرسال رابط إعادة التعيين");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2} textAlign="center">تسجيل دخول المسؤول</Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth label="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {resetSent && (
            <Alert severity="success" sx={{ mt: 2 }}>
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
            </Alert>
          )}

          <Box textAlign="center" mt={3}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'تسجيل الدخول'}
            </Button>
          </Box>

          <Box textAlign="center" mt={1}>
            <Button
              variant="text"
              size="small"
              onClick={handleResetPassword}
              sx={{ textTransform: 'none', color: '#1976d2' }}
            >
              نسيت كلمة السر؟
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
