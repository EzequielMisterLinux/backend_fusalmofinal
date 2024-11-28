import UserModel from "../../models/userModel/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const AccessLogin = async (req, res) => {
    const { username, passw } = req.body;

    if (!username || !passw) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(passw, user.passw);

        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'Strict'
        });

        res.json({
            message: "User logged in successfully",
            token: token // Incluir el token en la respuesta JSON
        });

        console.log("login is success");
    } catch (error) {
        res.status(500).send('Server error');
        console.error("Error in the server", error);
    }
};

export default AccessLogin