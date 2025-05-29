import { useState, useEffect } from "react";
import { db } from "../../../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const useFeaturedPrograms = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, "programs"),
          where("featured", "==", true)
        );
        const snapshot = await getDocs(q);
        const featuredList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrograms(featuredList);
      } catch (error) {
        console.error("Error fetching featured programs:", error);
      }
    };

    fetchFeatured();
  }, []);

  return programs;
};
