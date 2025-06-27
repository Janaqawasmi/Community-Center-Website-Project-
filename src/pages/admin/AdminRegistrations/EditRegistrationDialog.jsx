import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  MenuItem
} from "@mui/material";
import { ConfirmEditDialog } from "../../../components/ConfirmDialog.jsx";
import { updateRegistration } from "./registrationService.jsx";
import { validateField } from "../../regist_logic";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function EditRegistrationDialog({
  open,
  onClose,
  registration,
  onSave,
  collectionName,
  readOnly = false
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editedData, setEditedData] = useState(registration || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!registration) return;

    const edited = { ...registration };

    if (edited.birthdate && edited.birthdate.includes("/")) {
      const [day, month, year] = edited.birthdate.split("/");
      edited.birthdate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    if (edited.landLine && edited.landLine.startsWith("02")) {
      edited.landLine = edited.landLine.slice(2);
    }

    setEditedData(edited);
    setErrors({});
  }, [registration]);

  const hasChanges = JSON.stringify(editedData) !== JSON.stringify(registration);

  const handleChange = (field, value) => {
    if (readOnly) return; // لا تعدل شيء في وضع القراءة فقط

    if (field === "landLine") {
      if (value.startsWith("02")) value = value.slice(2);
      if (value.length > 7) return;
    }

    const error = validateField(field, value);

    setErrors((prev) => ({
      ...prev,
      [field]: error || "",
    }));

    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateRegistration = async () => {
    try {
      const updatedData = { ...editedData };

      if (updatedData.landLine && !updatedData.landLine.startsWith("02")) {
        updatedData.landLine = "02" + updatedData.landLine;
      }

      await updateRegistration(collectionName, updatedData);
      onSave(updatedData);
      onClose();
    } catch (err) {
      console.error("فشل التحديث:", err);
    }
  };

  if (!editedData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{readOnly ? "عرض تفاصيل التسجيل" : "تعديل التسجيل"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          {[
            { label: "رقم الهوية", key: "id" },
            { label: "الاسم الشخصي", key: "FirstName" },
            { label: "اسم العائلة", key: "lastName" },
            { label: "تاريخ الميلاد", key: "birthdate" },
            { label: "الجنس", key: "gender" },
            { label: "رقم التحقق", key: "cheackDigit" },
            { label: "اسم عائلة الأب", key: "parentLastName" },
            { label: "اسم الأب", key: "fatherName" },
            { label: "هوية الأب", key: "fatherId" },
            { label: "رقم تحقق الأب", key: "fatherCheackDigit" },
            { label: "العنوان", key: "address" },
            { label: "رمز المدينة", key: "cityCode" },
            { label: "الهاتف الأرضي", key: "landLine" },
            { label: "رقم الهاتف", key: "personalPhone" },
            { label: "الإيميل", key: "email" },
            { label: "رقم الدورة", key: "classNumber" },
            { label: "رقم المجموعة", key: "groupNumber" },
            { label: "اسم الدورة / الفعالية", key: "name" },
            { label: "رقم التحقق الخامس", key: "digit5" },
          ].map((field) => (
            <Grid item xs={6} sm={4} key={field.key}>
              {field.key === "birthdate" ? (
                <TextField
                  fullWidth
                  type="date"
                  label="تاريخ الميلاد"
                  InputLabelProps={{ shrink: true }}
                  value={editedData.birthdate || ""}
                  onChange={(e) => handleChange("birthdate", e.target.value)}
                  error={!!errors.birthdate}
                  helperText={errors.birthdate}
                  disabled={readOnly}
                />
              ) : field.key === "gender" ? (
                <TextField
                  select
                  fullWidth
                  label="الجنس"
                  value={editedData.gender || ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  error={!!errors.gender}
                  helperText={errors.gender}
                  disabled={readOnly}
                >
                  <MenuItem value="">اختر الجنس</MenuItem>
                  <MenuItem value="ذكر">ذكر</MenuItem>
                  <MenuItem value="أنثى">أنثى</MenuItem>
                </TextField>
              ) : field.key === "landLine" ? (
                <TextField
                  fullWidth
                  label="الهاتف الأرضي"
                  value={`02${editedData.landLine || ""}`}
                  onChange={(e) => handleChange("landLine", e.target.value.replace(/^02/, ""))}
                  error={!!errors.landLine}
                  helperText={errors.landLine}
                  disabled={readOnly}
                />
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  value={editedData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  error={!!errors[field.key]}
                  helperText={errors[field.key]}
                  disabled={readOnly}
                />
              )}
            </Grid>
          ))}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={editedData.paid || false}
                  onChange={(e) => handleChange("paid", e.target.checked)}
                  disabled={readOnly}
                />
              }
              label="تم الدفع؟"
            />
          </Grid>
        </Grid>
      </DialogContent>

      {!readOnly && (
        <DialogActions>
          <Button onClick={onClose}>إلغاء</Button>
          <Button
            onClick={() => {
              if (hasChanges) {
                setConfirmOpen(true);
              } else {
                onClose();
              }
            }}
            variant="contained"
          >
            حفظ
          </Button>
        </DialogActions>
      )}

      {!readOnly && (
        <ConfirmEditDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={async () => {
            await handleUpdateRegistration();
            setConfirmOpen(false);
          }}
        />
      )}
    </Dialog>
  );
}
