export function validatePhoneNumber(phone) {
    // Check if the phone number starts with '05' and has exactly 10 digits
    const phoneRegex = /^05\d{8}$/;
    return phoneRegex.test(phone);
  }

  export function isValidIsraeliID(id) {
    id = String(id).trim();
    if (id.length > 9 || id.length < 5 || isNaN(id)) return false;
  
    // إكمال الرقم إلى 9 أرقام بإضافة أصفار إلى اليسار
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
  
    return Array.from(id, Number).reduce((sum, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return sum + (step > 9 ? step - 9 : step);
    }, 0) % 10 === 0;
  }
  