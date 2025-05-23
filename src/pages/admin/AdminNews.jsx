// src/pages/admin/AdminNews.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from '@mui/material';
import { db } from '../../components/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

export default function AdminNews() {
  

  return (
    <AdminDashboardLayout>
   
    </AdminDashboardLayout>
  );
}
