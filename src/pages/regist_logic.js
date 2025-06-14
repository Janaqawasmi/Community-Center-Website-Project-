

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

   
    if (!isValidIsraeliID(form.id)) {
      valid = false;
      newErrors.id = "رقم الهوية الشخصي غير صحيح.";
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
  // تحويل الإدخال إلى سلسلة نصية وإزالة المسافات الزائدة
  id = String(id).trim();

  // التحقق من أن الإدخال يحتوي فقط على أرقام وأن طوله بين 5 و9 خانات
  if (id.length < 7 || id.length > 9 || isNaN(id)) {
    return false;
  }

  // إكمال الرقم إلى 9 خانات بإضافة أصفار إلى اليسار
  // id = id.padStart(9, '0'); 

  let sum = 0;

  for (let i = 0; i < 9; i++) {
    let digit = Number(id[i]);

    // مضاعفة كل رقم في المواقع الفردية (بدءًا من الفهرس 0)
    if (i % 2 === 0) {
      digit *= 1;
    } else {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
  }

  // التحقق من أن المجموع قابل للقسمة على 10
  return sum % 10 === 0;
}


export function validateLandLineNumber(number) {
  const regex = /^\d{7}$/;
  return regex.test(number);
}




const hebrewRegex = /^[\u0590-\u05FF\s]*$/;
const emailRegex1 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const emailRegex2 = /^[A-Za-z]+$/
const numberRegex = /^\d*$/;

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
    if (!emailRegex1.test(value) && !emailRegex2.test(value)&& value.length > 0) {
      return 'يرجى إدخال بريد إلكتروني صحيح باللغة الإنجليزية فقط';
    }
  }






  return '';
}


