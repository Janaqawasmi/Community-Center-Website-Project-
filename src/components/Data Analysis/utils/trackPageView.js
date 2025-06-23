//src\components\Data Analysis\utils\trackPageView.js
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../firebase"; // adjust as needed

export async function trackPageView(path) {
  console.log("📡 trackPageView called with:", path);
  const safeId = encodeURIComponent(path);
  const docRef = doc(db, "pageViews", safeId);

  try {
    const snap = await getDoc(docRef);
    console.log("📄 Does document exist?", snap.exists());

    if (snap.exists()) {
      const updateData = { viewCount: increment(1) };
      console.log("🔁 Updating with:", updateData);
      await updateDoc(docRef, updateData);
      console.log("✅ Document updated.");
    } else {
      const createData = { path: path, viewCount: 1 };
      console.log("🆕 Creating with:", createData);
      await setDoc(docRef, createData);
      console.log("✅ Document created.");
    }
  } catch (error) {
    console.error("🔥 Error tracking page view:", error);
  }
}