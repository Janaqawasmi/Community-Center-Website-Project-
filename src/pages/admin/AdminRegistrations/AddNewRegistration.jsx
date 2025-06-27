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
import InputAdornment from "@mui/material/InputAdornment";


const requiredFields = [
  "FirstName", "lastName", "birthdate", "id", "cheackDigit",
  "email", "personalPhone", "gender", "address", "cityCode",
  "landLine", "docId"
];

export default function AddNewRegistration({ open, onClose }) {
  const extractLastDigit = (num) =>
  num && num.length > 0 ? num.toString().slice(-1) : "";

  const [registration, setRegistration] = useState({});
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [showGuardian, setShowGuardian] = useState(false);

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
          capacity: d.capacity || 0  // ✅ إضافة السعة
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
          capacity: d.capacity || 0  // ✅ إضافة السعة
        });
      }
    });

    setOptions(combinedOptions);
  })();
}, []);
useEffect(() => {
  if (open) {
    setRegistration({});
    setErrors({});
    setShowGuardian(false);
  }
}, [open]);


  const calculateAge = (birthdateStr) => {
    if (!birthdateStr.includes("-")) return 0;
    const today = new Date();
    const birthDate = new Date(birthdateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (field, value) => {
  if (field === "birthdate") {
    if (!value) {
      setRegistration((prev) => ({ ...prev, birthdate: "" }));
      return;
    }

    const age = calculateAge(value);
    setShowGuardian(age < 18);

    const [yyyy, mm, dd] = value.split("-");
    if (yyyy && mm && dd) {
      const formatted = `${dd}/${mm}/${yyyy}`;
      setRegistration((prev) => ({ ...prev, birthdate: formatted }));
      const error = validateField(field, formatted);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  } else {
   
    setRegistration((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }
};


  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>إضافة تسجيل جديد</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>

          {/* اختيار الدورة */}
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.docId}>
              <InputLabel>اختر الدورة</InputLabel>
              <Select
  value={registration.docId || ""}
  onChange={(e) => handleChange("docId", e.target.value)}
  label="اختر الدورة"

MenuProps={{
    PaperProps: {
      style: {
        maxHeight: 300, // الارتفاع الأقصى بالبيكسل
        width: 400,     // العرض بالبيكسل
      },
    },
  }}
>
  {options.map((option) => (
    <MenuItem
      key={option.id}
      value={option.id}
      disabled={option.capacity === 0}  // ✅ منع الاختيار إذا السعة = 0
    >
      {option.name} - {option.type} - חוג {option.classNumber} / קבוצה {option.groupNumber}
      {option.capacity === 0 ? " (ممتلئ)" : ""}
    </MenuItem>
  ))}
</Select>

            </FormControl>
          </Grid>

          {/* معلومات المسجل */}
          <Grid item xs={12}>
            <strong>معلومات المسجل:</strong>
          </Grid>

          {[
            { label: "رقم الهوية", key: "id" },
            { label: "الاسم الشخصي", key: "FirstName" },
            { label: "اسم العائلة", key: "lastName" },
            { label: "تاريخ الميلاد", key: "birthdate", type: "date" },
            { label: "الجنس", key: "gender", type: "select" },
            //{ label: "رقم التحقق", key: "cheackDigit" },
            //{ label: "العنوان", key: "address" },
            ///{ label: "رمز المدينة", key: "cityCode" },
            //{ label: "الهاتف الأرضي", key: "landLine" },
            { label: "رقم الهاتف", key: "personalPhone" },
            { label: "الإيميل", key: "email" },
            
          ].map((field) => (
            
            <Grid item xs={6} sm={4} key={field.key}>
              {field.type === "date" ? (
                <TextField
                  fullWidth
                  type="date"
                  label={field.label}
                  InputLabelProps={{ shrink: true }}
                  value={
                    registration.birthdate
                      ? registration.birthdate.split("/").reverse().join("-")
                      : ""
                  }
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  error={!!errors[field.key]}
                  helperText={errors[field.key] || ""}
                />
              ) : field.type === "select" ? (
                <TextField
                  select
                  fullWidth
                  label={field.label}
                  value={registration[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  error={!!errors[field.key]}
                  helperText={errors[field.key] || ""}
                >
                  <MenuItem value="">اختر الجنس</MenuItem>
                  <MenuItem value="ذكر">ذكر</MenuItem>
                  <MenuItem value="أنثى">أنثى</MenuItem>
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  value={registration[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  error={!!errors[field.key]}
                  helperText={errors[field.key] || ""}
                />
              )}
            </Grid>
          ))}
<Grid item xs={6} sm={4}>
  <TextField
    fullWidth
    label="الهاتف الأرضي"
    value={registration.landLine || ""}
    onChange={(e) => handleChange("landLine", e.target.value)}
    error={!!errors["landLine"]}
    helperText={errors["landLine"] || ""}
    inputProps={{ dir: "ltr" }} // اجعل اتجاه الحقل من اليسار لليمين
    InputProps={{
      startAdornment: (
        <InputAdornment position="start" sx={{ direction: "ltr" }}>
          02
        </InputAdornment>
      ),
    }}
  />
</Grid>


          {/* معلومات ولي الأمر */}
          {showGuardian && (
            <>
              <Grid item xs={12}>
                <strong>معلومات ولي الأمر:</strong>
              </Grid>

              {[
                { label: "اسم الأب", key: "fatherName" },
                { label: "هوية الأب", key: "fatherId" },
                //{ label: "رقم تحقق الأب", key: "fatherCheackDigit" },
                { label: "اسم عائلة الأب", key: "parentLastName" },
                { label: "هاتف الأب", key: "fatherPhone" },
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
            </>
          )}

          {/* تم الدفع */}
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
<Button
  onClick={(e) => {
    const selected = options.find(opt => opt.id === registration.docId);
    if (!selected) {
      alert("يرجى اختيار دورة أو فعالية");
      return;
    }
     const parseDateString = (str) => {
      if (!str.includes("/")) return null;
      const [dd, mm, yyyy] = str.split("/");
      const dateObj = new Date(`${yyyy}-${mm}-${dd}`);
      return isNaN(dateObj) ? null : dateObj;
    };

    const extractLastDigit = (num) =>
      num && num.length > 0 ? num.toString().slice(-1) : "";

    const enhancedRegistration = {
      ...registration,
      cheackDigit: extractLastDigit(registration.id),
      fatherCheackDigit: extractLastDigit(registration.fatherId),
      address: "ירושלים",
      cityCode: "3000",
      birthdate: registration.birthdate ? parseDateString(registration.birthdate) : null
    };

    // ✅ التحقق من صحة البيانات قبل المتابعة
const isValid = validateStep(0, enhancedRegistration, { 0: requiredFields }, setErrors);
    if (!isValid) {
      alert("يرجى تصحيح الأخطاء قبل الحفظ.");
      return;
    }

    const overrides = {
      collectionName: selected.type === "دورة" ? "programRegistrations" : "eventRegistrations",
      sourceCollection: selected.type === "دورة" ? "programs" : "Events",
      docId: selected.id
    };

    

   
    

    submitRegistration(e, enhancedRegistration, setRegistration, overrides);
  }}
  variant="contained"
>
  حفظ
</Button>




      </DialogActions>
    </Dialog>
  );
}
