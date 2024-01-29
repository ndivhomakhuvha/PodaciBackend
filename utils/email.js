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

export async function sendEmailServerDown(email, serverNames) {
  try {
    if (!email) {
      throw new Error("No recipients defined. Email address is required.");
    }

    const mailConfigurations = {
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: "Server Down Notification",
      html:
        "<h1>One of your Servers is Down 🌐</h1>" +
        `<p>The server which is affected is : ${serverNames} 🖥</p>` +
        `<p>Made with ❤️ By Ndivho Makhuvha(0607210343).</p>`,
    };

    // Send the mail upon everything above is correct
    const info = await transporter.sendMail(mailConfigurations);
    console.log(info);
  } catch (error) {
    console.error("Error sending email:", error.message);
    // You can handle the error or rethrow it as needed
    throw error;
  }
}

export default {
  sendEmailLogin,
};
