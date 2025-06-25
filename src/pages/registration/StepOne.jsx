import { Grid, TextField, Button, Box, MenuItem } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "./CustomDateInput";
import RequiredLabel from "./RequiredLabel";
import { calculateAge } from "../regist_logic";

function StepOne({ form, setForm, errors, setErrors, handleValidatedChange, handleChange, nextStep }) {
  const age = calculateAge(form.birthdate);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <TextField
          label={<RequiredLabel text="الاسم الشخصي باللغة العبرية" />}
          fullWidth
          variant="outlined"
          name="FirstName"
          value={form.FirstName}
          onChange={handleValidatedChange}
          error={!!errors.FirstName}
          helperText={errors.FirstName}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label={<RequiredLabel text="اسم العائلة باللغة العبرية" />}
          fullWidth
          variant="outlined"
          name="lastName"
          value={form.lastName}
          onChange={handleValidatedChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </Grid>

<Grid item xs={12} sm={6}>
  <DatePicker
  selected={form.birthdate ? new Date(form.birthdate) : null}
  onChange={(date) => {
    setForm((prev) => ({ ...prev, birthdate: date }));
    if (date) {
      setErrors((prev) => ({ ...prev, birthdate: "" }));
    }
  }}
  dateFormat="dd/MM/yyyy"
  maxDate={new Date()}
  customInput={
    <CustomDateInput
      error={!!errors.birthdate}
      helperText={errors.birthdate}
    />
  }
  showYearDropdown
  scrollableYearDropdown
  yearDropdownItemNumber={100}
  popperClassName="rtl-datepicker-popper"
  popperPlacement="bottom-end" // ✅ aligns it to the right
/>

</Grid>


      <Grid item xs={12} sm={6}>
        <TextField
          label={<RequiredLabel text="رقم الهوية" />}
          fullWidth
          variant="outlined"
          name="id"
          value={form.id}
          onChange={handleValidatedChange}
          error={!!errors.id}
          helperText={errors.id}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          select
          label={<RequiredLabel text="الجنس" />}
          fullWidth
          variant="outlined"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          error={!!errors.gender}
          helperText={errors.gender}
        >
          <MenuItem value="">اختر الجنس</MenuItem>
          <MenuItem value="ذكر">ذكر</MenuItem>
          <MenuItem value="أنثى">أنثى</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label={<RequiredLabel text="البريد الإلكتروني" />}
          fullWidth
          variant="outlined"
          name="email"
          value={form.email}
          onChange={handleValidatedChange}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label={<RequiredLabel text="رقم الهاتف" />}
          fullWidth
          variant="outlined"
          name="personalPhone"
          value={form.personalPhone}
          onChange={handleValidatedChange}
          error={!!errors.personalPhone}
          helperText={errors.personalPhone}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="الهاتف الأرضي"
          fullWidth
          variant="outlined"
          name="landLine"
          value={form.landLine}
          onChange={handleValidatedChange}
          error={!!errors.landLine}
          helperText={errors.landLine}
          inputProps={{ maxLength: 7 }}
          InputProps={{
            endAdornment: <span style={{ marginLeft: "20px", color: "#666" }}>02</span>
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          {age >= 18 ? (
            <Button variant="contained" color="primary" type="submit" size="large">
              إرسال
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={nextStep} size="large">
              التالي
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default StepOne;
