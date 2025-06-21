import { db } from '../components/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const fetchSections = async () => {
  const sectionsSnapshot = await getDocs(collection(db, 'sections'));
  return sectionsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
