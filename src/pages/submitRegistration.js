import { db } from '../components/firebase';
import { calculateAge } from './regist_logic';
import { decrementCapacity } from "./programs/decrementCapacity"; 
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';


// دالة حذف آخر منزلة
function removeLastDigit(num) {
  if (!num) return "";
  return num.toString().slice(0, -1);
}

export async function submitRegistration(e, form, setForm, programName, eventName) {
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
  if (programName) {
    // ابحث عن الدورة المطلوبة
    const q = query(collection(db, "programs"), where("name", "==", programName));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const programData = snapshot.docs[0].data();
      formattedForm.groupNumber = programData.groupNumber || "";
      formattedForm.classNumber = programData.classNumber || "";
      formattedForm.programName = programData.name || programName;
    }
  }

  try {
    let collectionName = "registrations"; // الافتراضي
    if (programName) {
      collectionName = "programRegistrations";
    } else if (eventName) {
      collectionName = "eventRegistrations";
    }
await addDoc(collection(db, collectionName), formattedForm);
    alert('تم التسجيل وحفظ البيانات بنجاح!');
   await decrementCapacity({ programName, eventName }); // إنقاص السعة بعد التسجيل

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