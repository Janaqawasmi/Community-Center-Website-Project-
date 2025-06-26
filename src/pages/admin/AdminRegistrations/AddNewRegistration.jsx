import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { db } from "../../../components/firebase";
import { collection, getDocs } from "firebase/firestore";
import { submitRegistration } from "./../../submitRegistration";
import { validateStep, validateField } from "./../../regist_logic";

const requiredFields = [
  "FirstName", "lastName", "birthdate", "id", "cheackDigit",
  "email", "personalPhone", "gender", "address", "cityCode",
  "landLine", "fatherCheackDigit", "fatherId", "fatherName",
  "fatherPhone", "parentLastName", "docId"
];

export default function AddNewRegistration({ open, onClose }) {
  const [registration, setRegistration] = useState({});
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);

  useEffect(() => {
    (async () => {
      const programsSnap = await getDocs(collection(db, "programs"));
      const eventsSnap = await getDocs(collection(db, "Events"));

      const combinedOptions = [];

      programsSnap.forEach((doc) => {
        const d = doc.data();
        if (!d.archived) {
          combinedOptions.push({
            id: doc.id,
            name: d.name,
            classNumber: d.classNumber,
            groupNumber: d.groupNumber,
            type: "دورة",
          });
        }
      });

      eventsSnap.forEach((doc) => {
        const d = doc.data();
        if (!d.archived) {
          combinedOptions.push({
            id: doc.id,
            name: d.name,
            classNumber: d.classNumber,
            groupNumber: d.groupNumber,
            type: "فعالية",
          });
        }
      });

      setOptions(combinedOptions);
    })();
  }, []);

  const handleChange = (field, value) => {
    setRegistration((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
const isValid = validateStep(0, registration, { 0: requiredFields }, setErrors);
    if (!isValid) return;
    await submitRegistration(registration);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>إضافة تسجيل جديد</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.docId}>
              <InputLabel>اختر الدورة</InputLabel>
              <Select
                value={registration.docId || ""}
                onChange={(e) => handleChange("docId", e.target.value)}
                label="اختر الدورة"
              >
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name} - {option.type} - חוג {option.classNumber} / קבוצה {option.groupNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

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
          ].map((field) => (
            <Grid item xs={6} sm={4} key={field.key}>
              <TextField
                fullWidth
                label={field.label}
                value={registration[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                error={!!errors[field.key]}
                helperText={errors[field.key] || ""}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={registration.paid || false}
                  onChange={(e) => handleChange("paid", e.target.checked)}
                />
              }
              label="تم الدفع؟"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSubmit} variant="contained">
          حفظ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
