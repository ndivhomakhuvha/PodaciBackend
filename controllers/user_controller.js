import bcrypt from "bcrypt";
import client from "../config/database_configuration.js";
import transporter from "../config/email_configuration.js";


async function EmailExists(email) {
  try {
    const emailQuery = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };
    const emailResult = await client.query(emailQuery);
    return (
      (emailResult && emailResult.rows.length > 0)
    );
  }
  catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }

}


const createUser = async (request, response) => {
  const { username, email, password } = request.body;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);


  try {
    const exists = await EmailExists(email);
    if (exists) {
      response.status(409).send({ message: 'User already exists' })
      return;
    }
    await client.query(
      "INSERT INTO users (username, email,password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`);
      }
    )
  } catch (error) {
    console.error('Error saving user to the database:', error);
    throw error;

  }

};



const Signin = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;

  client.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }
      const userPassword = results.rows[0].password;
      let isPasswordValid = bcrypt.compareSync(password, userPassword);
      let number = Math.floor(1000 + Math.random() * 9000);
      if (isPasswordValid) {

        const mailConfigurations = {
          from: "ndibo69@gmail.com",
          to: email,
          subject: "Sign in OTP",
          // This would be the text of email body
          html:
            "<h1>Your OTP(One-time-pin) is : </h1><br/>" +
            email +
            `<p>Your OTP is: <strong>${number}</strong><br/><br/>
                         Made with ❤️ By FlexBox Inc.</p>`,
        };
        // Send the mail upon everything above correct
        transporter.sendMail(mailConfigurations, function (error, info) {
          if (error) throw Error(error);
          console.log(info)
        });
        response.status(200).send(results.rows[0])
      }
      else {
        response.status(409).send({ message: 'Failure response' })
      }

    }
  );
};


export default { createUser, Signin };







