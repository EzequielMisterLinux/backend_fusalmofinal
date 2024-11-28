import UserModel from "../../models/userModel/userModel.js";
import dotenv from "dotenv";

dotenv.config();


const GetUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const getUser = await UserModel.findById(id);
        res.status(200).json(getUser);
        console.log("get user by id success");
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error("has problem in the server", error);
    }
};




const GetUsers = async (req, res) => {
    try {
        const getUser = await UserModel.find();
        res.status(200).json(getUser);
        console.log("get users success");
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error("has problem in the server", error);
    }
};

export {GetUserById, GetUsers}