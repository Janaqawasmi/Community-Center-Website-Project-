import { getStorage, ref, deleteObject } from "firebase/storage";

export const deleteImage = async (imageUrl) => {
  try {
    const storage = getStorage();

    // استخراج المسار داخل التخزين من الرابط
    const path = decodeURIComponent(
      imageUrl
        .split("?")[0]                // إزالة الاستعلامات
        .split("/o/")[1]              // أخذ الجزء بعد /o/
    );

    const imageRef = ref(storage, path);
    await deleteObject(imageRef);

    console.log("✅ تم حذف الصورة بنجاح من التخزين");
  } catch (error) {
    console.error("❌ فشل حذف الصورة:", error);
    throw error;
  }
};
