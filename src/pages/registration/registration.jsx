import { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { validateField, validateStep, calculateAge } from '../regist_logic';
import citiesData from '../../assets/codes.json';
import { submitRegistration } from '../submitRegistration';
import { useLocation } from 'react-router-dom';
import { useAnonymousAuth } from "../../components/auth/useAnonymousAuth";
import { decrementCapacity } from "../programs/decrementCapacity";
import PrettyCard from '../../components/layout/PrettyCard';
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from 'react';

import StepOne from './StepOne';
import StepTwo from './StepTwo';

function RegistrationForm() {
  useAnonymousAuth();
  const [submitMessage, setSubmitMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
const [isLoading, setIsLoading] = useState(false);

  const requiredFieldsByStep = [
    ['FirstName', 'birthdate', 'id', 'lastName', 'email', 'personalPhone', 'gender', 'address'],
    ['fatherName', 'parentLastName', 'fatherId', 'fatherPhone'],
  ];

 const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const docId = searchParams.get("programId") || searchParams.get("eventId") || '';
  const programId = searchParams.get("programId");
  const eventId   = searchParams.get("eventId");
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
   docId: docId, // ✅ set docId initially
  });

  const userIsAdult = form.birthdate && calculateAge(form.birthdate) >= 18;
  const programName = searchParams.get("program");
  const eventName = searchParams.get("event");
  const title =
    (programName && programName !== "undefined" && programName !== "")
      ? programName
      : (eventName && eventName !== "undefined" && eventName !== "")
        ? eventName
        : "";


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


  const nextStep = () => {
    if (validateStep(step, form, requiredFieldsByStep, setErrors)) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

const handleSubmit = async (e) => {
  e.preventDefault();

    // 🚀 Run validation first!
  const isValid = validateStep(step, form, requiredFieldsByStep, setErrors);

  if (!isValid) {
    console.log("❌ Form validation failed. Fix errors before sending.");
    return;
  }
  
  if (!recaptchaToken) {
    setSubmitMessage("❌ يرجى التحقق من أنك لست روبوتاً.");
    setFormSubmitted(true);
    return;
  }

  if ((step === 0 && calculateAge(form.birthdate) >= 18) || step === 1) {
    try {
        setIsLoading(true);

      const result = await submitRegistration(e, {
        ...form,
        recaptchaToken: recaptchaToken,
      }, setForm);

      if (result.success) {
        if (programId) {
          await decrementCapacity({ collectionName: "programs", docId: programId });
        } else if (eventName) {
          await decrementCapacity({ collectionName: "Events", docId: eventId });
        }

       setSubmitMessage("✅ تم إرسال النموذج بنجاح!<br/>شكرًا لتسجيلك.<br/>ستصلك رسالة بريد إلكتروني تحتوي على تفاصيل التسجيل.");
      } else if (result.reason === "duplicate") {
        setSubmitMessage("❌ تم التسجيل مسبقًا لنفس الدورة/الفعالية.");
      } else {
        setSubmitMessage("❌ حدث خطأ أثناء معالجة التسجيل.");
      }

      setFormSubmitted(true);

       // ✅ RESET THE CAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaToken(null);


    } catch (err) {
      console.error("❌ Submission error:", err);
      setSubmitMessage("❌ حدث خطأ غير متوقع. حاول مرة أخرى لاحقًا.");
      setFormSubmitted(true);

         // ✅ RESET THE CAPTCHA even after an error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaToken(null);

    } finally {
      setIsLoading(false);
    }
  } else {
    nextStep();
  }
};



  return (
    <>
 {/* Optional: Page Banner or Header Space */}
    <Box sx={{ height: "0px", mb: 0 }} />
     {/* Background with gradient or subtle image */}
     <Box sx={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f9fa 0%, #e0e0e0 100%)",
    py: { xs: 4, sm: 6 },
    px: { xs: 2, sm: 4 },
    display: 'flex',
    justifyContent: 'center',
    direction: 'rtl',
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
        <Grid container justifyContent="center" >
          <Grid item xs={12} sm={10} md={6} lg={6}>
            <PrettyCard title={title ? `التسجيل لـ${title}` : "التسجيل"} >
            {formSubmitted ? (
  <Box textAlign="center" py={6}>
   <div
  style={{ color: submitMessage.startsWith("✅") ? "#2e7d32" : "#d32f2f", fontSize: "1.25rem" }}
  dangerouslySetInnerHTML={{ __html: submitMessage }}
/>

  </Box>
) : (

 <form autoComplete="off" onSubmit={handleSubmit} style={{ direction: "rtl" }}>
              
              {/* ------- الخطوة 1 ------- */}
                {/* حقل مخفي لحفظ docId */}
                <input type='hidden' name='docId' value={form.docId} /> 
  {step === 0 && (
    <>
      <StepOne
        form={form}
        setForm={setForm}
        errors={errors}
        setErrors={setErrors}
        handleValidatedChange={handleValidatedChange}
        handleChange={handleChange}
        nextStep={nextStep}
        isLoading={isLoading}
        recaptchaToken={recaptchaToken}
      />

      {userIsAdult && (
        <Box textAlign="center" mt={1}>
          <ReCAPTCHA
  ref={recaptchaRef}
  sitekey="6Le2DxsrAAAAAHoYVOpDRby_DGrmAQzu8IB32mdQ"
  onChange={(token) => setRecaptchaToken(token)}
  onErrored={() => {
    console.error("❌ reCAPTCHA failed to load or timed out.");
    setSubmitMessage("❌ حدث خطأ أثناء التحقق من أنك لست روبوتاً. حاول مرة أخرى.");
    setFormSubmitted(true);
  }}
  onExpired={() => {
    console.warn("reCAPTCHA expired.");
    setRecaptchaToken(null);
  }}
  size="normal"
  hl="ar"
/>

        </Box>
      )}
    </>
  )}

                {/* ------- الخطوة 2 ------- */}
               {step === 1 && (
  <>
    <StepTwo
      form={form}
      errors={errors}
      handleValidatedChange={handleValidatedChange}
      prevStep={prevStep}
      isLoading={isLoading}
      recaptchaToken={recaptchaToken}
    />

    {!userIsAdult && (
      <Box textAlign="center" mt={1}>
       <ReCAPTCHA
  ref={recaptchaRef}
  sitekey="6Le2DxsrAAAAAHoYVOpDRby_DGrmAQzu8IB32mdQ"
  onChange={(token) => setRecaptchaToken(token)}
  onErrored={() => {
    console.error("❌ reCAPTCHA failed to load or timed out.");
    setSubmitMessage("❌ حدث خطأ أثناء التحقق من أنك لست روبوتاً. حاول مرة أخرى.");
    setFormSubmitted(true);
  }}
  onExpired={() => {
    console.warn("reCAPTCHA expired.");
    setRecaptchaToken(null);
  }}
  size="normal"
  hl="ar"
/>

      </Box>
    )}
  </>
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
