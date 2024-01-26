import bcrypt from "bcryptjs";
import client from "../../config/database_configuration/database_configuration.js";
import transporter from "../../config/email_configuration/email_configuration.js";
import jwt_secret from "../../config/jwt_secret/jwtSecret.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { request, response } from "express";
import { sendEmailLogin } from "../../utils/email.js";

async function EmailExists(email) {
  try {
    const emailQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };
    const emailResult = await client.query(emailQuery);
    return emailResult && emailResult.rows.length > 0;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
}

export async function createUserService(request, response) {
  const { username, email, password } = request.body;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const exists = await EmailExists(email);
    if (exists) {
      return response.status(409).json({ message: "User already exists" });
    }
    await client.query(
      "INSERT INTO users (username, email,password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword],
      (error, results) => {
        if (error) {
          throw error;
        }
        return response.status(201).json(results.rows);
      }
    );
  } catch (error) {
    console.error("Error saving user to the database:", error);
    throw error;
  }
}

async function updateOTP(email, number) {
  try {
    const updateResult = await client.query({
      text: "UPDATE users SET otp = $1 WHERE email = $2",
      values: [number, email],
    });
    return updateResult;
  } catch (error) {
    console.error(`Error updating OTP for user with email ${email}:`, error);
    throw error;
  }
}

export async function signInUserService(request, response) {
  const email = request.body.email;
  const password = request.body.password;
  try {
    await client.query(
      "SELECT * FROM users WHERE email = $1 ",
      [email],
      async (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows.length === 0) {
          return response.status(409).json({ message: "Failure response" });
        }
        const userPassword = results.rows[0].password;
        let isPasswordValid = bcrypt.compareSync(password, userPassword);
        let number = Math.floor(1000 + Math.random() * 9000);
        if (isPasswordValid) {
          await sendEmailLogin(email, number);
          await updateOTP(email, number);
          let token = jwt.sign(
            { id: results.rows[0].user_id },
            jwt_secret.secret,
            {
              expiresIn: 86400,
            }
          );
          let successObject = {
            email: email,
            username: results.rows[0].username,
            number: number,
            userId: results.rows[0].user_id,
            token: token,
          };

          return response.status(200).json(successObject);
        } else {
          return response.status(409).json({ message: "Failure response" });
        }
      }
    );
  } catch (error) {
    console.error("Error saving user to the database:", error);
    throw error;
  }
}

export async function signInAsGuestService(request, response) {
  const email = request.body.email;
  const password = request.body.password;
  try {
    await client.query(
      "SELECT * FROM users WHERE email = $1 ",
      [email],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows.length === 0) {
          return response.status(409).json({ message: "Failure response" });
        }
        const userPassword = results.rows[0].password;
        let isPasswordValid = bcrypt.compareSync(password, userPassword);

        if (isPasswordValid) {
          let token = jwt.sign(
            { id: results.rows[0].user_id },
            jwt_secret.secret,
            {
              expiresIn: 86400,
            }
          );
          let successObject = {
            email: email,
            username: results.rows[0].username,
            userId: results.rows[0].user_id,
            token: token,
          };

          return response.status(200).json(successObject);
        } else {
          return response.status(409).json({ message: "Failure response" });
        }
      }
    );
  } catch (error) {
    console.error("Error saving user to the database:", error);
    throw error;
  }
}
export async function resendOtpService(request, response) {
  const { email } = request.body;
  try {
    const exists = await EmailExists(email);
    if (!exists) {
      return response.status(409).json({ message: "User does not exist" });
    }
    let number = Math.floor(1000 + Math.random() * 9000);
    const mailConfigurations = {
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: "Sign in OTP",
      // This would be the text of email body
      html:
        "<h1>Your Sign in OTP:</h1><br/>" +
        email +
        `<p>Your Request for An OTP Resend is: <strong>${number}</strong><br/><br/>
                         Made with ❤️ By FlexBox Inc.</p>`,
    };
    // Send the mail upon everything above correct
    transporter.sendMail(mailConfigurations, function (error, info) {
      if (error) throw Error(error);
      console.log(info);
    });
    let successObject = {
      email: email,
      number: number,
    };
    response.status(200).json(successObject);
  } catch (error) {
    console.error("Error resending OTP", error);
    throw error;
  }
}

export async function updateUserService(request, response) {
  const user_id = parseInt(request.params.id);
  const { username, email, password } = request.body;

  const saltRounds = 10;
  const salt = await bcrypt.genSaltSync(saltRounds);
  const hashedPassword = await bcrypt.hashSync(password, salt);
  if (isNaN(user_id)) {
    return response.status(400).json({ message: "Invalid user ID" });
  }
  try {
    await client.query(
      "UPDATE users SET username = $1, email = $2, password = $3 WHERE user_id = $4",
      [username, email, hashedPassword, user_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        let successObject = {
          email: email,
          username: username,
          userId: user_id,
        };
        return response.status(200).json(successObject);
      }
    );
  } catch (error) {
    console.log(error);
  }
}
export default {
  createUserService,
  signInUserService,
  signInAsGuestService,
  resendOtpService,
  updateUserService,
};
