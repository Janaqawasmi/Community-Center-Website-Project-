import { db } from '../components/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import NProgress from 'nprogress'; // ✅ Add this line


export const sendMessage = async ({ first_name, phone, message, last_name, email, department }) => {
  NProgress.start(); // ✅ Start progress bar

  try {
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

    return { success: true};
  } catch (error) {
    console.error("خطأ أثناء إرسال الرسالة:", error);
    throw error;
  } finally {
    NProgress.done(); // ✅ Stop progress bar
  }
};
