// src/hooks/useFetchEvents.js
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../components/firebase";

/**
 * @param {boolean} onlyFeatured - if true, returns only featured events
 */
export const useFetchEvents = (onlyFeatured = false) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Events"));

          const data = snapshot.docs.map((docSnap) => {
          const docData = docSnap.data();
          const startDate = docData.date?.toDate?.() ?? null;
          let time = docData.time;
          if (time?.toDate) time = time.toDate();
          return {
            id: docSnap.id,
            ...docData,
            startDate,
            time,
          };
        });

        // ✅ Filter here if needed
        const filtered = onlyFeatured
          ? data.filter((event) => event.featured === true)
          : data;
 // ✅ Sort by startDate (earliest first)
        filtered.sort((a, b) => (a.startDate || 0) - (b.startDate || 0));

        setEvents(filtered);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchData();
  }, [onlyFeatured]);

  return events;
};
