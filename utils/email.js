import "dotenv/config.js";
import transporter from "../config/email_configuration/email_configuration.js";
export async function sendEmailLogin(email, number) {
  const mailConfigurations = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "Sign in OTP",
    // This would be the text of email body
    html:
      "<h1>Your Sign in OTP:</h1><br/>" +
      email +
      `<p>Your OTP is: <strong>${number}</strong><br/><br/>
                         Made with ❤️ By Ndivho Makhuvha(0607210343).</p>`,
  };
  // Send the mail upon everything above correct
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log(info);
  });
}

export async function sendEmailServerDown(email, pdfPath) {
  try {
    if (!email) {
      throw new Error("No recipients defined. Email address is required.");
    }

    const message = {
      from: "ndibo69@gmail.com",
      to: email,
      subject: "Server Document Updates",
      text: "Please find the attached document about your servers.",
      attachments: [{ filename: `${email}.pdf`, path: pdfPath }],
    };
    await transporter.sendMail(message);
  } catch (error) {
    console.error("Error sending email:", error.message);
    // You can handle the error or rethrow it as needed
    throw error;
  }
}

export default {
  sendEmailLogin,
};
