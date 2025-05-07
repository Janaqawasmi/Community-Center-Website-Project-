
import { useEffect } from "react";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export function useAnonymousAuth() {
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth)
          .then(res => console.log("✅ Anonymous UID:", res.user.uid))
          .catch(err => console.error("❌ Failed", err));
      } else {
        console.log("🟢 Already signed in:", user.uid);
      }
    });
  }, []);
}
