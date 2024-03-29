import axios from "axios";
import client from "../../config/database_configuration/database_configuration.js";
import { response } from "express";

import { promisify } from "util";

const queryAsync = promisify(client.query).bind(client);
import { sendEmailServerDown } from "../../utils/email.js";
import fs from "fs";
import Docxtemplater from "docxtemplater";
import JSZip from "jszip";
import { exec } from "child_process";

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

async function findIpService(request, response) {
  const { ip_address } = request.body;
  ipInfo
    .getIPInfo(ip_address)
    .then((data) => {
      return response.status(200).json(data);
    })
    .catch((error) => {
      return response.status(404).json({ message: "Ip Address not found" });
    });
}

// this function checks if the server address exists on the database, by its ip address
async function ServerExists(ipadress, user_id) {
  try {
    const ServerQuery = {
      text: "SELECT * FROM addresses WHERE ipadress = $1 AND user_id = $2",
      values: [ipadress, user_id],
    };
    const ServerResult = await client.query(ServerQuery);
    return ServerResult && ServerResult.rows.length === 1;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
}
async function getAllServers(user_id) {
  try {
    const results = await queryAsync(
      "SELECT * FROM addresses WHERE user_id = $1 ORDER BY server_id ASC",
      [user_id]
    );

    return results.rows;
  } catch (error) {
    console.error("Error fetching servers from the database:", error);
    throw error;
  }
}

async function ScheduledgetAllServers() {
  try {
    const results = await queryAsync(
      "SELECT * FROM addresses  ORDER BY server_id ASC"
    );

    return results.rows;
  } catch (error) {
    console.error("Error fetching servers from the database:", error);
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
    } else {
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
    }
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
    const exists = await ServerExists(ipadress, user_id);
    if (exists === true) {
      return response.status(409).json({ message: "Server already exists" });
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

export async function pingAllServers(request, response) {
  try {
    const user_id = parseInt(request.params.id);
    const servers = await getAllServers(user_id);

    // Use Promise.all to wait for all checkUrl promises to complete
    const updatePromises = servers.map(async (element) => {
      try {
        const url = `https://${element.ipadress}`;

        let status;
        try {
          // Use await directly instead of mixing with then/catch
          status = await checkUrl(url);
        } catch (error) {
          console.error(`Error checking URL ${url}:`, error);
          status = error.message || "Error checking URL";
        }

        await updateServer(element.server_id, element.ipadress, status);
      } catch (error) {
        console.error(
          `Error updating server with ID ${element.server_id}:`,
          error
        );
        // Handle the error or log it as needed
      }
    });

    await Promise.all(updatePromises);

    return response
      .status(200)
      .json({ message: "All servers updated successfully" });
  } catch (error) {
    console.error("Error updating servers:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
async function getUserById(user_id) {
  try {
    const result = await queryAsync("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);
    return result.rows[0]; // Assuming you expect only one user or null
  } catch (error) {
    console.error(`Error fetching user with ID ${user_id}:`, error);
    throw error;
  }
}

export async function pingAllServersScheduled(request, response) {
  try {
    const servers = await ScheduledgetAllServers();
    const usersServersMap = new Map(); // Map to store servers for each user

    // Iterate through servers to check status and collect servers for each user
    for (const element of servers) {
      const url = `https://${element.ipadress}`;

      let status;

      try {
        status = await checkUrl(url);
        await updateServer(element.server_id, element.ipadress, status);
      } catch (error) {
        console.error(`Error checking URL ${url}:`, error);
        status = error.message || "Error checking URL";
      }

      // Update server status in the database

      // Store server information for each user
      if (!usersServersMap.has(element.user_id)) {
        usersServersMap.set(element.user_id, []);
      }
      usersServersMap.get(element.user_id).push({
        server_id: element.server_id,
        ip: element.ipadress,
        status: status,
        name: element.name,
      });
    }

    // Send email for each user with servers' status
    for (const [userId, servers] of usersServersMap) {
      try {
        const user = await getUserById(userId);
        const docxPath = await generateDocument(user.email, servers); // Pass servers array to generateDocument function
        const pdfPath = await convertToPdf(docxPath);
        await sendEmailServerDown(user.email, pdfPath);
      } catch (error) {
        console.error(`Error sending email to user ${userId}:`, error);
        // Handle the error or log it as needed
      }
    }
    return response
      .status(200)
      .json({ message: "All servers updated successfully" });
  } catch (error) {
    console.error("Error updating servers:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateServer(server_id, ipAddress, status) {
  return new Promise((resolve, reject) => {
    client.query(
      "UPDATE addresses SET ipadress = $1, status = $2 WHERE server_id = $3",
      [ipAddress, status, server_id],
      (error, results) => {
        if (error) {
          console.error(`Error updating server with ID ${server_id}:`, error);
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

const generateDocument = async (user_email, data) => {
  const template = fs.readFileSync("templates/template.docx", "binary");
  const doc = new Docxtemplater();
  doc.loadZip(new JSZip(template));

  console.log(data);

  const downServers = data.filter((server) => server.status === "SERVER DOWN");
  const upServers = data.filter((server) => server.status === "SERVER UP");

  // Set the data for the template
  doc.setData({
    user_name: user_email, // Replace with the user's name
    down_servers: downServers,
    up_servers: upServers,
  });

  // Render the document
  try {
    doc.render();
  } catch (error) {
    console.error("Error rendering document:", error);
    throw error;
  }
  // Write the generated document to a temporary file
  const outputPath = "outputs/output.docx";
  fs.writeFileSync(
    outputPath,
    Buffer.from(doc.getZip().generate({ type: "nodebuffer" }))
  );
  return outputPath;
};

const convertToPdf = async (docxPath) => {
  try {
    const pdfPath = "outputs/output.pdf";
    await new Promise((resolve, reject) => {
      exec(
        `pandoc "${docxPath}" -o "${pdfPath}" --pdf-engine=wkhtmltopdf`,
        (error, stdout, stderr) => {
          if (error) {
            console.error("Error converting to PDF:", error);
            reject(error);
          } else {
            console.log("Converted to PDF successfully:", pdfPath);
            resolve(pdfPath);
          }
        }
      );
    });
    return pdfPath;
  } catch (error) {
    console.error("Error converting to PDF:", error);
    throw error;
  }
};

export default {
  createServerService,
  viewServerByUserIdService,
  getAllServersService,
  updateServerByServerIdService,
  deleteAparticularServerByIdService,
  createServerWithHttpsService,
  pingAllServersScheduled,
};
