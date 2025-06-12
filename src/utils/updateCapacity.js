import { db } from '../components/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

/**
 * ينقص عدد المقاعد المتبقية (capacity) في مستند داخل أي مجموعة (collection)
 * @param {string} collectionName - اسم المجموعة (مثال: "programs" أو "events")
 * @param {string} docId - معرف المستند المراد تحديثه
 * @param {number} amount - مقدار التغيير (سالب للنقصان)، الافتراضي -1
 * @returns {Promise<void>}
 */
export async function decrementCapacity(collectionName, docId, amount = -1) {
  if (!collectionName || !docId) return;
  try {
    const ref = doc(db, collectionName, docId);
    await updateDoc(ref, {
      capacity: increment(amount)
    });
    // يمكنك إضافة رسالة نجاح هنا إذا أردتِ
  } catch (err) {
    console.error(`فشل تحديث السعة في ${collectionName}/${docId}:`, err);
    throw err; // لو تريدين التعامل مع الخطأ في مكان آخر
  }
}
