import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Box, Typography } from '@mui/material';

export default function RequireAdmin({ children }) {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
              console.log("Current user UID:", user.uid);
        // Check if the user is an admin
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          setIsAdmin(true);
        }
      }
      setChecking(false);
    };
    if (user) checkAdmin();
    else setChecking(false);
  }, [user]);

  if (loading || checking) {
    return <Typography>جار التحقق من الوصول...</Typography>;
  }

  if (!user || !isAdmin) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="error">
          ❌ لا تملك صلاحية الوصول إلى صفحة المسؤول
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
