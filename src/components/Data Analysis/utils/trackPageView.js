import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "../../firebase";

export async function trackPageView(path) {
  console.log("📡 trackPageView called with:", path);

  const safeId = encodeURIComponent(path);
  const docRef = doc(db, "pageViews", safeId);

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  try {
    const snap = await getDoc(docRef);

    const updateData = {
      viewCount: increment(1),
      [`monthlyViews.${monthKey}`]: increment(1)
    };

    await setDoc(docRef, snap.exists() ? updateData : {
      ...updateData,
      path: path
    }, { merge: true });

    console.log("✅ Page view updated or created:", updateData);

  } catch (error) {
    console.error("🔥 Error tracking page view:", error);
  }
}
