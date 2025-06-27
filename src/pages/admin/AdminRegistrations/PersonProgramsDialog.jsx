// PersonProgramsDialog.jsx
// مربع يعرض جميع البرامج/الدورات المرتبطة بشخص معين

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useState } from "react";

export  function PersonProgramsDialog({ open, personName, programs, onClose }) {
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
export  function PersonProgramsViewer({ person, allRegistrations }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [personPrograms, setPersonPrograms] = useState([]);

  const handleOpen = () => {
    const fullName = `${person.FirstName} ${person.lastName}`;
    const filtered = allRegistrations.filter((r) => r.id === person.id);
    setPersonPrograms(filtered);
    setDialogOpen(true);
  };

  return (
    <>
      <Button variant="outlined" size="small" onClick={handleOpen}>
        عرض
      </Button>

      <PersonProgramsDialog
        open={dialogOpen}
        personName={`${person.FirstName} ${person.lastName}`}
        programs={personPrograms}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}