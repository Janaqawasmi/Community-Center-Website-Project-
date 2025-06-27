const buildEmailHtml = (userName, title, itemsHtml, siteInfo) => `
  <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, sans-serif; color: #333;">
    <h2 style="color: #4A148C;">مرحبًا ${userName}،</h2>
    <p>شكرًا لتسجيلك في ${title} التالي:</p>
    <ul style="line-height: 1.8;">
      ${itemsHtml}
    </ul>
    <p>نتطلع لرؤيتك قريبًا بإذن الله 🌟</p>
    <hr style="margin: 30px 0;" />
    <div style="font-size: 13px; color: #444;">
      <p><strong>📍 العنوان:</strong> ${siteInfo.address || ''}</p>
      <p><strong>📞 الهاتف:</strong> ${siteInfo.phone_number || ''}</p>
      <p><strong>📧 البريد الإلكتروني:</strong> ${siteInfo.email}</p>
      <p><strong>📸 إنستغرام:</strong> <a href="${siteInfo.instagramLink}" target="_blank">${siteInfo.instagramLink}</a></p>
      <p><strong>📘 فيسبوك:</strong> <a href="${siteInfo.FacebookLink}" target="_blank">${siteInfo.FacebookLink}</a></p>
    </div>
    <div style="margin-top: 30px;">
      <img src="${siteInfo.logo_url}" alt="شعار المركز" style="max-width: 120px;" />
    </div>
  </div>
`;

module.exports = { buildEmailHtml };
