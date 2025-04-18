import { db } from '../components/firebase';

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs
} from "firebase/firestore";



// ✅ Send message with message number (id)
export const sendMessage = async ({ first_name, phone, message, last_name,email}) => {
  try {
    // ➊ نجيب عدد الرسائل الحالي
    const snapshot = await getDocs(collection(db, "contactMessages"));
    const count = snapshot.size;
    const nextId = count + 1;

    // ➋ نضيف الرسالة مع الحقل id
    const docRef = await addDoc(collection(db, "contactMessages"), {
      first_name,
      last_name,
      phone,
      message,
      email,
      id: nextId, // 👈 هذا هو رقم الرسالة
      timestamp: serverTimestamp()
    });

    alert(`تم إرسال الرسالة بنجاح! رقم الرسالة: ${nextId}`);
  } catch (error) {
    console.error("خطأ أثناء إرسال الرسالة:", error);
    alert("حدث خطأ أثناء إرسال الرسالة، الرجاء المحاولة لاحقًا.");
  }
};