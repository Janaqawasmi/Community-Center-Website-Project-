import { db } from '../components/firebase'; // تأكد أن مسار ملف firebase صحيح
import { doc, getDoc } from 'firebase/firestore';

// دالة لجلب معلومات التواصل من Firestore
export async function fetchSiteInfo() {
  const siteInfoRef = doc(db, "siteInfo", "9ib8qFqM732MnTlg6YGz"); // ID تبع الوثيقة في Firestore
  const siteInfoSnap = await getDoc(siteInfoRef);

  if (siteInfoSnap.exists()) {
    return siteInfoSnap.data(); // نرجع البيانات
  } else {
    throw new Error("Site info not found");
  }
}
