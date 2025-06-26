import { db } from '../components/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { calculateAge } from './regist_logic';

// 🔧 Remove last digit for validation
function removeLastDigit(num) {
  if (!num) return "";
  return num.toString().slice(0, -1);
}

// 🔧 Get Firestore collection info
function getRegistrationInfo() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("programId")) {
    return {
      collectionName: "programRegistrations",
      sourceCollection: "programs",
      docId: params.get("programId"),
    };
  }

  if (params.has("eventId")) {
    return {
      collectionName: "eventRegistrations",
      sourceCollection: "Events",
      docId: params.get("eventId"),
    };
  }

  return { collectionName: null, sourceCollection: null, docId: null };
}

// ✅ Main function
export async function submitRegistration(e, formData, setForm) {
  e.preventDefault();

  const age = calculateAge(formData.birthdate);
  const idWithoutLast = removeLastDigit(formData.id);
  const fatherIdWithoutLast = removeLastDigit(formData.fatherId);
  const checkDigit = formData.id.slice(-1);
  const fatherCheckDigit = formData.fatherId.slice(-1);

  const { collectionName, sourceCollection, docId } = getRegistrationInfo();

  if (!collectionName || !sourceCollection || !docId) {
    return { success: false, reason: 'invalid_collection' };
  }

  // 🔒 Check for duplicate registration
  const duplicateQuery = query(
    collection(db, collectionName),
    where("id", "==", idWithoutLast),
    where("docId", "==", docId)
  );

  const existing = await getDocs(duplicateQuery);
  if (!existing.empty) {
    return { success: false, reason: 'duplicate' };
  }

  // 📝 Prepare the registration object
  let formattedForm = {
    ...formData,
    id: idWithoutLast,
    cheackDigit: checkDigit,
    fatherId: fatherIdWithoutLast,
    fatherCheackDigit: fatherCheckDigit,
    birthdate: formData.birthdate
      ? formData.birthdate.toLocaleDateString('en-GB')
      : '',
    landLine: formData.landLine ? `02${formData.landLine}` : '',
    registrationDate: new Date().toLocaleString('en-GB', {
      dateStyle: 'short',
      timeStyle: 'short',
    }),
    archived: false,
  };

  if (age >= 18) {
    formattedForm = {
      ...formattedForm,
      fatherName: formData.FirstName,
      parentLastName: formData.lastName,
      fatherId: idWithoutLast,
      fatherPhone: formData.personalPhone,
      fatherCheackDigit: checkDigit,
    };
  }

  try {
    await addDoc(collection(db, collectionName), formattedForm);

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
        docId: '',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('خطأ أثناء حفظ البيانات:', error);
    return { success: false, reason: 'error' };
  }
}
