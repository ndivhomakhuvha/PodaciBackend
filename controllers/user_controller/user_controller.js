import {
  createUserService,
  signInUserService,
  signInAsGuestService,
  resendOtpService,
  updateUserService
} from "../../services/user_services/user_service.js";

export async function createUserController(request, response) {
  try {
    const result = await createUserService(request, response);
    return result;
  } catch (error) {
    console.error("Error in createUserService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

export async function signInUserController(request, response) {
  try {
    const result = await signInUserService(request, response);
    return result;
  } catch (error) {
    console.error("Error in signInUserService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

export async function signInAsGuestController(request, response) {
  try {
    const result = await signInAsGuestService(request, response);
    return result;
  } catch (error) {
    console.error("Error in signInAsGuestService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

export async function resendOtpController(request, response) {
  try {
    const result = await resendOtpService(request, response);
    return result;
  } catch (error) {
    console.error("Error in resendOtpService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUserController(request,response) {
  try {
    const result = await updateUserService(request, response);
    return result;
  } catch (error) {
    console.error("Error in updateUserService:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createUserController,
  signInUserController,
  resendOtpController,
  updateUserController,
  signInAsGuestController,
};
