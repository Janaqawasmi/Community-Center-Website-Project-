// AdminRegistrationsMainPage.jsx
import React, { useState } from "react";
import { Box, Tabs, Tab, Button } from "@mui/material";
import AdminRegistrationsTable from "./AdminRegistrationsTable";
import AdminDashboardLayout from "../../../components/AdminDashboardLayout";
import AddNewRegistration from "./AddNewRegistration";

export default function AdminRegistrationsMainPage() {
  const [tab, setTab] = useState(0);
  const [archivedOnly, setArchivedOnly] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);


  return (
    <AdminDashboardLayout>
      <Box sx={{ p: 4 }}>
        {/* أزرار الإضافة وتبديل العرض */}
        {!archivedOnly && (
        <Box sx={{ display: 'flex', gap: 2  }}>
          <Button
            variant="contained"
            color="primary"
           onClick={() => setOpenDialog(true)}            
          >
            إضافة تسجيل جديد
          </Button>
 </Box>
 )}
 
 <AddNewRegistration open={openDialog} onClose={() => setOpenDialog(false)} />


<Box sx={{ display: 'flex', justifyContent: 'flex-start', mr: 135, mt: -2 }}>
  <Button
    variant="outlined"
    sx={{ width: 180, textAlign: 'center' }} // ⬅️ عرض ثابت لمنع التحرك
    color={archivedOnly ? "primary" : "secondary"}
    onClick={() => {
      if (archivedOnly) {
        setArchivedOnly(false);
      } else {
        setArchivedOnly(true);
        setTab(0);
      }
    }}
  >
    {archivedOnly ? "العودة للتسجيلات الحالية" : "أرشيف التسجيلات"}
  </Button>
</Box>


        {/* إذا كنا في العرض العادي، نظهر التبويبات */}
        {!archivedOnly && (
          <>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{ mb: 2 }}
            >
              <Tab label="كل التسجيلات" />
              <Tab label="تسجيلات الدورات" />
              <Tab label="تسجيلات الفعاليات" />
            </Tabs>

            {tab === 0 && (
  <AdminRegistrationsTable
    collectionName="all"
    label="كل التسجيلات"
    archivedOnly={false}
  />
)}

            {tab === 1 && (
              <AdminRegistrationsTable
                collectionName="programRegistrations"
                label="تسجيلات الدورات"
                archivedOnly={false}
              />
            )}
            {tab === 2 && (
              <AdminRegistrationsTable
                collectionName="eventRegistrations"
                label="تسجيلات الفعاليات"
                archivedOnly={false}
              />
            )}
          </>
        )}

        {/* إذا كنا في وضع الأرشيف، نختفي التبويبات ونظهر كل التسجيلات المؤرشفة */}
        {archivedOnly && (
  <AdminRegistrationsTable
    collectionName="all"
    archivedOnly={true}
    label="أرشيف التسجيلات"
  />
)}

      </Box>
    </AdminDashboardLayout>
  );
}
