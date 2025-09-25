const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"JoukkueApp" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Salasanan palautuslinkki",
    text,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
