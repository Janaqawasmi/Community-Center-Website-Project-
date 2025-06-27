import { db } from '../components/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import NProgress from 'nprogress'; // ✅ Add this line

// ✅ Send message with message number (id)
export const sendMessage = async ({ first_name, phone, message, last_name, email, department }) => {
  NProgress.start(); // ✅ Start progress bar

  try {
    const snapshot = await getDocs(collection(db, "contactMessages"));
    const count = snapshot.size;
    const nextId = count + 1;

    await addDoc(collection(db, "contactMessages"), {
      first_name,
      last_name,
      phone,
      message,
      email,
      department,
      reply: "",
      timestamp: serverTimestamp()
    });

    return { success: true, id: nextId };
  } catch (error) {
    console.error("خطأ أثناء إرسال الرسالة:", error);
    throw error;
  } finally {
    NProgress.done(); // ✅ Stop progress bar
  }
};
