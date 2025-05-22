import { useState } from 'react';
import { validateField } from './regist_logic';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './registration.css';
import citiesData from '../assets/codes.json';
import Select from 'react-select';
import { useEffect } from "react";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { handleSubmit } from './submitRegistration'

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

  const [errors, setErrors] = useState({
    id: '',
    FirstName: '',
    lastName: '',
    fatherName: '',
    email: '',
    personalPhone: '',
    fatherPhone: '',
    landLine: '',
    fatherId: '',

  });



  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };



      if (name === "address") {
        const selectedCity = citiesData.find(city => city.hebrew_name.trim() === value.trim());
        updatedForm.cityCode = selectedCity ? selectedCity.code : '';
      }

      return updatedForm;
    });
  };

  const handleValidatedChange = (e) => {
    const { name } = e.target;
    const rawValue = e.target.value;
    const value = rawValue.trim(); // إزالة الفراغات الزائدة

    const error = validateField(name, value);

    if (!error) {
      setForm((prev) => {
        const updatedForm = { ...prev, [name]: value };

        if (name === "id") {
          updatedForm.cheackDigit = value ? (parseInt(value) % 10).toString() : '';
        }

        if (name === "fatherId") {
          updatedForm.fatherCheackDigit = value ? (parseInt(value) % 10).toString() : '';
        }

        return updatedForm;
      });

      setErrors((prev) => ({ ...prev, [name]: '' }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };




  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="registration-form">
        <h2>تسجيل</h2>
        <form onSubmit={(e) => handleSubmit(e, form, setForm)}>

          <label>الاسم الشخصي</label>
          <input type="text" name="FirstName" value={form.FirstName} onChange={handleValidatedChange} required placeholder="أدخل اسمك باللغة العبرية" />
          {errors.FirstName && <span style={{ color: 'red' }}>{errors.FirstName}</span>}



          <label>البريد الإلكتروني</label>
          <input type="text" name="email" value={form.email} onChange={handleValidatedChange} required />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}

          <label>رقم الهاتف</label>
          <input type="tel" name="personalPhone" value={form.personalPhone} onChange={handleValidatedChange} required />
          {errors.personalPhone && <span style={{ color: 'red' }}>{errors.personalPhone}</span>}

          <label>رقم الهوية</label>
          <input type="text" name="id" value={form.id} onChange={handleValidatedChange} required />
          {errors.id && <span style={{ color: 'red' }}>{errors.id}</span>}

          <label>تاريخ الميلاد</label>

          <DatePicker
            onKeyDown={(e) => e.preventDefault()} // prevent using keyboard to change date

            selected={form.birthdate ? new Date(form.birthdate) : null}
            onChange={(date) => {
              if (date && !isNaN(date)) {
                setForm(prev => ({ ...prev, birthdate: date }));
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
          <input type="text" name="lastName" value={form.lastName} onChange={handleValidatedChange} required placeholder="أدخل اسم العائلة باللغة العبرية" />
          {errors.lastName && <span style={{ color: 'red' }}>{errors.lastName}</span>}

          <label>اسم الأب</label>
          <input type="text" name="fatherName" value={form.fatherName} onChange={handleValidatedChange} required placeholder="أدخل اسم الأب باللغة العبرية" />
          {errors.fatherName && <span style={{ color: 'red' }}>{errors.fatherName}</span>}

          <label>رقم هاتف الأب</label>
          <input type="tel" name="fatherPhone" value={form.fatherPhone} onChange={handleValidatedChange} required />
          {errors.fatherPhone && <span style={{ color: 'red' }}>{errors.fatherPhone}</span>}

          <label>رقم هوية الأب</label>
          <input type="text" name="fatherId" value={form.fatherId} onChange={handleValidatedChange} required />
          {errors.fatherId && <span style={{ color: 'red' }}>{errors.fatherId}</span>}

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
              citiesData.find(city => city.hebrew_name.trim() === form.address)
                ? {
                  value: form.address,
                  label: form.address
                }
                : null
            }
            onChange={(selectedOption) => {
              if (!selectedOption) return;

              const selectedCity = citiesData.find(
                (city) => city.hebrew_name.trim() === selectedOption.value.trim()
              );

              setForm((prev) => ({
                ...prev,
                address: selectedOption.value,
                cityCode: selectedCity ? selectedCity.code : ''
              }));
            }}
            placeholder="اختر اسم المدينة"
            isClearable={false}
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
              onChange={handleValidatedChange}
              style={{ borderRadius: '0 5px 5px 0', border: '1px solid #ccc', flex: 1 }}
              placeholder="أدخل باقي الرقم"
              maxLength={7}
              required
            />
            {errors.landLine && <span style={{ color: 'red' }}>{errors.landLine}</span>}

          </div>

          <button type="submit" style={{ marginTop: '20px' }}>إرسال</button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;