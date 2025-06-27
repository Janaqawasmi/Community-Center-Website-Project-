import { Grid, TextField, Button, Box } from "@mui/material";

function StepTwo({
  form,
  errors,
  handleValidatedChange,
  prevStep,
  isLoading,
  recaptchaToken,
}) {  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="اسم ولي الأمر باللغة العبرية"
          fullWidth
          variant="outlined"
          name="fatherName"
          value={form.fatherName}
          onChange={handleValidatedChange}
          error={!!errors.fatherName}
          helperText={errors.fatherName}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="اسم عائلة ولي الأمر باللغة العبرية"
          fullWidth
          variant="outlined"
          name="parentLastName"
          value={form.parentLastName}
          onChange={handleValidatedChange}
          error={!!errors.parentLastName}
          helperText={errors.parentLastName}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="رقم هوية ولي الأمر"
          fullWidth
          variant="outlined"
          name="fatherId"
          value={form.fatherId}
          onChange={handleValidatedChange}
          error={!!errors.fatherId}
          helperText={errors.fatherId}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="رقم هاتف ولي الأمر"
          fullWidth
          variant="outlined"
          name="fatherPhone"
          value={form.fatherPhone}
          onChange={handleValidatedChange}
          error={!!errors.fatherPhone}
          helperText={errors.fatherPhone}
        />
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="outlined" onClick={prevStep} size="large">
            السابق
          </Button>
        <Button
  variant="contained"
  color="primary"
  type="submit"
  size="large"
  disabled={isLoading || !recaptchaToken}
>
  {isLoading ? 'جاري الإرسال...' : 'إرسال'}
</Button>

        </Box>
      </Grid>
    </Grid>
  );
}

export default StepTwo;
