// PersonProgramsDialog.jsx
// مربع يعرض جميع البرامج/الدورات المرتبطة بشخص معين

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default function PersonProgramsDialog({ open, personName, programs, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>كل البرامج لـ {personName}</DialogTitle>
      <DialogContent>
        {programs.length === 0 ? (
          <Typography>لا يوجد تسجيلات.</Typography>
        ) : (
          <ul>
            {programs.map((r, i) => (
              <li key={i}>{r.name} (חוג: {r.classNumber}، קבוצה: {r.groupNumber})</li>
            ))}
          </ul>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إغلاق</Button>
      </DialogActions>
    </Dialog>
  );
}
