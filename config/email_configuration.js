import nodemailer from "nodemailer"
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ndibo69@gmail.com',
        pass: process.env.APP_PASSWORD
    }
});

export default transporter