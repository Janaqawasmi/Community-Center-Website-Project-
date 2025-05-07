import { getDocs, collection } from "firebase/firestore";
import { db } from '../components/firebase'; 
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportRegistrationsToExcel = async () => {
  try {
    // 1. اجلب جميع البيانات من الـ collection
    const querySnapshot = await getDocs(collection(db, "registrations"));

    // 2. حوّل البيانات إلى مصفوفة من الكائنات (صفوف)
    const registrations = querySnapshot.docs.map(doc => doc.data());
    const formatted = registrations.map(item => ({
        cheackDigit: item.cheackDigit,
        id: item.id,
        lastName: item.lastName,         // اسم العائلة للابن
        FirstName: item.FirstName,
        gender: item.gender,
        birthdate: item.birthdate,
        address: item.address,
        cityCode: item.cityCode,
        landLine: item.landLine,
        personalPhone: item.personalPhone,
        fatherCheackDigit: item.fatherCheackDigit,
        fatherId: item.fatherId,
        fatherLastName: item.lastName,        // نفس القيمة، لكن باسم مختلف
        fatherName: item.fatherName,
        fatherPhone: item.fatherPhone
      }));
      

    if (registrations.length === 0) {
      alert("لا يوجد بيانات للتصدير");
      return;
    }

    // 3. أنشئ ورقة Excel
    const worksheet = XLSX.utils.json_to_sheet(formatted, {
        header: ["cheackDigit", "id", "lastName", "FirstName", "gender", "birthdate","address",
            "cityCode", "landLine","personalPhone","fatherCheackDigit","fatherId","fatherLastName","fatherName","fatherPhone" ]
      });

        worksheet["A1"].v = "ביקורת";
        worksheet["B1"].v = "ת.זהות";
        worksheet["C1"].v = "שם משפחה";
        worksheet["D1"].v = "שם פרטי";
        worksheet["E1"].v = "מין";
        worksheet["F1"].v = "תאריך לידה";
        worksheet["G1"].v = "כתובת";
        worksheet["H1"].v = "קוד עיר במשרד הפנים"
        worksheet["I1"].v = "טלפון";
        worksheet["J1"].v = "טלפון נייד";
        worksheet["K1"].v = "ביקורת ראש משפחה"
        worksheet["L1"].v = "ת.ז ראש משפחה";
        worksheet["M1"].v =  "משפחה ראש משפחה";
        worksheet["N1"].v = "פרטי ראש משפחה";
        worksheet["O1"].v =  "טלפון ראש משפחה";

          const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    // 4. أنشئ ملف بصيغة Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    // 5. احفظه في جهاز المستخدم
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "registrations.xlsx");

  } catch (error) {
    console.error("خطأ في التصدير:", error);
  }
};
