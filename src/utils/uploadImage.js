import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../components/firebase"; // استيراد قاعدة البيانات


const storage = getStorage();

export const uploadImage = async ({ 
  file,               // الصورة كـ File
  storagePath,        // مسار الحفظ في التخزين "events/event123.jpg"
  firestorePath,      // [collection, documentId]
  field = "imageUrl"     // اسم الحقل داخل المستند
}) => {
  try {
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    const [collectionName, docId] = firestorePath;
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { [field]: url });

    return url;
  } catch (err) {
    console.error("فشل رفع الصورة وتحديث الرابط:", err);
    alert("فشل رفع الصورة. يرجى المحاولة مرة أخرى.");
    throw err;
  }
};
