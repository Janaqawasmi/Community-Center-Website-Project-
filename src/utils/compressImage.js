import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.2,              // الحد الأقصى للحجم (مثلاً 200 كيلوبايت)
    maxWidthOrHeight: 1024,      // تقليل الأبعاد إن كانت كبيرة
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("فشل ضغط الصورة:", error);
    return file; // في حال الفشل نعيد الصورة الأصلية
  }
};