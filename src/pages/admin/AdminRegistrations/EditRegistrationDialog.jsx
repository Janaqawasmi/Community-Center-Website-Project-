// EditRegistrationDialog.jsx
// مكون مربع حوار لتعديل بيانات تسجيل (دورة أو فعالية)

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField,Checkbox } from "@mui/material";

export default function EditRegistrationDialog({ open, registration, onChange, onSave, onClose }) {
  // دوال تغيير أي حقل
  const handleChange = (key, value) => {
    onChange({ ...registration, [key]: value });
  };

  if (!registration) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>تعديل بيانات المسجل</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
          {/* جميع الحقول المشتركة */}
          <TextField label="الاسم الشخصي" value={registration.FirstName || ""} onChange={e => handleChange("FirstName", e.target.value)} />
          <TextField label="اسم العائلة" value={registration.lastName || ""} onChange={e => handleChange("lastName", e.target.value)} />
          <TextField label="تاريخ الميلاد" value={registration.birthdate || ""} onChange={e => handleChange("birthdate", e.target.value)} />
          <TextField label="رقم الهوية" value={registration.id || ""} onChange={e => handleChange("id", e.target.value)} />
          <TextField label="رقم التحقق" value={registration.cheackDigit || ""} onChange={e => handleChange("cheackDigit", e.target.value)} />
          <TextField label="الإيميل" value={registration.email || ""} onChange={e => handleChange("email", e.target.value)} />
          <TextField label="رقم الهاتف" value={registration.personalPhone || ""} onChange={e => handleChange("personalPhone", e.target.value)} />
          <TextField label="الجنس" value={registration.gender || ""} onChange={e => handleChange("gender", e.target.value)} />
          <TextField label="العنوان" value={registration.address || ""} onChange={e => handleChange("address", e.target.value)} />
          <TextField label="رمز المدينة" value={registration.cityCode || ""} onChange={e => handleChange("cityCode", e.target.value)} />
          <TextField label="الهاتف الأرضي" value={registration.landLine || ""} onChange={e => handleChange("landLine", e.target.value)} />
          <TextField label="رقم تحقق الأب" value={registration.fatherCheackDigit || ""} onChange={e => handleChange("fatherCheackDigit", e.target.value)} />
          <TextField label="هوية الأب" value={registration.fatherId || ""} onChange={e => handleChange("fatherId", e.target.value)} />
          <TextField label="اسم الأب" value={registration.fatherName || ""} onChange={e => handleChange("fatherName", e.target.value)} />
          <TextField label="هاتف الأب" value={registration.fatherPhone || ""} onChange={e => handleChange("fatherPhone", e.target.value)} />
          <TextField label="اسم عائلة الأب" value={registration.parentLastName || ""} onChange={e => handleChange("parentLastName", e.target.value)} />
          <TextField label="חוג" value={registration.classNumber || ""} onChange={e => handleChange("classNumber", e.target.value)} />
          <TextField label="קבוצה" value={registration.groupNumber || ""} onChange={e => handleChange("groupNumber", e.target.value)} />
          <TextField label="digit5" value={registration.digit5 || ""} onChange={e => handleChange("digit5", e.target.value)} />
          <TextField label="اسم البرنامج/الفعالية" value={registration.name || ""} onChange={e => handleChange("name", e.target.value)} />
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
  <Checkbox
    checked={registration.paid || false}
    onChange={e => handleChange("paid", e.target.checked)}
    sx={{ mr: 1 }}
  />
  <span style={{ fontWeight: "bold" }}>تم الدفع؟</span>
</Box>

          
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={onSave} variant="contained">حفظ</Button>
      </DialogActions>
    </Dialog>
  );
}
