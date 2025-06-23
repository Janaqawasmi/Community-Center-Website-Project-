import { db } from '../components/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export const fetchSections = async () => {
  const q = query(collection(db, 'sections'), orderBy('order'));
  const sectionsSnapshot = await getDocs(q);

  return sectionsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
