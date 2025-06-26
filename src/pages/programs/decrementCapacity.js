import { doc, updateDoc, getDoc, collection, query, where } from "firebase/firestore";
import { db } from "../../components/firebase"; // مسار استيراد قاعدة البيانات عندك

// دالة لإنقاص السعة (capacity)
export async function decrementCapacity({ collectionName, docId }) {
  if (!collectionName || !docId) {
    console.warn("decrementCapacity: missing collectionName or docId");
    return;
  }

  // بناء مرجع المستند مباشرةً
  const docRef = doc(db, collectionName, docId);

  // جلب البيانات الحالية للمستند
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    console.warn(`Document not found: ${collectionName}/${docId}`);
    return;
  }

  const data = snap.data();
  const currentCapacity = typeof data.capacity === "number" ? data.capacity : 0;
  console.log(`Current capacity for ${collectionName}/${docId}:`, currentCapacity);

  // إذا كانت القيمة أكبر من صفر، قم بتخفيضها بمقدار 1
  if (currentCapacity > 0) {
    const newCapacity = currentCapacity - 1;
    await updateDoc(docRef, { capacity: newCapacity });
    console.log(`Updated capacity for ${collectionName}/${docId}:`, newCapacity);
  } else {
    console.log(`Capacity already zero for ${collectionName}/${docId}`);
  }
}