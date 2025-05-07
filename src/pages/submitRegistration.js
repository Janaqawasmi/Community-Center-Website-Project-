import { db } from '../components/firebase';
import { collection, addDoc } from 'firebase/firestore';



import { getAuth } from "firebase/auth";
console.log(getAuth().currentUser);

export async function submitRegistration(form) {
  const formattedForm = {
    ...form,
    birthdate: form.birthdate ? form.birthdate.toLocaleDateString('en-GB') : '',
    landLine: form.landLine ? `02${form.landLine.replace(/^0+/, '')}` : '',
  };

  await addDoc(collection(db, "registrations"), formattedForm);
}


