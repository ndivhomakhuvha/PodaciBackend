import client from "../config/database_configuration.js";
import bcrypt from "bcrypt";

const createUser = (request, response) => {
  const { username, email, password } = request.body;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  client.query(
    "INSERT INTO users (username, email,password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword],
    (error, results) => {
      if (error) {
        throw error;
      }
      if(email ==)
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};
const Signin = (request, response) => {
  const email = request.params.email;
  const password = request.params.password;

  client.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }
      // let isPassValid = bcrypt.compareSync(password, results.rows[3])
      // if(isPassValid){
      //   response.status(200).send({message : 'Password valid'})
      // }
      // else{
      //   response.status(409).send({message : 'Password not correct'})
      // }
      response.status(200).send(results.rows);
    }
  );
};

export default { createUser, Signin };
