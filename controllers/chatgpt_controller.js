import configuration from "../config/chatgpt_configuration.js";
import { OpenAIApi } from 'openai';

const openai = new OpenAIApi(configuration);
const askSomething = async (request, response) => {
    const { message } = request.body;

    await openai
        .createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message + "Explain like a 5 year old" }],
        })
        .then((res) => {
            return response.status(200).send(res.data.choices[0].message.content)

        })
        .catch((e) => {
            console.log(e);
        });
}


export default { askSomething };