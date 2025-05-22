import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../components/firebase";

export default function useAdminRole() {
  const [user, loadingUser] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role);
        } else {
          setRole("user");
        }
      } else {
        setRole(null);
      }
      setLoadingRole(false);
    };

    fetchRole();
  }, [user]);

  return { user, role, loading: loadingUser || loadingRole };
}
