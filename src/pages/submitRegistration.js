import { db } from '../components/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { validatePhoneNumber, validateEmail, isValidIsraeliID, validateLandLineNumber } from './regist_logic';


export async function handleSubmit(e, form, setForm) {
  e.preventDefault();


    if (!validatePhoneNumber(form.personalPhone)) {
      alert('رقم الهاتف يجب أن يبدأ بـ 05 ويكون مكونًا من 10 أرقام.');
      return;
    }

    if (!validatePhoneNumber(form.fatherPhone)) {
      alert('رقم الهاتف يجب أن يبدأ بـ 05 ويكون مكونًا من 10 أرقام.');
      return;
    }

    if (!isValidIsraeliID(form.id)) {
      alert('رقم الهوية الشخصي غير صحيح.');
      return;
    }

    if (!isValidIsraeliID(form.fatherId)) {
      alert('رقم هوية الأب غير صحيح.');
      return;
    }

    if (!validateEmail(form.email)) {
      alert('البريد الإلكتروني غير صحيح');
      return;
    }

    if (!(validateLandLineNumber(form.landLine))) {
      alert('رقم الهاتف الأرضي يجب أن يتكون من 7 أرقام');
      return;
    }

    

    try {
      await submitRegistration(form);
      alert('تم التسجيل وحفظ البيانات بنجاح!');
      console.log('تم حفظ البيانات:', form);
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
      });
    } catch (error) {
      console.error('خطأ أثناء حفظ البيانات:', error);
      alert('حدث خطأ أثناء حفظ البيانات');
    }
  };


import { getAuth } from "firebase/auth";
console.log(getAuth().currentUser);

export async function submitRegistration(form) {
  const formattedForm = {
    ...form,
    birthdate: form.birthdate ? form.birthdate.toLocaleDateString('en-GB') : '',
    landLine: form.landLine ? `02${form.landLine.replace(/^0+/, '')}` : '',
  };

  await addDoc(collection(db, "registrations"), formattedForm);
}


