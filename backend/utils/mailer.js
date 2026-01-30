// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendMail = async ({ to, subject, html, from }) => {
//   return transporter.sendMail({
//     from: from || `"Twiller" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };



import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Ensure no spaces in .env
  },
});

export const sendMail = async ({ to, subject, html, from }) => {
  try {
    const info = await transporter.sendMail({
      from: from || `"Twiller" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Nodemailer Error:", error);
    throw error; // Re-throw so the /login catch block catches it
  }
};