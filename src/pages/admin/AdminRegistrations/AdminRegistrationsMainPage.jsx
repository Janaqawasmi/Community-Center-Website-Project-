// AdminProgramAndEventRegistrations.jsx
// ملف يضم الجدولين في تبويبات: دورات، فعاليات

import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import AdminRegistrationsTable from "./AdminRegistrationsTable";
import AdminDashboardLayout from "../../../components/AdminDashboardLayout";
import AdminAllRegistrationsPage from "./AdminAllRegistrationsPage";

export default function AdminRegistrationsMainPage() {
  const [tab, setTab] = useState(0);

  return (
    <AdminDashboardLayout>
      
      <Box sx={{ p: 4 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="تسجيلات الدورات" />
          <Tab label="تسجيلات الفعاليات" />
            <Tab label="كل التسجيلات" />

          
        </Tabs>
        {tab === 0 && <AdminRegistrationsTable collectionName="programRegistrations" label="تسجيلات الدورات" />}
        {tab === 1 && <AdminRegistrationsTable collectionName="eventRegistrations" label="تسجيلات الفعاليات" />}
        {tab === 2 && <AdminAllRegistrationsPage />}

        
        
        
      </Box>
    </AdminDashboardLayout>

    
  );
}
