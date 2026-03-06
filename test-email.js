import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

async function main() {
    try {
        console.log(`Checking config with User: ${process.env.EMAIL_USER}`);
        let dt = await transporter.verify();
        console.log("Server is ready to take our messages", dt);
        process.exit(0);
    } catch (e) {
        console.error("Verification failed:", e);
        process.exit(1);
    }
}
main();
