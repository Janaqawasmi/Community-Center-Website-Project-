import { useState } from 'react';
import { validatePhoneNumber, validateEmail, isValidIsraeliID, validateLandLineNumber, validateHebrewName } from './regist_logic';
import { submitRegistration } from './submitRegistration';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './registration.css';
import citiesData from '../assets/codes.json'; 
import Select from 'react-select';

function RegistrationForm() {
  const [form, setForm] = useState({
    FirstName: '',
    birthdate: '',
    id: '',
    cheackDigit: '',
    email: '',
    personalPhone: '',
    lastName: '',
    gender: '',
    address: 'ירושלים',
    cityCode: '3000',
    landLine: '',
    fatherCheackDigit: '',
    fatherId: '',
    fatherName: '',
    fatherPhone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };

      if (name === "id") {
        updatedForm.cheackDigit = value ? (parseInt(value) % 10).toString() : '';
      }

      

      if (name === "fatherId") {
        updatedForm.fatherCheackDigit = value ? (parseInt(value) % 10).toString() : '';
      }

      if (name === "address") {
        const selectedCity = citiesData.find(city => city.hebrew_name.trim() === value.trim());
        updatedForm.cityCode = selectedCity ? selectedCity.code : '';
      }

      return updatedForm;
    });
  };

  const handleDateChange = (date) => {
    setForm(prev => ({ ...prev, birthdate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(form.personalPhone)) {
      alert('رقم الهاتف يجب أن يبدأ بـ 05 ويكون مكونًا من 10 أرقام.');
      return;
    }

    if (!validatePhoneNumber(form.fatherPhone)) {
      alert('رقم الهاتف يجب أن يبدأ بـ 05 ويكون مكونًا من 10 أرقام.');
      return;
    }

    if (!isValidIsraeliID(form.id)) {
      alert('رقم الهوية غير صحيح.');
      return;
    }

    if (!isValidIsraeliID(form.fatherId)) {
      alert('رقم الهوية غير صحيح.');
      return;
    }

    if (!validateEmail(form.email)) {
      alert('البريد الإلكتروني غير صحيح');
      return;
    }

    if (!(validateLandLineNumber(form.landLine))) {
      alert('رقم الهاتف الأرضي يجب أن يتكون من 7 أرقام');
      return;
    }

    if (!validateHebrewName(form.FirstName)) {
      alert('الاسم الشخصي يجب أن يكون باللغة العبرية');
      return;
    }
    if (!validateHebrewName(form.lastName)) {
      alert('اسم العائلة يجب أن يكون باللغة العبرية');
      return;
    }
    if (!validateHebrewName(form.fatherName)) {
      alert('اسم الأب يجب أن يكون باللغة العبرية');
      return;
    }

    try {
      await submitRegistration(form);
      alert('تم التسجيل وحفظ البيانات بنجاح!');
      console.log('تم حفظ البيانات:', form);
      setForm({
        FirstName: '',
        birthdate: '',
        id: '',
        cheackDigit: '',
        email: '',
        personalPhone: '',
        lastName: '',
        gender: '',
        address: '',
        cityCode: '',
        landLine: '',
        fatherCheackDigit: '',
        fatherId: '',
        fatherName: '',
        fatherPhone: '',
      });
    } catch (error) {
      console.error('خطأ أثناء حفظ البيانات:', error);
      alert('حدث خطأ أثناء حفظ البيانات');
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="registration-form">
        <h2>تسجيل</h2>
        <form onSubmit={handleSubmit}>

          <label>الاسم الشخصي</label>
          <input type="text" name="FirstName" value={form.FirstName} onChange={handleChange} required />

          <label>البريد الإلكتروني</label>
          <input type="text" name="email" value={form.email} onChange={handleChange} required />

          <label>رقم الهاتف</label>
          <input type="tel" name="personalPhone" value={form.personalPhone} onChange={handleChange} required />

          <label>رقم الهوية</label>
          <input type="text" name="id" value={form.id} onChange={handleChange} required />

          <label>تاريخ الميلاد</label>
          <DatePicker
  selected={form.birthdate}
  onChange={handleDateChange}
  onChangeRaw={(e) => {
    const value = e.target.value;
    const [day, month, year] = value.split('/');
    if (day && month && year) {
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date)) {
        setForm(prev => ({ ...prev, birthdate: date }));
      }
    }
  }}
  dateFormat="dd/MM/yyyy"
  maxDate={new Date()}
  showYearDropdown
  scrollableYearDropdown
  yearDropdownItemNumber={100}
  placeholderText="DD/MM/YYYY"
  autoComplete="off"
  required
/>

          <label>اسم العائلة</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />

          <label>اسم الأب</label>
          <input type="text" name="fatherName" value={form.fatherName} onChange={handleChange} required />

          <label>رقم هاتف الأب</label>
          <input type="tel" name="fatherPhone" value={form.fatherPhone} onChange={handleChange} required />

          <label>رقم هوية الأب</label>
          <input type="text" name="fatherId" value={form.fatherId} onChange={handleChange} required />

          <label>الجنس</label>
          <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">اختر الجنس</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>

          <label>اسم المدينة</label>
<Select
  options={citiesData.map(city => ({
    value: city.hebrew_name.trim(),
    label: city.hebrew_name.trim()
  }))}
  name="address"
  value={
    form.address
      ? { label: form.address, value: form.address }
      : { label: "ירושלים", value: "ירושלים" }
  }
  onChange={(selectedOption) => {
    const selectedCity = citiesData.find(
      (city) => city.hebrew_name.trim() === selectedOption.value.trim()
    );
    setForm((prev) => ({
      ...prev,
      address: selectedOption.value,
      cityCode: selectedCity ? selectedCity.code : '',
    }));
  }



}
  placeholder="اختر اسم المدينة"
  isClearable
/>

          <label>الهاتف الأرضي</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ padding: '8px', backgroundColor: '#eee', border: '1px solid #ccc', borderRight: 'none', borderRadius: '5px 0 0 5px' }}>
              02
            </span>
            <input
              type="tel"
              name="landLine"
              value={form.landLine}
              onChange={handleChange}
              style={{ borderRadius: '0 5px 5px 0', border: '1px solid #ccc', flex: 1 }}
              placeholder="أدخل باقي الرقم"
              maxLength={7}
              required
            />
          </div>

          <button type="submit" style={{ marginTop: '20px' }}>إرسال</button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;