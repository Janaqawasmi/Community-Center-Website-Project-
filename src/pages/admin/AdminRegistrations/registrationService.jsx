// registrationService.js
// هذا الملف يحتوي على جميع الوظائف الخاصة بجلب وتعديل بيانات التسجيلات (للدورات والفعاليات) من Firestore

import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../components/firebase";

// جلب جميع التسجيلات من كوليكشن معين
export const fetchRegistrations = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map(doc => ({
    firebaseId: doc.id,
    ...doc.data()
  }));
};

// تحديث تسجيل بناءً على firebaseId
export const updateRegistration = async (collectionName, registration) => {
  const docRef = doc(db, collectionName, registration.firebaseId);
  let editCopy = { ...registration };
  delete editCopy.firebaseId;
  await updateDoc(docRef, editCopy);
};
