// filterUtils.js
// يحتوي هذا الملف على دوال فلترة عامة قابلة للاستخدام مع أي بيانات تسجيل

// دالة استخراج القيم الفريدة من الحقول
export const getUniqueValues = (data, key) =>
  [...new Set(data.map(r => r[key]).filter(Boolean))];

// دالة الفلترة حسب الفلاتر المختلفة
export const filterRegistrations = (data, { classNumber, groupNumber, search, paidOnly, archivedOnly }) => {
  let filtered = data;
  if (classNumber) filtered = filtered.filter(r => r.classNumber?.toString() === classNumber.toString());
  if (groupNumber) filtered = filtered.filter(r => r.groupNumber?.toString() === groupNumber.toString());
  if (paidOnly !== null && paidOnly !== undefined) filtered = filtered.filter(r => !!r.paid === paidOnly);
  // هنا التعديل: إذا كان archivedOnly محددًا (true/false) نفلتر على الحقل archive
  if (archivedOnly !== null && archivedOnly !== undefined) filtered = filtered.filter(r => !!r.archived === archivedOnly);
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(r =>
      (r.FirstName  && r.FirstName .toLowerCase().includes(q)) ||
      (r.lastName   && r.lastName  .toLowerCase().includes(q)) ||
      (r.fatherName && r.fatherName.toLowerCase().includes(q)) ||
      (r.id         && r.id.toString().includes(q)) ||
      (r.fatherId   && r.fatherId.toString().includes(q)) ||
      (r.email      && r.email.toLowerCase().includes(q)) ||
      (r.name       && r.name.toLowerCase().includes(q)) ||
      (r.personalPhone && r.personalPhone.toString().includes(q))
    );
  }
  return filtered;
};

// دالة لترتيب التسجيلات حسب تاريخ التسجيل
export const sortRegistrationsByDate = (data, order = "desc") => {
  return [...data].sort((a, b) => {
    const dateA = new Date(
      a.createdAt?.seconds
        ? a.createdAt.toDate?.() ?? new Date(a.createdAt.seconds * 1000)
        : a.createdAt
    );
    const dateB = new Date(
      b.createdAt?.seconds
        ? b.createdAt.toDate?.() ?? new Date(b.createdAt.seconds * 1000)
        : b.createdAt
    );
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};
