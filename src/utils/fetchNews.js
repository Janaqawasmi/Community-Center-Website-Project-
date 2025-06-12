// src/utils/fetchNews.js
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const fetchNews = async (featuredOnly = false) => {
  const db = getFirestore();
  const newsColRef = collection(db, 'News');
  const newsQuery = featuredOnly
    ? query(newsColRef, where("featured", "==", true))
    : newsColRef;

  const snapshot = await getDocs(newsQuery);
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    isNews: true,
    name: doc.data().title,
    description: doc.data().full_description,
    imageUrl: doc.data().image,
  }));
  return data;
};

export { fetchNews };
