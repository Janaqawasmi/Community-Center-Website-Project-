// src/components/layout/common/DateRangePicker.jsx
import React from 'react';
import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function DateRangePicker({ fromDate, toDate, setFromDate, setToDate }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" gap={1} mb={2} dir="rtl">
        <DatePicker
          label="من تاريخ"
          value={fromDate}
          onChange={setFromDate}
renderInput={(params) => (
  <TextField
    {...params}
    fullWidth
    inputProps={{
      ...params.inputProps,
      style: {
        textAlign: "right",
        direction: "rtl",
      },
    }}
    InputLabelProps={{
      ...params.InputLabelProps,
      style: {
        right: 20,
        left: "auto",
        transformOrigin: "top right",
      },
    }}
  />
)}
        />
        <DatePicker
          label="إلى تاريخ"
          value={toDate}
          onChange={setToDate}
renderInput={(params) => (
  <TextField
    {...params}
    fullWidth
    inputProps={{
      ...params.inputProps,
      style: {
        textAlign: "right",
        direction: "rtl",
      },
    }}
    InputLabelProps={{
      ...params.InputLabelProps,
      style: {
        right: 20,
        left: "auto",
        transformOrigin: "top right",
      },
    }}
  />
)}
        />
      </Box>
    </LocalizationProvider>
  );
}
