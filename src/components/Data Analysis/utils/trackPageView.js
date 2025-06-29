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
      await updateDoc(docRef, {
        viewCount: increment(1),
        [`monthlyViews.${monthKey}`]: increment(1),
      });
      console.log("✅ Page view updated");
    } else {
      await setDoc(docRef, {
        path,
        viewCount: 1,
        monthlyViews: {
          [monthKey]: 1
        }
      });
      console.log("✅ Page view created");
    }

  } catch (error) {
    console.error("🔥 Error tracking page view:", error.message);
  }
}
