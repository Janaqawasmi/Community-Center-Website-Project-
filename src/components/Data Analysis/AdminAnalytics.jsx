//src/components/Data Analysis/AdminAnalytics.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

export default function PageViewsStats() {
  const [pageViews, setPageViews] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPageViews() {
      const snapshot = await getDocs(collection(db, "pageViews"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPageViews(data);
    }
    fetchPageViews();
  }, []);

  const filteredViews = pageViews.filter((page) => {
    const readablePath = page.path
      ? decodeURIComponent(page.path)
      : "/" + decodeURIComponent(page.id);
    return readablePath.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Box sx={{ p: 3 }}>
    
      <TextField
        label="ابحث عن مسار..."
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>المسار</strong>
            </TableCell>
            <TableCell align="right">
              <strong>عدد المشاهدات</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredViews.map((page) => (
            <TableRow key={page.id}>
              <TableCell>
                {page.path
                  ? decodeURIComponent(page.path)
                  : "/" + decodeURIComponent(page.id)}
              </TableCell>
              <TableCell align="right">{page.viewCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
