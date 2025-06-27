import React from "react";
import { TextField } from "@mui/material";
import RequiredLabel from "./RequiredLabel";

const CustomDateInput = React.forwardRef(({ value, onClick, error, helperText }, ref) => (
  <TextField
    fullWidth
    variant="outlined"
    size="medium"
    label={<RequiredLabel text="تاريخ الميلاد" />}
    value={value || ''}
    onClick={onClick}
    inputRef={ref}
    inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
    sx={{
      '& .MuiInputBase-root': {
        height: '56px',
        fontSize: '1rem',
        paddingLeft: '150px', // ✅ RTL fix
      },
      '& .MuiInputLabel-root': {
        fontSize: '1rem',
      },
    }}
    error={error}
    helperText={helperText}
  />
));

CustomDateInput.displayName = "CustomDateInput";
export default CustomDateInput;
