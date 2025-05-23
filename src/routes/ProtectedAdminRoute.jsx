import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      user.getIdTokenResult()
        .then((idTokenResult) => {
          if (idTokenResult.claims.admin) {
            setIsAdmin(true);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
