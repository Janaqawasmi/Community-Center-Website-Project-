import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDyHPkXUFlEd7cYOIKnY_Gz8UUNHMsJRW4",
  authDomain: "public-center-website.firebaseapp.com",
  projectId: "public-center-website",
  storageBucket: "public-center-website.firebasestorage.app",
  messagingSenderId: "124905533171",
  appId: "1:124905533171:web:0efa3647bdca061ebdd186",
  measurementId: "G-0M5175P6K0"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
