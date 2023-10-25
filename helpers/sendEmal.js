const nodemailer = require("nodemailer");
require("dotenv").config();
// const { META_PASS } = process.env;

const nodemailerConfig = {
  // host: "smtp.meta.ua",
  // port: 465,
  // secure: true,
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    // user: "anton.palienko@meta.ua",
    // pass: META_PASS,
    user: "joanne.dickens@ethereal.email",
    pass: "9JJB23YmnKwDTYusBN",
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  try {
    const email = { ...data, from: "joanne.dickens@ethereal.email" };
    await transport.sendMail(email);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
