import { db } from '../components/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { calculateAge } from './regist_logic';
//import { decrementCapacity } from '../utils/updateCapacity';  

// دالة حذف آخر منزلة
function removeLastDigit(num) {
  if (!num) return "";
  return num.toString().slice(0, -1);
}

export async function submitRegistration(e, form, setForm) {
  e.preventDefault();

  const age = calculateAge(form.birthdate);

  // حذف آخر منزلة من الهوية
  const idWithoutLast = removeLastDigit(form.id);
  const fatherIdWithoutLast = removeLastDigit(form.fatherId);

  let formattedForm = {
    ...form,
    id: idWithoutLast,
    fatherId: fatherIdWithoutLast,
    birthdate: form.birthdate ? form.birthdate.toLocaleDateString('en-GB') : '',
    landLine: form.landLine ? `02${form.landLine}` : '',
  };

  if (age >= 18) {
    formattedForm = {
      ...formattedForm,
      fatherName: form.FirstName,
      parentLastName: form.lastName,
      fatherId: idWithoutLast, // أيضًا هنا
      fatherPhone: form.personalPhone,
      fatherCheackDigit: form.cheackDigit,
    };
  }

  try {
    await addDoc(collection(db, "registrations"), formattedForm);
    alert('تم التسجيل وحفظ البيانات بنجاح!');
    console.log('تم حفظ البيانات:', formattedForm);
    setForm({
      FirstName: '',
      birthdate: '',
      id: '',
      cheackDigit: '',
      email: '',
      personalPhone: '',
      lastName: '',
      gender: '',
      address: '',
      cityCode: '',
      landLine: '',
      fatherCheackDigit: '',
      fatherId: '',
      fatherName: '',
      fatherPhone: '',
      parentLastName: '',
    });



  } catch (error) {
    console.error('خطأ أثناء حفظ البيانات:', error);
    alert('حدث خطأ أثناء حفظ البيانات');
  }
}