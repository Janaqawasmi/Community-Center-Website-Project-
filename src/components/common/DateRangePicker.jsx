// src/components/layout/common/DateRangePicker.jsx
import React from 'react';
import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function DateRangePicker({ fromDate, toDate, setFromDate, setToDate }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" gap={2} mb={2}>
        <DatePicker
          label="من تاريخ"
          value={fromDate}
          onChange={setFromDate}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          label="إلى تاريخ"
          value={toDate}
          onChange={setToDate}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </LocalizationProvider>
  );
}