import React, { useState } from 'react';
import './contact.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';
import { sendMessage } from '../utils/contact_firebase';

function Contact() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleCaptcha = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email, phone, message } = form;

    if (!first_name || !last_name || !email || !phone || !message) {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }

    if (!captchaVerified) {
      alert("يرجى التحقق من أنك لست روبوتاً");
      return;
    }

    await sendMessage(form);

    alert("✅ تم إرسال النموذج بنجاح");

    // إعادة ضبط النموذج
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      message: ""
    });

    setCaptchaVerified(false);
  };

  return (
    <>
      <div className="contact-page">
        
        <h2 className="contact-title">تواصل معنا</h2>

        <div className="info-map-wrapper">
          <div className="map-box">
            <iframe
              src="https://www.google.com/maps?q=طريق بيت حنينا 10, القدس, إسرائيل&z=15&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع المركز الجماهيري بيت حنينا"
            ></iframe>
          </div>

          <div className="contact-info">
            <h3>معلومات التواصل</h3>
            <p><FaMapMarkerAlt /> العنوان: אלמרכז 10, بيت حنينا, القدس</p>
            <p><FaPhoneAlt /> الهاتف: 02-1234567</p>
            <p><FaEnvelope /> البريد الإلكتروني: info@beit-hanina.org</p>

            <div className="working-hours">
              <h4><FaClock /> ساعات العمل:</h4>
              <p>الأحد - الأربعاء: 08:00 - 19:00</p>
              <p>الخميس: 08:00 - 13:00</p>
              <p>الجمعة والسبت: مغلق</p>
            </div>
          </div>
        </div>

        {/* 📝 نموذج التواصل */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>الاسم <span className="required">*</span></label>
              <input type="text" name="first_name" value={form.first_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>اسم العائلة <span className="required">*</span></label>
              <input type="text" name="last_name" value={form.last_name} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>البريد الإلكتروني <span className="required">*</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>رقم الهاتف <span className="required">*</span></label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row full-width">
            <div className="form-group">
              <label>موضوع الرسالة <span className="required">*</span></label>
              <textarea rows="4" name="message" value={form.message} onChange={handleChange} required></textarea>
            </div>
          </div>

          <div className="captcha-container">
            <ReCAPTCHA
              sitekey="6Le2DxsrAAAAAHoYVOpDRby_DGrmAQzu8IB32mdQ"
              onChange={handleCaptcha}
            />
          </div>

          <button type="submit">إرسال</button>
        </form>
      </div>
    </>
  );
}

export default Contact;