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

  if (["FirstName", "lastName", "fatherName"].includes(name)) {
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
