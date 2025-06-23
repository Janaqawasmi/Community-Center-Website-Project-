import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, MenuItem } from '@mui/material';
import { validateField } from './regist_logic';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import citiesData from '../assets/codes.json';
import Select from 'react-select';
import { submitRegistration } from './submitRegistration';
import { useLocation } from 'react-router-dom';
import { validateStep } from './regist_logic';
import { useAnonymousAuth } from "../components/auth/useAnonymousAuth";
import { calculateAge } from './regist_logic';
import { decrementCapacity } from "./programs/decrementCapacity"; // عدلي المسار حسب مكان الملف
import PrettyCard from '../components/layout/PrettyCard';
import React from 'react';

const steps = ['المعلومات الشخصية', 'معلومات ولي الأمر'];
function RequiredLabel(text) {
  return (
    <span>
      {text} <span style={{ color: 'red' }}>*</span>
    </span>
  );
}

function RegistrationForm() {
  useAnonymousAuth();
const [formSubmitted, setFormSubmitted] = useState(false);
const [submitSuccess, setSubmitSuccess] = useState(null); // true / false

  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    FirstName: '',
    birthdate: '',
    id: '',
    cheackDigit: '',
    email: '',
    personalPhone: '',
    lastName: '',
    gender: '',
    address: 'ירושלים',
    cityCode: '3000',
    landLine: '',
    fatherCheackDigit: '',
    fatherId: '',
    fatherName: '',
    fatherPhone: '',
    parentLastName: '',
  });

  const requiredFieldsByStep = [
    // الخطوة الأولى
    ['FirstName', 'birthdate', 'id', 'lastName', 'email', 'personalPhone', 'gender', 'address'],
    // الخطوة الثانية
    ['fatherName', 'parentLastName', 'fatherId', 'fatherPhone'],
  ];

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const programName = searchParams.get("program");
  const eventName = searchParams.get("event");
  const title =
    (programName && programName !== "undefined" && programName !== "")
      ? programName
      : (eventName && eventName !== "undefined" && eventName !== "")
        ? eventName
        : "";

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (name === "address") {
        const selectedCity = citiesData.find(city => city.hebrew_name.trim() === value.trim());
        updatedForm.cityCode = selectedCity ? selectedCity.code : '';
      }
      if (name === "gender" && value) {
        setErrors((prev) => ({ ...prev, gender: "" }));
      }
      return updatedForm;
    });
  };

  const handleValidatedChange = (e) => {
    const { name } = e.target;
    const rawValue = e.target.value;
    const value = rawValue.trim();
    const error = validateField(name, value);
    if (!error) {
      setForm((prev) => {
        const updatedForm = { ...prev, [name]: value };
        if (name === "id") {
          updatedForm.cheackDigit = value ? (parseInt(value) % 10).toString() : '';
        }
        if (name === "fatherId") {
          updatedForm.fatherCheackDigit = value ? (parseInt(value) % 10).toString() : '';
        }
        return updatedForm;
      });
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const CustomInput = React.forwardRef(({ value, onClick, error, helperText }, ref) => (
  <TextField
    fullWidth
    variant="outlined"
    size="medium"
    label={RequiredLabel("تاريخ الميلاد")}
    value={value || ''}
    onClick={onClick}
    inputRef={ref} // ✅ use the forwarded ref here
    inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
    sx={{
      '& .MuiInputBase-root': {
        height: '56px',
        fontSize: '1rem',
        paddingLeft: '150px' // 🟡 This may break RTL layout – change to `paddingRight` if needed
      },
      '& .MuiInputLabel-root': {
        fontSize: '1rem'
      }
    }}
    error={error}
    helperText={helperText}
  />
));

  const nextStep = () => {
    if (validateStep(step, form, requiredFieldsByStep, setErrors)) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep((s) => s - 1);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: "250px",
          mb: 4,
          background: "linear-gradient(180deg, #fff 0%,rgb(7, 130, 175) 40%, #003366 100%)",
          ml: 0,
          mr: 'auto',
          zIndex: 0,
          position: "relative",
        }}
      ></Box>

      <Box sx={{
        background: "",
        minHeight: "100vh",
        mt: -28,
        zIndex: 1000,
        position: "relative",
        '& .MuiInputLabel-root': {
          textAlign: 'right',
          right: 20,
          left: 'unset',
          width: '100%',
          direction: 'rtl',
        },
        '& label.Mui-focused, & label.MuiInputLabel-shrink': {
          left: 0,
          right: 'unset',
          textAlign: 'left',
        }
      }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={6} lg={6}>
            <PrettyCard title={title ? `التسجيل لـ${title}` : "التسجيل"}>
           {formSubmitted ? (
  <Box textAlign="center" py={6}>
    {submitSuccess ? (
      <Typography variant="h6" color="success.main">
        ✅ تم إرسال النموذج بنجاح! شكرًا لتسجيلك.
      </Typography>
    ) : (
      <Typography variant="h6" color="error.main">
        ❌ حدث خطأ أثناء الإرسال. حاول مرة أخرى لاحقًا.
      </Typography>
    )}
  </Box>
) : (
             
              <form autoComplete="off"
             onSubmit={async e => {
  e.preventDefault(); // always prevent default first

  if ((step === 0 && calculateAge(form.birthdate) >= 18) || step === 1) {
    try {
      await submitRegistration(e, form, setForm);
if (programName) {
  await decrementCapacity("programs", programName);
} else if (eventName) {
  await decrementCapacity("events", eventName);
}
      setFormSubmitted(true);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("❌ Submission failed:", err);
      setFormSubmitted(true);
      setSubmitSuccess(false);
    }
  } else {
    nextStep();
  }
}}

                style={{ direction: "rtl" }}
              >

                {/* ------- الخطوة 1 ------- */}
                {step === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                  label={RequiredLabel(" الاسم الشخصي باللغة العبرية")}
                        fullWidth
                        variant="outlined"
                        name="FirstName"
                        value={form.FirstName}
                        onChange={handleValidatedChange}
                        error={!!errors.FirstName}
                        helperText={errors.FirstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        selected={form.birthdate ? new Date(form.birthdate) : null}
                        onChange={date => {
                          setForm(prev => ({ ...prev, birthdate: date }));
                          if (date) {
                            setErrors(prev => ({ ...prev, birthdate: "" }));
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        customInput={
                          <CustomInput
                            error={!!errors.birthdate}
                            helperText={errors.birthdate}
                          />
                        }
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        placeholderText="DD/MM/YYYY"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                     label={RequiredLabel(" اسم العائلة باللغة العبرية")}
                        fullWidth
                        variant="outlined"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleValidatedChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={RequiredLabel("رقم الهوية")}
                        fullWidth
                        variant="outlined"
                        name="id"
                        value={form.id}
                        onChange={handleValidatedChange}
                        error={!!errors.id}
                        helperText={errors.id}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={RequiredLabel("البريد الإلكتروني")}
                        fullWidth
                        variant="outlined"
                        name="email"
                        value={form.email}
                        onChange={handleValidatedChange}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={RequiredLabel("رقم الهاتف")}
                        fullWidth
                        variant="outlined"
                        name="personalPhone"
                        value={form.personalPhone}
                        onChange={handleValidatedChange}
                        error={!!errors.personalPhone}
                        helperText={errors.personalPhone}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label={RequiredLabel("الجنس")}
                        fullWidth
                        variant="outlined"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        error={!!errors.gender}
                        helperText={errors.gender}
                      >
                        <MenuItem value="">اختر الجنس</MenuItem>
                        <MenuItem value="ذكر">ذكر</MenuItem>
                        <MenuItem value="أنثى">أنثى</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="الهاتف الأرضي"
                        fullWidth
                        variant="outlined"
                        name="landLine"
                        value={form.landLine}
                        onChange={handleValidatedChange}
                        error={!!errors.landLine}
                        helperText={errors.landLine}
                        inputProps={{ maxLength: 7 }}
                        InputProps={{
                          endAdornment: <span style={{
                            marginLeft: "20px",
                            marginInlineStart: 8,
                            color: "#666"
                          }}>02</span>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box >
                        <Typography sx={{ fontSize: 14, mb: 0.5 }}>اسم المدينة</Typography>
                        <Select
                          options={citiesData.map(city => ({
                            value: city.hebrew_name.trim(),
                            label: city.hebrew_name.trim()
                          }))}
                          name="address"
                          value={
                            citiesData.find(city => city.hebrew_name.trim() === form.address)
                              ? {
                                value: form.address,
                                label: form.address
                              }
                              : null
                          }
                          onChange={selectedOption => {
                            if (!selectedOption) return;
                            const selectedCity = citiesData.find(
                              city => city.hebrew_name.trim() === selectedOption.value.trim()
                            );
                            setForm(prev => ({
                              ...prev,
                              address: selectedOption.value,
                              cityCode: selectedCity ? selectedCity.code : ''
                            }));
                          }}
                          placeholder="اختر اسم المدينة"
                          isClearable={false}
                          styles={{
                            control: base => ({
                              ...base,
                              borderColor: '#ccc',
                              borderRadius: 8,
                              minHeight: 56
                            }),
                            menu: base => ({
                              ...base,
                              direction: 'rtl',
                              textAlign: 'right'
                            })
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        {/* منطق زر التالي أو إرسال حسب العمر */}
                        {(() => {
                          const age = calculateAge(form.birthdate);
                          if (age >= 18) {
                            return (
                              <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="large"
                              >
                                إرسال
                              </Button>
                            );
                          } else {
                            return (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={nextStep}
                                size="large"
                              >
                                التالي
                              </Button>
                            );
                          }
                        })()}
                      </Box>
                    </Grid>
                  </Grid>
                )}

                {/* ------- الخطوة 2 ------- */}
                {step === 1 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                      label="اسم ولي الأمر باللغة العبربة"
                        fullWidth
                        variant="outlined"
                        name="fatherName"
                        value={form.fatherName}
                        onChange={handleValidatedChange}
                        error={!!errors.fatherName}
                        helperText={errors.fatherName}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                      label="اسم عائلة ولي الأمر باللغة العبرية"
                        fullWidth
                        variant="outlined"
                        name="parentLastName"
                        value={form.parentLastName}
                        onChange={handleValidatedChange}
                        error={!!errors.parentLastName}
                        helperText={errors.parentLastName}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="رقم هوية ولي الأمر"
                        fullWidth
                        variant="outlined"
                        name="fatherId"
                        value={form.fatherId}
                        onChange={handleValidatedChange}
                        error={!!errors.fatherId}
                        helperText={errors.fatherId}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="رقم هاتف ولي الأمر"
                        fullWidth
                        variant="outlined"
                        name="fatherPhone"
                        value={form.fatherPhone}
                        onChange={handleValidatedChange}
                        error={!!errors.fatherPhone}
                        helperText={errors.fatherPhone}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={prevStep}
                          size="large"
                        >
                          السابق
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          size="large"
                        >
                          إرسال
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                )}

              </form>
                )}

            </PrettyCard>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default RegistrationForm;
