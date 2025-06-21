// src/hooks/useFetchEvents.js

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../components/firebase";

export const useFetchEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب كل الفعاليات بدون أي فلترة
        const snapshot = await getDocs(collection(db, "Events"));

        const data = snapshot.docs.map((docSnap) => {
          const docData = docSnap.data();
          // دعم تحويل time إلى Date إذا كان Timestamp
          let time = docData.time;
          if (time?.toDate) {
            time = time.toDate();
          }
          return {
            id: docSnap.id,
            ...docData,
            time,
          };
        });

        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchData();
  }, []);

  return events;
};
