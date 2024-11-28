import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.URL

const mongodbConnect =  async()=> {
    try {
        await mongoose.connect(url)
        console.log("conexión exitosa");
    } catch (error) {
        console.error("conexión fallida");
    }
}

export default mongodbConnect