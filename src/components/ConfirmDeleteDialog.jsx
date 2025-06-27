import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default function ConfirmDeleteDialog({ open, onClose, onConfirm, message = "هل أنت متأكد أنك تريد الحذف؟" }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>⚠️ تأكيد الحذف</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
        >
          نعم، احذف
        </Button>
      </DialogActions>
    </Dialog>
  );
}
