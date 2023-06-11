import axios from "axios";
import client from "../config/database_configuration.js";
import { response } from "express";

async function checkUrl(url) {
  let status;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      status = "SERVER UP";
    } else {
      status = "SERVER DOWN";
    }
  } catch (error) {
    status = "SERVER DOWN";
  }
  return status;
}

checkUrl(`http://52.67.97.86`)
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.log(error)
  });

async function ServerExists(ipadress) {
  try {
    const ServerQuery = {
      text: "SELECT * FROM addresses WHERE ipadress = $1",
      values: [ipadress],
    };
    const ServerResult = await client.query(ServerQuery);
    return ServerResult && ServerResult.rows.length > 0;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
}

const createServer = async (request, response) => {
  let status;
  const { imageurl, ipadress, name, memory, type, user_id } = request.body;

  checkUrl(`http://${ipadress}`)
    .then((data) => {
      status = data;
    })
    .catch((error) => {
      status = error;
    });

  try {
    const exists = await ServerExists(ipadress);
    if (exists) {
      return response.status(409).json({ message: "Server already exists" });
      return;
    }
    await client.query(
      "INSERT INTO addresses (imageurl, ipadress,name,memory,type,status, user_id) VALUES ($1, $2, $3, $4, $5, $6 , $7 ) RETURNING *",
      [imageurl, ipadress, name, memory, type, status, user_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        return response
          .status(201)
          .json(`Server added with ID: ${results.rows[0].server_id}`);
      }
    );
  } catch (error) {
    console.error("Error saving Server to the database:", error);
    throw error;
  }
};

const viewServersById = async (request, response) => {
  const user_id = parseInt(request.params.id);
  try {
    await client.query(
      "SELECT * FROM addresses WHERE user_id = $1",
      [user_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        return response.status(200).json(results.rows);
      }
    );
  } catch (error) {
    console.error("Error saving user to the database:", error);
    throw error;
  }
};

const getAllServers = async (request, response) => {
  try {
    await client.query(
      "SELECT * FROM addresses ORDER BY server_id ASC",
      (error, results) => {
        if (error) {
          throw error;
        }
        return response.status(200).json(results.rows);
      }
    );
  } catch (error) {
    console.error("Error saving user to the database:", error);
    throw error;
  }
};

const updateServer = (request, response) => {
  let status;
  const server_id = parseInt(request.params.id);
  const { ipadress } = request.body;

  checkUrl(`http://${ipadress}`)
    .then((status) => {
      client.query(
        "UPDATE addresses SET ipadress = $1 , status = $2 WHERE server_id = $3",
        [ipadress, status, server_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          return response.status(200).json({ message: `User modified with ID: ${server_id}` });
        }
      );
    })
    .catch((error) => {
      status = error;
    });
};

const DeleteOne = async (request, response) => {
  const server_id = parseInt(request.params.id);
  if (isNaN(server_id)) {
    return response
      .status(400)
      .json({ message: "Invalid server ID provided." });
  }
  try {
    await client.query("DELETE FROM addresses WHERE server_id = $1", [
      server_id,
    ]);
    return response
      .status(200)
      .json({ message: `Server with ID ${server_id} has been deleted!` });
  } catch (error) {
    console.error("Error deleting server from the database:", error);
    return response
      .status(500)
      .json({ message: "Server deletion failed.", error: error.message });
  }
};

export default {
  createServer,
  viewServersById,
  getAllServers,
  updateServer,
  DeleteOne,
};
