import express, { request, response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import pool from "./config/database_configuration/database_configuration.js";
import Userroutes from "./routes/user_routes/user_router.js";
import Serverroutes from "./routes/server_routes/server_router.js";
import GPTRoutes from "./routes/gpt_routes/gpt_router.js";
import morgan from "morgan";
import cron from "node-cron";
import axios from "axios";

const app = express();

const PORT = process.env.PORT;

const corsOptions = {
  origin: "*",
};
app.use(morgan("tiny"));
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
  console.log(`Application is running on PORT : ${PORT}`);
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Successfully connected to the database");
  }
});
app.use("/api/user", Userroutes);
app.use("/api/server", Serverroutes);
app.use("/api/gpt", GPTRoutes);

cron.schedule(
  "0 6 * * *",
  async () => {
    try {
      console.log("Running scheduled task...");

      // Make an HTTP request to your specific endpoint
      const response = await axios.put(
        "https://podaci.onrender.com/api/server/allservers"
      );

      // Log the response or perform any other necessary actions
      console.log("Response:", response.data);

      console.log("Scheduled task completed.");
    } catch (error) {
      console.error("Error in scheduled task:", error.message);
    }
  },
  {
    timezone: "Africa/Johannesburg",
  }
);


cron.schedule(
  "*/5 * * * *",
  async () => {
    try {
    

      // Make an HTTP request to your specific endpoint
      const response = await axios.get(
        "https://podaci.onrender.com"
      );

      // Log the response or perform any other necessary actions
      console.log("Response:", response.data);

      
    } catch (error) {
      console.error("Error in scheduled task:", error.message);
    }
  },
  {
    timezone: "Africa/Johannesburg",
  }
);
