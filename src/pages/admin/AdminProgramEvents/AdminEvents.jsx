import AdminItemsManager from './AdminItemsManager';
import AdminDashboardLayout from "../../../components/AdminDashboardLayout";

export default function AdminEvents() {
  return (
            <AdminDashboardLayout>

    <AdminItemsManager
      collectionName="Events"
      itemLabel="الفعاليات"
      fields={[
        { name: "name", label: "اسم الفعالية", required: true },
        { name: "price", label: "السعر", required: true, type: "number" },
        { name: "capacity", label: "عدد المقاعد", required: true, type: "number" },
        { name: "classNumber", label: "חוג", required: true },
        { name: "groupNumber", label: "קבוצה", required: true },
        { name: "digit5", label: "ספרה 5", required: true },
        { name: "description", label: "الوصف" },
        { name: "location", label: "المكان" },
        { name: "date", label: "تاريخ الفعالية", type: "date" },
        { name: "time", label: "وقت الفعالية", type: "time" },
      ]}
      filters={["classNumber", "groupNumber", "featured"]}
    />
            </AdminDashboardLayout>

  );
}
