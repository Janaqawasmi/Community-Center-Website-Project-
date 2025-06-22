//src\components\Data Analysis\utils\trackPageView.js
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../firebase"; // adjust as needed

export async function trackPageView(path) {
  const safeId = encodeURIComponent(path);
  const docRef = doc(db, "pageViews", safeId);

  try {
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const updateData = { viewCount: increment(1) };
      await updateDoc(docRef, updateData);
    } else {
      const createData = { path: path, viewCount: 1 };
      await setDoc(docRef, createData);
    }
  } catch (error) {
    console.error("🔥 Error tracking page view:", error);
  }
}
