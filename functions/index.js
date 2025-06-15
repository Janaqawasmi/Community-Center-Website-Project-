const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// إعداد Nodemailer مع Gmail - الجيل الأول
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email?.user,
    pass: functions.config().email?.password
  }
});

// دالة إرسال رد على الاستفسار - الجيل الأول
exports.sendInquiryReply = functions.https.onCall(async (data, context) => {
  try {
    console.log('تم استدعاء Function بنجاح');
    
    const {
      customerEmail,
      customerName,
      replyText,
      originalMessage,
      inquiryId
    } = data;

    // التحقق من البيانات المطلوبة
    if (!customerEmail || !customerName || !replyText) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'بيانات ناقصة'
      );
    }

    console.log('إرسال البريد إلى:', customerEmail);

    // إعداد محتوى البريد
    const mailOptions = {
      from: `المركز الجماهيري <${functions.config().email?.user}>`,
      to: customerEmail,
      subject: 'رد على استفسارك - المركز الجماهيري',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
            <h1>🏛️ المركز الجماهيري</h1>
            <h2>رد على استفسارك</h2>
          </div>
          <div style="padding: 20px;">
            <p>السلام عليكم ${customerName}،</p>
            <p>شكراً لتواصلك معنا. إليك ردنا على استفسارك:</p>
            
            <div style="background: #f1f5f9; padding: 15px; margin: 15px 0; border-right: 4px solid #3b82f6;">
              <strong>استفسارك:</strong>
              <p>${originalMessage}</p>
            </div>
            
            <div style="background: #ecfdf5; padding: 15px; margin: 15px 0; border-right: 4px solid #10b981;">
              <strong>ردنا:</strong>
              <p>${replyText}</p>
            </div>
            
            <p>مع أطيب التحيات،<br>فريق المركز الجماهيري - بيت حنينا</p>
          </div>
        </div>
      `
    };

    // إرسال البريد
    await transporter.sendMail(mailOptions);
    console.log('تم إرسال البريد بنجاح');

    // تحديث قاعدة البيانات
    if (inquiryId) {
      await admin.firestore()
        .collection('contactMessages')
        .doc(inquiryId)
        .update({
          emailSent: true,
          emailSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
      console.log('تم تحديث قاعدة البيانات');
    }

    return { 
      success: true, 
      message: 'تم إرسال البريد بنجاح'
    };

  } catch (error) {
    console.error('خطأ في إرسال البريد:', error);
    throw new functions.https.HttpsError(
      'internal', 
      `فشل في إرسال البريد: ${error.message}`
    );
  }
});