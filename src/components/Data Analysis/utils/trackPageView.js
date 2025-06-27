import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../firebase";

export async function trackPageView(path) {
  console.log("📡 trackPageView called with:", path);

  const safeId = encodeURIComponent(path);
  const docRef = doc(db, "pageViews", safeId);

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const existingData = snap.data();

      const updateData = {
        viewCount: increment(1),
      };

      // If monthlyViews exists, increment it; otherwise, create it
      if (existingData.monthlyViews) {
        updateData[`monthlyViews.${monthKey}`] = increment(1);
      } else {
        updateData["monthlyViews"] = {
          [monthKey]: 1
        };
      }

      await updateDoc(docRef, updateData);
      console.log("✅ Page view updated:", updateData);

    } else {
      // First time: create new doc with monthlyViews
      const createData = {
        path: path,
        viewCount: 1,
        monthlyViews: {
          [monthKey]: 1
        }
      };
      await setDoc(docRef, createData);
      console.log("✅ New page view document created.");
    }
  } catch (error) {
    console.error("🔥 Error tracking page view:", error);
  }
}
