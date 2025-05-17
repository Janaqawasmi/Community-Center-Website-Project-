// src/hooks/useFetchPrograms.js

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../components/firebase";

export const useFetchPrograms = (categoryName) => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(
        query(collection(db, "programs"),where("category", "array-contains", categoryName)
      )
      );

      const data = snapshot.docs.map((doc) => { 
        const docData = doc.data();

        return {
          id: doc.id,
          ...docData,
          startDate: docData.startDate?.toDate?.() ?? null, // تحويل Timestamp إلى Date
        };
      });

      setPrograms(data);
    };

    fetchData();
  }, [categoryName]);

  return programs;
};
