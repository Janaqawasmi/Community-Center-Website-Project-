// Import the functions you need from the SDKs you need
import { initializeApp, getAuth, getFirestore } from "firebase/app";
import { collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyHPkXUFlEd7cYOIKnY_Gz8UUNHMsJRW4",
  authDomain: "public-center-website.firebaseapp.com",
  projectId: "public-center-website",
  storageBucket: "public-center-website.firebasestorage.app",
  messagingSenderId: "124905533171",
  appId: "1:124905533171:web:0efa3647bdca061ebdd186",
  measurementId: "G-0M5175P6K0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to add section data to Firestore
const addSection = async (sectionData) => {
  try {
    // Add a new document to the 'sections' collection
    const docRef = await addDoc(collection(db, "sections"), sectionData);
    console.log("Section added with ID: ", docRef.id);  // Log the new document ID
  } catch (e) {
    console.error("Error adding section: ", e);
  }
};

// Example section data for "قسم النساء"
const sectionDataWomen = {
  title: "قسم النساء",
  vision: "تمكين المرأة هو أحد الركائز الأساسية التي يهتم بها مركز جماهيري بيت حنينا.نعمل في مركز جماهيري بيت حنينا على تمكين النساء في عدد من النواحي...",
  goals: [
    "تمكين النساء ابتداء من الفئة العمرية 18 وحتى 50 عام...",
    "رفع وعي المجتمع بأهمية مكانة المرأة وتعزيز حقوقها...",
    "توفير التدريبات والمحاضرات والورشات لألمهات..."
  ],
  programs: [
    "دورات الوالدية الإيجابية...",
    "دورات التمكين الاقتصادي...",
    "إطلاق مبادرة صحية رياضية ‘سوا بنمشي’..."
  ]
};

// Example section data for "قسم المسنين"
const sectionDataElderly = {
  title: "قسم المسنين",
  vision: "الرؤية: نعمل على توفير بيئة مريحة وآمنة للمسنين من خلال برامج وأنشطة تهدف لتحسين نوعية حياتهم...",
  goals: [
    "دعم المسنين نفسياً واجتماعياً.",
    "تنظيم فعاليات ترفيهية وتعليمية.",
    "تشجيع على ممارسة الرياضة البدنية والعقلية."
  ],
  programs: [
    "دورات رياضية للمسنين.",
    "جلسات استشارية نفسية.",
    "ورشات عمل لتحسين مهارات التواصل."
  ]
};

// Add each section
addSection(sectionDataWomen);
addSection(sectionDataElderly);

// You can continue with more sections using the same structure







