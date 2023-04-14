const nodemailer = require("nodemailer");

const sendMail = (email, subject, data) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  
    var mailOptions = {
      from: `Leave Management System ${process.env.NODEMAILER_EMAIL}`,
      to: email,
      subject: subject,
      html: data,
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
    });
  };

  module.exports = sendMail;