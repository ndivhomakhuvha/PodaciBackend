import { askGPTService } from "../../services/gpt_services/gpt_services.js";


//The controller that takes the service to send a query to GPT
export async function askGPTController(request, response) {
  try {
    const result = await askGPTService(request, response);
    return result;
  } catch (error) {
    console.error("Error in askGPTService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

export default { askGPTController };
