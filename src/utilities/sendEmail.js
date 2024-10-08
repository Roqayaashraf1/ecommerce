import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: "roqayaashraf25@gmail.com", 
      pass: "xsht ktaj gajl hctq", 
    },
  });

  const mailOptions = {
    from: "roqayaashraf25@gmail.com", 
    to,
    subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default sendEmail;
