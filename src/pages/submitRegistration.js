import { db } from '../components/firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment } from 'firebase/firestore';
import { calculateAge } from './regist_logic';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

function removeLastDigit(num) {
  if (!num) return "";
  return num.toString().slice(0, -1);
}

function getRegistrationInfo() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("program")) {
    return {
      collectionName: "programRegistrations",
      name: decodeURIComponent(params.get("program")),
      sourceCollection: "programs"
    };
  }
  if (params.has("event")) {
    return {
      collectionName: "eventRegistrations",
      name: decodeURIComponent(params.get("event")),
      sourceCollection: "events"
    };
  }
  return { collectionName: null, name: "", sourceCollection: null };
}

// دالة لإنقاص السعة لدورة أو فعالية
async function decrementCapacity(name, sourceCollection) {
  // ابحث عن الوثيقة حسب الاسم
  const q = query(collection(db, sourceCollection), where("name", "==", name));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docID = querySnapshot.docs[0].id;
    const docRef = doc(db, sourceCollection, docID);

    // استعمل increment حتى لو أكثر من شخص سجّل بنفس اللحظة
    await updateDoc(docRef, {
      capacity: increment(-1)
    });
  } else {
    alert("لم يتم العثور على الدورة أو الفعالية المطلوبة لإنقاص السعة!");
  }
}

export async function submitRegistration(e, formData, setForm) {
  e.preventDefault();

  const age = calculateAge(formData.birthdate);

  const idWithoutLast = removeLastDigit(formData.id);
  const fatherIdWithoutLast = removeLastDigit(formData.fatherId);

  const { collectionName, name, sourceCollection } = getRegistrationInfo();

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
    name: name,
    classNumber: formData.classNumber || '',
    groupNumber: formData.groupNumber || '',
    digit5: formData.digit5 || '',
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

NProgress.start(); // ✅ Start the loading bar

try {
  await addDoc(collection(db, collectionName), formattedForm);
  await decrementCapacity(name, sourceCollection);

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
      classNumber: '',
      groupNumber: '',
      digit5: '',
    });
  }
} catch (error) {
  console.error('خطأ أثناء حفظ البيانات:', error);
  alert('حدث خطأ أثناء حفظ البيانات');
} finally {
  NProgress.done(); // ✅ Stop the loading bar
}

}
