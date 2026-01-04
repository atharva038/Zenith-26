import {sendEmail} from "../config/email.js";

// Common email styles
const emailStyles = `
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px 20px;
    text-align: center;
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
  }
  .header .subtitle {
    margin-top: 8px;
    font-size: 14px;
    opacity: 0.9;
  }
  .content {
    padding: 30px;
  }
  .greeting {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
  }
  .message {
    font-size: 16px;
    color: #555;
    margin-bottom: 20px;
  }
  .info-box {
    background-color: #f8f9fa;
    border-left: 4px solid #667eea;
    padding: 15px 20px;
    margin: 20px 0;
    border-radius: 0 8px 8px 0;
  }
  .info-box h3 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 16px;
  }
  .info-box p {
    margin: 5px 0;
    color: #555;
    font-size: 14px;
  }
  .status-badge {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
    margin: 10px 0;
  }
  .status-pending {
    background-color: #fff3cd;
    color: #856404;
  }
  .status-approved {
    background-color: #d4edda;
    color: #155724;
  }
  .celebration {
    text-align: center;
    font-size: 40px;
    margin: 20px 0;
  }
  .footer {
    background-color: #f8f9fa;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #e9ecef;
  }
  .footer p {
    margin: 5px 0;
    color: #6c757d;
    font-size: 12px;
  }
  .footer .social {
    margin-top: 15px;
  }
  .footer .social a {
    color: #667eea;
    text-decoration: none;
    margin: 0 10px;
  }
  .note {
    background-color: #e7f3ff;
    border: 1px solid #b6d4fe;
    border-radius: 8px;
    padding: 15px;
    margin-top: 20px;
    font-size: 14px;
    color: #084298;
  }
`;

// Email template for pending registration
const getPendingRegistrationTemplate = ({
  name,
  eventName,
  registrationNumber,
  email,
  institution,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Received - Zenith 2026</title>
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ ZENITH 2026 ⚡</h1>
      <div class="subtitle">SGGS Institute of Engineering & Technology</div>
    </div>
    
    <div class="content">
      <div class="greeting">Hello ${name}! 👋</div>
      
      <div class="message">
        Thank you for registering for <strong>${eventName}</strong> at Zenith 2026! 
        We're thrilled to see your enthusiasm for sports excellence.
      </div>
      
      <div class="info-box">
        <h3>📋 Registration Details</h3>
        <p><strong>Registration Number:</strong> ${registrationNumber}</p>
        <p><strong>Event:</strong> ${eventName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${
          institution
            ? `<p><strong>Institution:</strong> ${institution}</p>`
            : ""
        }
      </div>
      
      <div style="text-align: center;">
        <span class="status-badge status-pending">⏳ Pending Approval</span>
      </div>
      
      <div class="message">
        Your registration is currently <strong>pending approval</strong>. Our team will review your 
        submitted documents (Permission Letter, Transaction Receipt, and ID Card) and verify your registration.
      </div>
      
      <div class="note">
        <strong>📌 What's Next?</strong><br>
        You will receive a confirmation email once your registration is approved by our admin team. 
        This usually takes 24-48 hours. Please keep your registration number safe for future reference.
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Zenith 2026</strong> - The Ultimate Sports Fest</p>
      <p>SGGS Institute of Engineering & Technology, Nanded</p>
      <p>For queries, contact us at zenith@sggs.ac.in</p>
      <div class="social">
        <a href="#">Instagram</a> | <a href="#">Facebook</a> | <a href="#">Website</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

// Email template for approved registration
const getApprovedRegistrationTemplate = ({
  name,
  eventName,
  registrationNumber,
  email,
  institution,
  eventDate,
  venue,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Approved - Zenith 2026</title>
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
      <h1>🎉 CONGRATULATIONS! 🎉</h1>
      <div class="subtitle">Your Registration is Approved!</div>
    </div>
    
    <div class="content">
      <div class="celebration">🏆 🎊 ⭐ 🎊 🏆</div>
      
      <div class="greeting">Dear ${name}! 🌟</div>
      
      <div class="message" style="font-size: 18px; text-align: center; color: #155724;">
        <strong>Great news!</strong> Your registration for <strong>${eventName}</strong> 
        has been <strong>APPROVED</strong>! 
      </div>
      
      <div style="text-align: center;">
        <span class="status-badge status-approved">✅ Registration Confirmed</span>
      </div>
      
      <div class="info-box" style="border-left-color: #28a745;">
        <h3>🎫 Your Confirmed Registration</h3>
        <p><strong>Registration Number:</strong> ${registrationNumber}</p>
        <p><strong>Event:</strong> ${eventName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${
          institution
            ? `<p><strong>Institution:</strong> ${institution}</p>`
            : ""
        }
        ${
          eventDate
            ? `<p><strong>Event Date:</strong> ${new Date(
                eventDate
              ).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>`
            : ""
        }
        ${venue ? `<p><strong>Venue:</strong> ${venue}</p>` : ""}
      </div>
      
      <div class="message" style="text-align: center;">
        <strong>Get ready to showcase your talent!</strong> 💪<br><br>
        We can't wait to see you at Zenith 2026. Prepare yourself for an 
        unforgettable experience filled with competition, camaraderie, and celebration!
      </div>
      
      <div class="note" style="background-color: #d4edda; border-color: #c3e6cb; color: #155724;">
        <strong>🎯 Important Reminders:</strong><br>
        • Carry a valid ID card and your registration number<br>
        • Report at the venue 30 minutes before your event<br>
        • Follow the event guidelines and rules<br>
        • Most importantly - Have fun and give your best! 🔥
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <div style="font-size: 24px;">🏅 See you at the arena! 🏅</div>
      </div>
    </div>
    
    <div class="footer" style="background-color: #d4edda;">
      <p><strong>Zenith 2026</strong> - The Ultimate Sports Fest</p>
      <p>SGGS Institute of Engineering & Technology, Nanded</p>
      <p>For queries, contact us at zenith@sggs.ac.in</p>
      <div class="social">
        <a href="#">Instagram</a> | <a href="#">Facebook</a> | <a href="#">Website</a>
      </div>
      <p style="margin-top: 15px; font-size: 14px;">🙏 Thank you for being part of Zenith 2026! 🙏</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Send pending registration email
export const sendPendingRegistrationEmail = async (registrationData) => {
  const {name, eventName, registrationNumber, email, institution} =
    registrationData;

  const html = getPendingRegistrationTemplate({
    name,
    eventName,
    registrationNumber,
    email,
    institution,
  });

  const result = await sendEmail({
    to: email,
    subject: `🎯 Registration Received - ${eventName} | Zenith 2026`,
    html,
    text: `Hello ${name}! Your registration for ${eventName} at Zenith 2026 has been received and is pending approval. Registration Number: ${registrationNumber}. You will receive a confirmation email once approved.`,
  });

  return result;
};

// Send approved registration email
export const sendApprovedRegistrationEmail = async (registrationData) => {
  const {
    name,
    eventName,
    registrationNumber,
    email,
    institution,
    eventDate,
    venue,
  } = registrationData;

  const html = getApprovedRegistrationTemplate({
    name,
    eventName,
    registrationNumber,
    email,
    institution,
    eventDate,
    venue,
  });

  const result = await sendEmail({
    to: email,
    subject: `🎉 Registration Approved - ${eventName} | Zenith 2026`,
    html,
    text: `Congratulations ${name}! Your registration for ${eventName} at Zenith 2026 has been APPROVED! Registration Number: ${registrationNumber}. Get ready to showcase your talent at the event!`,
  });

  return result;
};

// ==================== WOMEN TOURNAMENT EMAIL TEMPLATES ====================

// Get category name
const getCategoryName = (category) => {
  const categories = {
    category1: "Category 1 - Individual Sports (₹49 Unlimited Pool)",
    category2: "Category 2 - Indoor Games (₹49 Per Game)",
    category3: "Category 3 - Fun & Team Events (₹199 Per Team)",
  };
  return categories[category] || category;
};

// Women Tournament Pending Registration Template
const getPendingWomenTournamentTemplate = ({
  name,
  email,
  registrationNumber,
  selectedSports,
  selectedCategory,
  totalAmount,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Received - Women's Tournament | Zenith 2026</title>
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);">
      <h1>💪 WOMEN'S TOURNAMENT 💪</h1>
      <div class="subtitle">Zenith 2026 - SGGS Institute of Engineering & Technology</div>
    </div>
    
    <div class="content">
      <div class="greeting">Hello ${name}! 👋</div>
      
      <div class="message">
        Thank you for registering for the <strong>Women's Tournament</strong> at Zenith 2026! 
        We're excited to have you participate in our sports celebration.
      </div>
      
      <div class="info-box" style="border-left-color: #ec4899;">
        <h3>📋 Registration Details</h3>
        <p><strong>Registration Number:</strong> ${registrationNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category:</strong> ${getCategoryName(selectedCategory)}</p>
        <p><strong>Selected Sports:</strong> ${selectedSports.join(", ")}</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      </div>
      
      <div style="text-align: center;">
        <span class="status-badge status-pending">⏳ Pending Approval</span>
      </div>
      
      <div class="message">
        Your registration is currently <strong>pending approval</strong>. Our team will review your 
        payment details and verify your registration.
      </div>
      
      <div class="note">
        <strong>📌 What's Next?</strong><br>
        You will receive a confirmation email once your registration is approved by our admin team. 
        This usually takes 24-48 hours. Please keep your registration number safe for future reference.
      </div>
    </div>
    
    <div class="footer" style="background: linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%);">
      <p><strong>Women's Tournament - Zenith 2026</strong></p>
      <p>SGGS Institute of Engineering & Technology, Nanded</p>
      <p>For queries, contact us at zenith@sggs.ac.in</p>
      <div class="social">
        <a href="#">Instagram</a> | <a href="#">Facebook</a> | <a href="#">Website</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

// Women Tournament Approved Registration Template
const getApprovedWomenTournamentTemplate = ({
  name,
  email,
  registrationNumber,
  selectedSports,
  selectedCategory,
  totalAmount,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Approved - Women's Tournament | Zenith 2026</title>
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%);">
      <h1>🎉 CONGRATULATIONS! 🎉</h1>
      <div class="subtitle">Your Women's Tournament Registration is Approved!</div>
    </div>
    
    <div class="content">
      <div class="celebration">🏆 👑 ⭐ 👑 🏆</div>
      
      <div class="greeting">Dear ${name}! 🌟</div>
      
      <div class="message" style="font-size: 18px; text-align: center; color: #155724;">
        <strong>Amazing news!</strong> Your registration for the <strong>Women's Tournament</strong> 
        has been <strong>APPROVED</strong>! 
      </div>
      
      <div style="text-align: center;">
        <span class="status-badge status-approved">✅ Registration Confirmed</span>
      </div>
      
      <div class="info-box" style="border-left-color: #10b981;">
        <h3>🎫 Your Confirmed Registration</h3>
        <p><strong>Registration Number:</strong> ${registrationNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category:</strong> ${getCategoryName(selectedCategory)}</p>
        <p><strong>Sports:</strong> ${selectedSports.join(", ")}</p>
        <p><strong>Total Amount Paid:</strong> ₹${totalAmount}</p>
      </div>
      
      <div class="message" style="text-align: center;">
        <strong>Get ready to shine! You've got this! 💪</strong><br><br>
        We can't wait to see you compete at the Women's Tournament. 
        Show everyone what you're made of!
      </div>
      
      <div class="note" style="background-color: #d4edda; border-color: #c3e6cb; color: #155724;">
        <strong>🎯 Important Reminders:</strong><br>
        • Carry a valid College ID card<br>
        • Remember your registration number: <strong>${registrationNumber}</strong><br>
        • Report at the venue 30 minutes before your event<br>
        • Wear appropriate sports attire<br>
        • Most importantly - Give your best and have fun! 🔥
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <div style="font-size: 24px;">👑 You're a champion! 👑</div>
        <div style="font-size: 16px; margin-top: 10px; color: #6b7280;">See you at the tournament!</div>
      </div>
    </div>
    
    <div class="footer" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);">
      <p><strong>Women's Tournament - Zenith 2026</strong></p>
      <p>SGGS Institute of Engineering & Technology, Nanded</p>
      <p>For queries, contact us at zenith@sggs.ac.in</p>
      <div class="social">
        <a href="#">Instagram</a> | <a href="#">Facebook</a> | <a href="#">Website</a>
      </div>
      <p style="margin-top: 15px; font-size: 14px;">🙏 Thank you for being part of Women's Tournament at Zenith 2026! 🙏</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Send pending Women Tournament registration email
export const sendPendingWomenTournamentEmail = async (registrationData) => {
  const {
    name,
    email,
    registrationNumber,
    selectedSports,
    selectedCategory,
    totalAmount,
  } = registrationData;

  const html = getPendingWomenTournamentTemplate({
    name,
    email,
    registrationNumber,
    selectedSports,
    selectedCategory,
    totalAmount,
  });

  const result = await sendEmail({
    to: email,
    subject: `💪 Registration Received - Women's Tournament | Zenith 2026`,
    html,
    text: `Hello ${name}! Your registration for Women's Tournament at Zenith 2026 has been received and is pending approval. Registration Number: ${registrationNumber}. Sports: ${selectedSports.join(
      ", "
    )}. You will receive a confirmation email once approved.`,
  });

  return result;
};

// Send approved Women Tournament registration email
export const sendApprovedWomenTournamentEmail = async (registrationData) => {
  const {
    name,
    email,
    registrationNumber,
    selectedSports,
    selectedCategory,
    totalAmount,
  } = registrationData;

  const html = getApprovedWomenTournamentTemplate({
    name,
    email,
    registrationNumber,
    selectedSports,
    selectedCategory,
    totalAmount,
  });

  const result = await sendEmail({
    to: email,
    subject: `🎉 Registration Approved - Women's Tournament | Zenith 2026`,
    html,
    text: `Congratulations ${name}! Your registration for Women's Tournament at Zenith 2026 has been APPROVED! Registration Number: ${registrationNumber}. Sports: ${selectedSports.join(
      ", "
    )}. Get ready to showcase your talent!`,
  });

  return result;
};

export default {
  sendPendingRegistrationEmail,
  sendApprovedRegistrationEmail,
  sendPendingWomenTournamentEmail,
  sendApprovedWomenTournamentEmail,
};
