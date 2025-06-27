import axios from "axios";
import { calculateAge } from './regist_logic';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 🔧 Remove last digit for validation
function removeLastDigit(num) {
  if (!num) return "";
  return num.toString().slice(0, -1);
}

// 🔧 Get Firestore collection info and backend URL
function getRegistrationInfo() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("programId")) {
    return {
      collectionName: "programRegistrations",
url: "https://us-central1-public-center-website.cloudfunctions.net/registerProgram",
      docId: params.get("programId"),
    };
  }

  if (params.has("eventId")) {
    return {
      collectionName: "eventRegistrations",
url: "https://us-central1-public-center-website.cloudfunctions.net/registerEvent",
      docId: params.get("eventId"),
    };
  }

  return { collectionName: null, url: null, docId: null };
}

export async function submitRegistration(e, formData, setForm) {
  e.preventDefault();

  // ✅ Keep your original logic to calculate age
  const age = calculateAge(formData.birthdate);
  const idWithoutLast = removeLastDigit(formData.id);
  const fatherIdWithoutLast = removeLastDigit(formData.fatherId);
  const checkDigit = formData.id.slice(-1);
  const fatherCheckDigit = formData.fatherId.slice(-1);

  const { collectionName, url, docId } = getRegistrationInfo();

  if (!collectionName || !url || !docId) {
    return { success: false, reason: "invalid_collection" };
  }

  // ✅ Prepare your formatted registration object as before
  let formattedForm = {
    ...formData,
    recaptchaToken: formData.recaptchaToken,
    id: idWithoutLast,
    cheackDigit: checkDigit,
    fatherId: fatherIdWithoutLast,
    fatherCheackDigit: fatherCheckDigit,
    birthdate: formData.birthdate
      ? formData.birthdate.toLocaleDateString("en-GB")
      : "",
    landLine: formData.landLine ? `02${formData.landLine}` : "",
    registrationDate: new Date().toLocaleString("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    }),
    archived: false,
    docId: docId, // 🔑 important for backend duplicate checking
  };

  if (age >= 18) {
    formattedForm = {
      ...formattedForm,
      fatherName: formData.FirstName,
      parentLastName: formData.lastName,
      fatherId: idWithoutLast,
      fatherPhone: formData.personalPhone,
      fatherCheackDigit: checkDigit,
    };
  }

  
  NProgress.start(); // ✅ Start the loading bar

  try {
    // ✅ Send the data to your backend Cloud Function instead of Firestore
    const response = await axios.post(url, formattedForm);

    if (response.data.success) {
      if (setForm) {
        setForm({
          FirstName: "",
          birthdate: "",
          id: "",
          cheackDigit: "",
          email: "",
          personalPhone: "",
          lastName: "",
          gender: "",
          address: "",
          cityCode: "",
          landLine: "",
          fatherCheackDigit: "",
          fatherId: "",
          fatherName: "",
          fatherPhone: "",
          parentLastName: "",
          docId: "",
        });
      }
      return { success: true };


    } else if (response.data.reason === "duplicate") {
  return { success: false, reason: "duplicate" };
} 


else {
      return { success: false, reason: "error" };
    }
} catch (error) {
  if (
    error.response?.status === 409 &&
    error.response?.data?.reason === "duplicate"
  ) {
    // Don't log this as a console error because it's expected
    return { success: false, reason: "duplicate" };
  }

  console.error("❌ خطأ أثناء إرسال البيانات:", error);
  return { success: false, reason: "error" };
} finally {
  NProgress.done(); // ✅ Stop the loading bar
}

}

}
