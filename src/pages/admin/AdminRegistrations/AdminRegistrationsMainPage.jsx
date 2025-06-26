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
        <Box sx={{ display: 'flex', gap: 2  }}>
          <Button
            variant="contained"
            color="primary"
           onClick={() => setOpenDialog(true)}            
          >
            إضافة تسجيل جديد
          </Button>
 </Box>
 <AddNewRegistration open={openDialog} onClose={() => setOpenDialog(false)} />


<Box sx={{ display: 'flex', justifyContent: 'flex-start', mr:138, mt:-4}}>

          {/* زر عرض الأرشيف (يظهر إذا كنا في العرض العادي) */}
          {!archivedOnly && (
            
            <Button 
              variant="outlined"
              color="secondary"
              onClick={() => {
                setArchivedOnly(true);
                // نعيد اختيار التبويب الأول لتجنّب بقاء أي تبويب مفعل
                setTab(0);
              }}
            >
أرشيف التسجيلات
            </Button>
          )}

          {/* زر العودة للعرض العادي */}
          {archivedOnly && (
            <Button 
              variant="outlined"
              onClick={() => {
                setArchivedOnly(false);
              }}
            >
العودة للتسجيلات الحالية
            </Button>
          )}
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
