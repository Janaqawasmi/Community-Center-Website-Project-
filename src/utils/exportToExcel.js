import { getDocs, collection } from "firebase/firestore";
import { db } from '../components/firebase';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportRegistrationsToExcel = async () => {
  try {
    // 1. جلب البيانات
    const querySnapshot = await getDocs(collection(db, "programRegistrations"));
    const registrations = querySnapshot.docs.map(doc => doc.data());

    if (registrations.length === 0) {
      alert("لا يوجد بيانات للتصدير");
      return;
    }

    // 2. ترتيب الحقول بنفس الترتيب المرغوب
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
      fatherLastName: item.parentLastName || "", // أو عدل حسب اسم الحقل في بياناتك
      fatherName: item.fatherName || "",
      fatherPhone: item.fatherPhone || "",
    }));

    // 3. ترتيب الهيدر (يجب أن يطابق الحقول في formatted)
    const header = [
      "cheackDigit", "id", "lastName", "FirstName", "gender", "birthdate", "address",
      "cityCode", "landLine", "personalPhone", "classNumber", "digit5", "groupNumber",
      "fatherCheackDigit", "fatherId", "fatherLastName", "fatherName", "fatherPhone"
    ];

    // 4. العناوين بالعبرية
    const headerHebrew = [
      "ביקורת",               // cheackDigit
      "ת.זהות",               // id
      "שם משפחה",             // lastName
      "שם פרטי",              // FirstName
      "מין",                  // gender
      "תאריך לידה",           // birthdate
      "כתובת",                // address
      "קוד עיר במשרד הפנים",   // cityCode
      "טלפון",                // landLine
      "טלפון נייד",           // personalPhone
      "חוג",                  // classNumber
      "ספרה 5",               // digit5
      "קבוצה",                // groupNumber
      "ביקורת ראש משפחה",     // fatherCheackDigit
      "ת.ז ראש משפחה",        // fatherId
      "משפחה ראש משפחה",      // fatherLastName
      "פרטי ראש משפחה",       // fatherName
      "טלפון ראש משפחה"       // fatherPhone
    ];

    // 5. إنشاء ورقة الإكسل مع الهيدر الإنجليزي (لترتيب الأعمدة)
    const worksheet = XLSX.utils.json_to_sheet(formatted, { header });

    // 6. تعديل الصف الأول ليحمل العناوين العبرية
    headerHebrew.forEach((title, idx) => {
      const col = String.fromCharCode(65 + idx); // A, B, C, ...
      worksheet[`${col}1`].v = title;
    });

    // 7. إنشاء ملف Excel وتصديره
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // 8. توليد اسم الملف مع التاريخ الحالي بالشكل Registrations_yyyy-mm-dd.xlsx
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const fileName = `Registrations_${dateStr}.xlsx`;

    // 9. حفظ الملف
    saveAs(blob, fileName);

  } catch (error) {
    console.error("خطأ في التصدير:", error);
    alert("حدث خطأ أثناء التصدير");
  }
};
