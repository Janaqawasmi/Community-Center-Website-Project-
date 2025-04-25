// src/pages/Registration.jsx
import { useState } from 'react';
import { validatePhoneNumber } from '../pages/regist_logic';

function Registration() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  // Validations
  if (!validatePhoneNumber(form.phone)) {
    alert('رقم الهاتف يجب أن يبدأ بـ 05 ويكون مكونًا من 10 أرقام.');
    return;
  }

 
  // If all validations pass:
  console.log('Form submitted:', form);
  alert('تم التسجيل بنجاح!');
};


  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>تسجيل</h2>
      <form onSubmit={handleSubmit}>
        <label>الاسم الكامل:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>البريد الإلكتروني:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>رقم الهاتف:</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label>رسالة أو ملاحظات:</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
        ></textarea>

        <button type="submit">إرسال</button>
      </form>
    </div>
  );
}

export default Registration;
