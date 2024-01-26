import axios from "axios";
import client from "../../config/database_configuration/database_configuration.js";
import { response } from "express";


//This is the business logic file

//This function checks if the server status is up or down
// It will return a string
// it is a asynchronous function


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

async function findIpService(request,response){
  const {ip_address } = request.body;
  ipInfo.getIPInfo(ip_address).then(data => {
    return response.status(200).json(data);
  }).catch(error => {
    return response.status(404).json({message: "Ip Address not found"});
  })
}

// this function checks if the server address exists on the database, by its ip address
async function ServerExists(ipadress, user_id) {
  try {
    const ServerQuery = {
      text: "SELECT * FROM addresses WHERE ipadress = $1 AND user_id = $2",
      values: [ipadress, user_id],
    };
    const ServerResult = await client.query(ServerQuery);
    return ServerResult && ServerResult.rows.length > 0;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
}

// This function will create a new server
export async function createServerService(request, response) {
  let status;
  const { imageurl, ipadress, name, memory, type, user_id } = request.body;

  // it starts by checking if the url is up/ down using this function
  //if the server is up it will give it the STATUS UP / STATUS DOWN based on that
  checkUrl(`http://${ipadress}`)
    .then((data) => {
      status = data;
    })
    .catch((error) => {
      status = error;
    });

  try {
    const exists = await ServerExists(ipadress, user_id);
    if (exists) {
      return response.status(409).json({ message: "Server already exists" });
      return;
    }
    // Will wait for the api to post
    await client.query(
      "INSERT INTO addresses (imageurl, ipadress,name,memory,type,status, user_id) VALUES ($1, $2, $3, $4, $5, $6 , $7 ) RETURNING *",
      [imageurl, ipadress, name, memory, type, status, user_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        // return a message saying its posted
        return response
          .status(201)
          .json(`Server added with ID: ${results.rows[0].server_id}`);
      }
    );
  } catch (error) {
    console.error("Error saving Server to the database:", error);
    throw error;
  }
}


// This function will create a new server
export async function createServerWithHttpsService(request, response) {
  let status;
  const { imageurl, ipadress, name, memory, type, user_id } = request.body;

  // it starts by checking if the url is up/ down using this function
  //if the server is up it will give it the STATUS UP / STATUS DOWN based on that
  checkUrl(`https://${ipadress}`)
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
    // Will wait for the api to post
    await client.query(
      "INSERT INTO addresses (imageurl, ipadress,name,memory,type,status, user_id) VALUES ($1, $2, $3, $4, $5, $6 , $7 ) RETURNING *",
      [imageurl, ipadress, name, memory, type, status, user_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        // return a message saying its posted
        return response
          .status(201)
          .json(`Server added with ID: ${results.rows[0].server_id}`);
      }
    );
  } catch (error) {
    console.error("Error saving Server to the database:", error);
    throw error;
  }
}

export async function viewServerByUserIdService(request, response) {
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
}

export async function getAllServersService(request, response) {
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
}

export async function updateServerByServerIdService(request, response) {
  let status;
  const server_id = parseInt(request.params.id);
  const { ipadress } = request.body;
  try {
    checkUrl(`http://${ipadress}`)
      .then((status) => {
        client.query(
          "UPDATE addresses SET ipadress = $1 , status = $2 WHERE server_id = $3",
          [ipadress, status, server_id],
          (error, results) => {
            if (error) {
              throw error;
            }
            return response
              .status(200)
              .json({ message: `User modified with ID: ${server_id}` });
          }
        );
      })
      .catch((error) => {
        status = error;
      });
  } catch (error) {
    console.error("Error saving user to the database:", error);
    throw error;
  }
}

export async function deleteAparticularServerByIdService(request, response) {
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
}

export default {
  createServerService,
  viewServerByUserIdService,
  getAllServersService,
  updateServerByServerIdService,
  deleteAparticularServerByIdService,
  createServerWithHttpsService
};
