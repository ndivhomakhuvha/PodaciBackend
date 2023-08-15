import configuration from "../../config/gpt_configuration/chatgpt_configuration.js";
import { OpenAIApi } from "openai";

const openai = new OpenAIApi(configuration);

export async function askGPTService(request, response) {
  const { message } = request.body;
  try {
    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: message + "Explain like a 5 year old" },
        ],
      })
      .then((res) => {
        let object = {
          message: res.data.choices[0].message.content,
        };
        return response.status(200).json(object);
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    console.error("Error checking lesson plan existence:", error);
    throw error;
  }
}

export default askGPTService ;