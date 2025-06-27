import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from "@mui/material";

/**
 * مكوّن شريط الفلترة العام
 * Props:
 * - classNumber, setClassNumber
 * - groupNumber, setGroupNumber
 * - paidOnly, setPaidOnly
 * - search, setSearch
 * - classOptions, groupOptions
 */
export default function RegistrationsFilterBar({
  classNumber,
  setClassNumber,
  groupNumber,
  setGroupNumber,
  paidOnly,
  setPaidOnly,
  search,
  setSearch,
  classOptions,
  groupOptions
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
      {/* رقم الدورة */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="filter-class-label">رقم الدورة</InputLabel>
        <Select
          labelId="filter-class-label"
          label="رقم الدورة"
          value={classNumber}
          onChange={e => setClassNumber(e.target.value)}
        >
          <MenuItem value="">الكل</MenuItem>
          {classOptions.map(num => (
            <MenuItem key={num} value={num}>{num}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* رقم المجموعة */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="filter-group-label">رقم المجموعة</InputLabel>
        <Select
          labelId="filter-group-label"
          label="رقم المجموعة"
          value={groupNumber}
          onChange={e => setGroupNumber(e.target.value)}
        >
          <MenuItem value="">الكل</MenuItem>
          {groupOptions.map(num => (
            <MenuItem key={num} value={num}>{num}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* حالة الدفع */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="filter-paid-label">حالة الدفع</InputLabel>
        <Select
          labelId="filter-paid-label"
          label="حالة الدفع"
          value={paidOnly === null ? '' : paidOnly ? 'paid' : 'unpaid'}
          onChange={e => setPaidOnly(e.target.value === '' ? null : e.target.value === 'paid')}
        >
          <MenuItem value="">الكل</MenuItem>
          <MenuItem value="paid">مدفوع</MenuItem>
          <MenuItem value="unpaid">غير مدفوع</MenuItem>
        </Select>
      </FormControl>

      {/* حقل البحث */}
      <TextField
        size="small"
        label="بحث..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ minWidth: 200 }}
      />
    </Box>
  );
}
