import { getDocs, collection } from "firebase/firestore";
import { db } from '../components/firebase';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { updateRegistration } from "../pages/admin/AdminRegistrations/registrationService"; 

export const exportRegistrationsToExcel = async ({ selected = [], setSelected }) => {
  try {
    let registrations = [];

    if (selected.length > 0) {
      // 1. إذا تم تحديد سجلات
      registrations = selected;
    } else {
      // 2. إذا لم يتم التحديد: جلب كل التسجيلات من الكوليكشن
      const querySnapshot = await getDocs(collection(db, "programRegistrations"));
      registrations = querySnapshot.docs.map(doc => ({
        firebaseId: doc.id,
        collectionName: "programRegistrations",
        ...doc.data()
      }));
    }

    if (registrations.length === 0) {
      alert("لا يوجد بيانات للتصدير");
      return;
    }

    const formatted = registrations.map(item => ({
      cheackDigit: item.cheackDigit || "",
      id: item.id || "",
      lastName: item.lastName || "",
      FirstName: item.FirstName || "",
      gender: item.gender || "",
      birthdate: item.birthdate || "",
      address: item.address || "",
      cityCode: item.cityCode || "",
      landLine: item.landLine || "",
      personalPhone: item.personalPhone || "",
      classNumber: item.classNumber || "",
      digit5: item.digit5 || "",
      groupNumber: item.groupNumber || "",
      fatherCheackDigit: item.fatherCheackDigit || "",
      fatherId: item.fatherId || "",
      fatherLastName: item.parentLastName || "",
      fatherName: item.fatherName || "",
      fatherPhone: item.fatherPhone || "",
    }));

    const header = [
      "cheackDigit", "id", "lastName", "FirstName", "gender", "birthdate", "address",
      "cityCode", "landLine", "personalPhone", "classNumber", "digit5", "groupNumber",
      "fatherCheackDigit", "fatherId", "fatherLastName", "fatherName", "fatherPhone"
    ];

    const headerHebrew = [
      "ביקורת", "ת.זהות", "שם משפחה", "שם פרטי", "מין", "תאריך לידה", "כתובת",
      "קוד עיר במשרד הפנים", "טלפון", "טלפון נייד", "חוג", "ספרה 5", "קבוצה",
      "ביקורת ראש משפחה", "ת.ז ראש משפחה", "משפחה ראש משפחה", "פרטי ראש משפחה", "טלפון ראש משפחה"
    ];

    const worksheet = XLSX.utils.json_to_sheet(formatted, { header });

    headerHebrew.forEach((title, idx) => {
      const col = String.fromCharCode(65 + idx);
      worksheet[`${col}1`].v = title;
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const fileName = `Registrations_${dateStr}.xlsx`;

    saveAs(blob, fileName);

    // 3. بعد التصدير: تأشير الكل كمؤرشف
    await Promise.all(
      registrations.map(async reg => {
        const updated = { ...reg, archived: true };
        await updateRegistration(reg.collectionName || "programRegistrations", updated);
      })
    );

    if (setSelected) setSelected([]);

    alert("تم تصدير البيانات وتحديث حالتها كمؤرشفة بنجاح");

  } catch (error) {
    console.error("خطأ في التصدير:", error);
    alert("حدث خطأ أثناء التصدير");
  }
};
