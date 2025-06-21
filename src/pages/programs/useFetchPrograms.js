// src/hooks/useFetchPrograms.js

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../components/firebase";

export const useFetchPrograms = (categoryName) => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all programs that match the category
        const snapshot = await getDocs(
          query(collection(db, "programs"), where("category", "array-contains", categoryName))
        );

        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const docData = docSnap.data();
            const startDate = docData.startDate?.toDate?.() ?? null;

            // Fetch the corresponding lineColor from heroSection
            let lineColor = " #004e92";
            try {
              const heroRef = doc(db, "heroSection", categoryName);
              const heroSnap = await getDoc(heroRef);
              if (heroSnap.exists()) {
                const bgGradient = heroSnap.data().bgGradient;
                lineColor = bgGradient || lineColor;
              }
            } catch (err) {
              console.warn("Could not fetch heroSection for category:", categoryName, err);
            }

            return {
              id: docSnap.id,
              ...docData,
              startDate,
              lineColor,
            };
          })
        );

        setPrograms(data);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };

    fetchData();
  }, [categoryName]);

  return programs;
};
