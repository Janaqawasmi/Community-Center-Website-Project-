// registrationService.js
// هذا الملف يحتوي على جميع الوظائف الخاصة بجلب وتعديل بيانات التسجيلات (للدورات والفعاليات) من Firestore

import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../components/firebase";


// دالة داخلية تجلب كوليكشن واحد
const fetchCollectionWithDetails = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));

  const regs = await Promise.all(
    snapshot.docs.map(async docSnap => {
      const data = docSnap.data();
      const firebaseId = docSnap.id;
      const docId = data.docId;

      if (!docId) {
        return { firebaseId, ...data, classNumber: "", groupNumber: "", name: "" , digit5:""};
      }

      const defColl = collectionName === "programRegistrations"
        ? "programs"
        : "Events";

      const defSnap = await getDoc(doc(db, defColl, docId));
      const defData = defSnap.exists() ? defSnap.data() : {};

      return {
        firebaseId,
        ...data,
        classNumber: defData.classNumber ?? "",
        groupNumber: defData.groupNumber ?? "",
        name: defData.name ?? "",
        digit5: defData.digit5 ?? "",
        collectionName,
      };
    })
  );

  return regs;
};

// التصدير الرئيسي
export const fetchRegistrations = async (collectionName) => {
  if (collectionName === "all") {
    const programs = await fetchCollectionWithDetails("programRegistrations");
    const events   = await fetchCollectionWithDetails("eventRegistrations");
    return [...programs, ...events];
  }

  return await fetchCollectionWithDetails(collectionName);
};


// تحديث تسجيل بناءً على firebaseId
export const updateRegistration = async (collectionName, registration) => {
try{
  const docRef = doc(db, collectionName, registration.firebaseId);
  let editCopy = { ...registration };
  delete editCopy.firebaseId;

  await updateDoc(docRef, editCopy);}
  catch (error) {
    console.error("Error updating registration:", error);
    throw error;
  }

};
