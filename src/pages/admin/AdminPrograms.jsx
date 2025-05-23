// src/pages/admin/AdminPrograms.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../components/firebase';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

export default function AdminPrograms() {
  
  return (
    <AdminDashboardLayout>
      
    </AdminDashboardLayout>
  );
}