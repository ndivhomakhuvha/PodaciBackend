import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import pool from "./config/database_configuration.js";
import Userroutes from './routes/user_router.js'
import Serverroutes from './routes/server_router.js'
import GPTRoutes from './routes/gpt_router.js'



const app = express();
const PORT = process.env.PORT;
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.send({ message: "Welcome to Podaci." });
});
app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`);
});
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Successfully connected to the database");
  }

});
app.use('/api/user', Userroutes)
app.use('/api/server', Serverroutes);
app.use('/api/gpt', GPTRoutes);