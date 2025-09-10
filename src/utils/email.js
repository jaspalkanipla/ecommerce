import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",  // for production use SMTP (SES, SendGrid, Mailtrap etc.)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password
  },
});

// Reusable function
export const sendEmail = async ({ to, cc, bcc, subject, html, attachments }) => {
  try {
    const info = await transporter.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to,         // can be string OR array
      cc,         // optional
      bcc,        // optional
      subject,
      html,
      attachments: attachments || [],  // optional
    });

    return info; // delivery status object
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};





// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",  // for production use SMTP (SES, SendGrid, Mailtrap etc.)
//   auth: {
//     user: process.env.EMAIL_USER, // Gmail / SMTP user
//     pass: process.env.EMAIL_PASS, // App password (not your actual password)
//   },
// });

// // Reusable function
// export const sendEmail = async ({ to, subject, html, attachments }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `<${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//       attachments: attachments || [],
//     });

//     return info;
//   } catch (err) {
//     console.error("Email error:", err);
//     throw err;
//   }
// };
