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
  if (id.length < 7 || id.length > 9 || isNaN(id)){
    alert("رقم الهوية غير صحيح. يجب أن يتكون من 9 أرقام.");
     return false;}

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


export function validateHebrewName(name) {
  const hebrewRegex = /^[\u0590-\u05FF\s]+$/;
  return hebrewRegex.test(name);
}