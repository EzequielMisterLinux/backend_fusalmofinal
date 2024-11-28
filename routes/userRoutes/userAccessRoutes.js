import express from "express";
import dotenv from "dotenv";
import UserModel from "../../models/userModel/userModel.js";
import verifyToken from "../../middlewares/tokenUserAccess.js";
import { 
    CreateNewUser,
    UpdatePassw,
    UpdateUserById ,
    DeleteEmployee
} from "../../controllers/admin/CreateUserAndUpdate.js";
import { 
    GetUserById,
    GetUsers 
} from "../../controllers/admin/GetUserController.js";
import { 
    SendResetPasswordEmail,
    VerifyResetTokenAndUpdatePassword 
} from "../../controllers/admin/ResetPasswordController.js";
import AccessLogin from "../../controllers/admin/AccessUserController.js";

import UserLogoutController from "../../controllers/admin/LogoutController.js";

import generarReporte from "../../controllers/product/ReportProductController.js";


dotenv.config();

const routesUserAccess = express.Router();

// Endpoint de registro
routesUserAccess.post('/userregister', verifyToken, CreateNewUser);

//Endpoint para cerrar la sesión
routesUserAccess.post('/logout',  UserLogoutController);

// Endpoint para obtener un usuario por id
routesUserAccess.get('/users/:id', verifyToken, GetUserById);

// Endpoint para obtener todos los usuarios
routesUserAccess.get('/users', verifyToken, GetUsers);

// Endpoint para actualizar el usuario por id
routesUserAccess.put('/users/:id', verifyToken, UpdateUserById);

// Endpoint para ingresar al sistema "LOGIN"
routesUserAccess.post('/login', AccessLogin);

// Endpoint para actualizar la contraseña
routesUserAccess.put('/loginpassw', verifyToken, UpdatePassw);

// Endpoint para enviar email si el usuario ha olvidado la contraseña
routesUserAccess.post('/send-reset-password-email', SendResetPasswordEmail);

// Endpoint para verificar el token y actualizar la contraseña
routesUserAccess.post('/verify-reset-password-token', VerifyResetTokenAndUpdatePassword);

//Endpoint para borrar un empleado
routesUserAccess.delete('/users/:id', verifyToken, DeleteEmployee)

// Endpoint de una ruta protegida
routesUserAccess.get('/protected', verifyToken, (req, res) => {
    res.send(`Hola ${req.user.username}, esta es una ruta protegida.`);
});

routesUserAccess.get('/reporte', generarReporte);

export default routesUserAccess;
