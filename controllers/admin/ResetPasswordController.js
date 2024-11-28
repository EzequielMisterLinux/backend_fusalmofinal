import UserModel from "../../models/userModel/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const SendResetPasswordEmail = async (req, res) => {
    const { mail } = req.body;
    try {
        const user = await UserModel.findOne({ mail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        const resetLink = `http://localhost:5173/reset-password/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.mail,
            subject: "Password Reset",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   ${resetLink}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ message: "Error sending email" });
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({ message: "Email sent successfully" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error("Server error", error);
    }
};

const VerifyResetTokenAndUpdatePassword = async (req, res) => {
    const { token, passw } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await UserModel.findById(decoded.id);
        if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashpasw = await bcrypt.hash(passw, 10);
        user.passw = hashpasw;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error("Server error", error);
    }
};



export {
    SendResetPasswordEmail,
    VerifyResetTokenAndUpdatePassword
};
