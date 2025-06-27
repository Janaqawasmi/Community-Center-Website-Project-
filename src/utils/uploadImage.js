import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../components/firebase"; // استيراد قاعدة البيانات

const storage = getStorage();

export const uploadImage = async ({
  file,
  storagePath,
  firestorePath = null,
  field = "imageUrl"
}) => {
  try {
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // ✅ Update Firestore only if path is provided
    if (firestorePath && firestorePath.length === 2) {
      const [collectionName, docId] = firestorePath;
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, { [field]: url });
    }

    return url;
  } catch (err) {
    console.error("فشل رفع الصورة وتحديث الرابط:", err);
    alert("فشل رفع الصورة. يرجى المحاولة مرة أخرى.");
    throw err;
  }
};
