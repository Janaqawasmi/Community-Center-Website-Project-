import { doc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../components/firebase"; // مسار استيراد قاعدة البيانات عندك

// دالة لإنقاص السعة (capacity)
export async function decrementCapacity({ programName, eventName }) {
  console.log("decrementCapacity called", programName, eventName);
  console.log("docRef:", docRef.path);
console.log("currentCapacity:", currentCapacity);
console.log("سيتم التحديث إلى:", currentCapacity - 1);
console.log("القيم المرسلة:", { capacity: currentCapacity - 1 });


  let collectionName = "";
  let searchField = "";
  let itemName = "";
  if (programName) {
    collectionName = "programs"; // اسم الكوليكشن للدورات
    searchField = "name";        // الحقل الذي يحتوي على اسم الدورة
    itemName = programName;
  } else if (eventName) {
    collectionName = "Events";   // اسم الكوليكشن للأحداث
    searchField = "name";        // الحقل الذي يحتوي على اسم الحدث
    itemName = eventName;
  } else {
    return;
  }

  // ابحث عن الدوكيومنت بالاسم
  const q = query(collection(db, collectionName), where(searchField, "==", itemName));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    const currentCapacity = snapshot.docs[0].data().capacity;
    // قلل الـ capacity إذا كان أكبر من صفر
    if (currentCapacity > 0) {
      await updateDoc(docRef, {
        capacity: currentCapacity - 1
      });
    }
  }
}
