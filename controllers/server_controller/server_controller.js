import {
  createServerService,
  viewServerByUserIdService,
  getAllServersService,
  updateServerByServerIdService,
  deleteAparticularServerByIdService,
  createServerWithHttpsService
} from "../../services/server_services/server_services.js";

//A controller that calls the createServerService
export async function createServerController(request, response) {
  try {
    const result = await createServerService(request, response);
    return result;
  } catch (error) {
    console.error("Error in createServerService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

//This service views all the servers associated with a particular user
export async function viewServerByUserIdController(request, response) {
  try {
    const result = await viewServerByUserIdService(request, response);
    return result;
  } catch (error) {
    console.error("Error in viewServerByUserIdService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

//This function gets all the servers , regardless of the user.
export async function getAllServersController(request, response) {
  try {
    const result = await getAllServersService(request, response);
    return result;
  } catch (error) {
    console.error("Error in getAllServersService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

// Update a particular server based on the servers ID.
export async function updateServerController(request, response) {
  try {
    const result = await updateServerByServerIdService(request, response);
    return result;
  } catch (error) {
    console.error("Error in updateServerByServerIdService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

// This method will delete a server by its id, it is asynchronous, meaning it wont move to the next line without finishing the awaited thing.
export async function deleteAparticularServerByIdController(request, response) {
  try {
    const result = await deleteAparticularServerByIdService(request, response);
    return result;
  } catch (error) {
    console.error("Error in deleteAparticularServerByIdService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}


export async function createServerWithHttpsController(request, response) {
  try {
    const result = await createServerWithHttpsService(request, response);
    return result;
  } catch (error) {
    console.error("Error in createServerWithHttpsService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

export default {
  createServerController,
  viewServerByUserIdController,
  getAllServersController,
  updateServerController,
  deleteAparticularServerByIdController,
  createServerWithHttpsController
};
