// src/utils/fetchNews.js
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const fetchNews = async () => {
  const db = getFirestore();
  const newsColRef = collection(db, 'News');
  const snapshot = await getDocs(newsColRef);
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return data;
};

export { fetchNews };
