import express from "express";
import routesUserAccess from "./routes/userRoutes/userAccessRoutes.js";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongodbConnect from "./database/mongodb.js";
import productRouter from "./routes/productRoutes/productRoutes.js";
import { globalErrorMiddleware } from "./middlewares/validationMiddleware.js";
import verifyToken from "./middlewares/tokenUserAccess.js";
import categoryRouter from "./routes/categoryRoutes/categoryRoutes.js";
import subcategoryRouter from "./routes/subcategoryRoutes/subcategoryRoutes.js";
import inventoryRouter from "./routes/inventoryRoutes/inventoryRoutes.js";

dotenv.config();

const server = express();

mongodbConnect();

server.use(cookieParser());
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use(express.json());
server.use("/uploads", express.static(path.join(__dirname, "uploads")));

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5174",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
server.use(cors(corsOptions));

// Rutas
server.use("/api", routesUserAccess);
server.use("/api", productRouter);
server.use("/api", categoryRouter);
server.use("/api", subcategoryRouter);
server.use("/api", inventoryRouter);

// Middleware global para manejo de errores
server.use(globalErrorMiddleware);

server.listen(PORT, () =>
  console.log(`RUN server in : http://localhost:${PORT}`)
);
