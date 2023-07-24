import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "jratrainbows@gmail.com", // Replace with your Gmail email address
    pass: process.env.EMAIL_PASSWORD, // Set your Gmail email password as an environment variable
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;
