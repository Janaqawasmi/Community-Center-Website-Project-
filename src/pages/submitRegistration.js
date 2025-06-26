import { db } from '../components/firebase';
import { collection, addDoc,  getDoc, updateDoc } from 'firebase/firestore';
import { calculateAge } from './regist_logic';
import { decrementCapacity } from './programs/decrementCapacity';

function removeLastDigit(num) {
  if (!num) return "";
  return num.toString().slice(0, -1);
}

function getRegistrationInfo() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("programId")) {
    return {
      collectionName:    "programRegistrations",
      sourceCollection: "programs",
      docId:             params.get("programId")
    };
  }

  if (params.has("eventId")) {
    return {
      collectionName:    "eventRegistrations",
      sourceCollection: "Events",
      docId:             params.get("eventId")
    };
  }

  return { collectionName: null, sourceCollection: null, docId: null };
}


export async function submitRegistration(e, formData, setForm) {
  e.preventDefault();

  const age = calculateAge(formData.birthdate);

  const idWithoutLast = removeLastDigit(formData.id);
  const fatherIdWithoutLast = removeLastDigit(formData.fatherId);

const { collectionName, sourceCollection, docId } = getRegistrationInfo();

  if (!collectionName || !sourceCollection) {
    alert('لم يتم تحديد نوع التسجيل (دورة أو فعالية)');
    return;
  }

  let formattedForm = {
    ...formData,
    id: idWithoutLast,
    fatherId: fatherIdWithoutLast,
    birthdate: formData.birthdate ? formData.birthdate.toLocaleDateString('en-GB') : '',
    landLine: formData.landLine ? `02${formData.landLine}` : '',
    registrationDate: new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
    archived: false,

  };

  if (age >= 18) {
    formattedForm = {
      ...formattedForm,
      fatherName: formData.FirstName,
      parentLastName: formData.lastName,
      fatherId: idWithoutLast,
      fatherPhone: formData.personalPhone,
      fatherCheackDigit: formData.cheackDigit,
    };
  }

  try {
    // 1. أضف التسجيل أولاً
    await addDoc(collection(db, collectionName), formattedForm);

    // 2. بعد نجاح الحفظ، أنقص السعة من الدورة أو الفعالية
   

    alert('تم التسجيل وحفظ البيانات بنجاح!');
    if (setForm) {
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
          docId: '', // ✅ ADD THIS
      });
    }
  } catch (error) {
    console.error('خطأ أثناء حفظ البيانات:', error);
    alert('حدث خطأ أثناء حفظ البيانات');
  }


}
