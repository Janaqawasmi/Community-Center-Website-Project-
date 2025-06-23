

 export function calculateAge(birthdate) {
  if (!birthdate) return 0;
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}



export function validateStep(step, form, requiredFieldsByStep, setErrors) {
  const requiredFields = requiredFieldsByStep[step];
  let valid = true;
  let newErrors = {};

  requiredFields.forEach(field => {
    if (!form[field] || form[field].toString().trim() === "") {
      valid = false;
      newErrors[field] = "هذا الحقل مطلوب";
    }
  });
 if (step === 0 ) {
    if (!validatePhoneNumber(form.personalPhone)) {
      valid = false;
      newErrors.personalPhone = "رقم الهاتف يجب أن يبدأ بـ 05 ويكون مكونًا من 10 أرقام.";
    }

   
    if (!form.id || form.id.trim() === "") {
  valid = false;
  newErrors.id = "هذا الحقل مطلوب";
} else {
  const idCheck = isValidIsraeliID(form.id);
  if (!idCheck.valid) {
    if (idCheck.reason === 'length') {
      newErrors.id = "رقم الهوية يجب أن يكون 9 أرقام";
    } else if (idCheck.reason === 'algorithm') {
      newErrors.id = "رقم الهوية غير صحيح.";
    } else if (idCheck.reason === 'digits') {
      newErrors.id = "رقم الهوية يجب أن يحتوي على أرقام فقط";
    }
    valid = false;
  }
}


  

    if (!validateEmail(form.email)) {
      valid = false;
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (form.landLine && !validateLandLineNumber(form.landLine)) {
      valid = false;
      newErrors.landLine = "رقم الهاتف الأرضي يجب أن يتكون من 7 أرقام";
    }
 }
else if(step === 1) {
   if (!validatePhoneNumber(form.fatherPhone)) {
     valid = false;
     newErrors.fatherPhone = "رقم الهاتف يجب أن يبدأ بـ 05 ويكون مكونًا من 10 أرقام.";
   }

   if (!isValidIsraeliID(form.fatherId)) {
     valid = false;
     newErrors.fatherId = "رقم هوية الأب غير صحيح.";
   }

  
}

  setErrors(prev => ({ ...prev, ...newErrors }));
  return valid;

};



export function validatePhoneNumber(phone) {
  // Check if the phone number starts with '05' and has exactly 10 digits
  const phoneRegex = /^05\d{8}$/;
  return phoneRegex.test(phone);
}

export function validateEmail(email) {
  // تعبير نمطي بسيط للتحقق من هيكل الإيميل
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


export function isValidIsraeliID(id) {
  id = String(id).trim();

  if (!/^\d+$/.test(id)) {
    return { valid: false, reason: 'digits' }; // ليس أرقام فقط
  }

  if (id.length !== 9) {
    return { valid: false, reason: 'length' }; // ليس 9 أرقام
  }

  // تحقق من الجوريتم
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(id[i]);
    if (i % 2 === 0) {
      digit *= 1;
    } else {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  if (sum % 10 !== 0) {
    return { valid: false, reason: 'algorithm' }; // فشل الجوريتم
  }

  return { valid: true };
}


export function validateLandLineNumber(number) {
  const regex = /^\d{7}$/;
  return regex.test(number);
}


const numberRegex = /^\d*$/;
const hebrewRegex = /^[\u0590-\u05FF\s]*$/;
const emailAllowedRegex = /^[a-zA-Z0-9._%+\-@]*$/; // فقط الحروف اللاتينية والأرقام والرموز المسموحة
const emailFullRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // الشكل النهائي للإيميل

export function validateField(name, value) {
  if (["id", "fatherId", "landLine", "personalPhone", "fatherPhone"].includes(name)) {
    if (!numberRegex.test(value)) {
      return 'يرجى إدخال أرقام فقط';
    }
  }

  if (["FirstName", "lastName", "fatherName", "parentLastName"].includes(name)) {
    if (!hebrewRegex.test(value)) {
      return 'يرجى الإدخال باللغة العبرية فقط';
    }
  }

  if (name === 'email') {
    // ممنوع أحرف غير لاتينية أو رموز غريبة حتى أثناء الكتابة
    if (value.length > 0 && !emailAllowedRegex.test(value)) {
      return 'يرجى إدخال بريد إلكتروني بالإنجليزية فقط وبدون رموز غريبة';
    }
    // عند الإرسال أو الخروج من الحقل (لو تحب تفحص هنا أيضا):
    // يمكن عمل فحص إضافي في onBlur أو عند الإرسال النهائي فقط
    // إذا أردت الفحص أثناء الكتابة:
    // if (value.includes('@') && !emailFullRegex.test(value)) {
    //   return 'يرجى إدخال بريد إلكتروني صحيح بالإنجليزية فقط';
    // }
  }

  return '';
}
