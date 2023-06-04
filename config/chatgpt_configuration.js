import { Configuration } from 'openai';
import 'dotenv/config'
const configuration = new Configuration({
    apiKey: process.env.CHAT_PASSWORD,
});

export default configuration;