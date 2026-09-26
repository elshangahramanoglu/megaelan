const apiKey = '1sk_XtQu6PLh70ouC33edEIvDuRXUVZMi37SLdsOP250YHpLSBxYkmoPCdx5bJDf1e5yZ0E67DUvFVk2LTTUNriXsx';
fetch('https://1sms.az/api/v1/sms/otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  },
  body: JSON.stringify({
    to: "+994000000000",
    text: "123456",
    senderName: "1sms.az"
  })
}).then(res => res.json()).then(console.log).catch(console.error);
