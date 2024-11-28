import { Router } from "express";
import verifyToken from "../../middlewares/tokenUserAccess.js";
import { body } from "express-validator";

import { CreateInventory } from "../../controllers/inventory/CreateInventoryController.js";
import {
  GetInventories,
  GetInventory,
  DeleteInventory,
} from "../../controllers/inventory/GetAndDeleteInventoryController.js";
import { UpdateInventory } from "../../controllers/inventory/UpdateInventoryController.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const inventoryRoutes = Router();

inventoryRoutes.get("/inventories",  GetInventories);

inventoryRoutes.get("/inventories/:id",  GetInventory);

inventoryRoutes.post(
  "/inventories",
  
  body("stock")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("stock debe ser mayor a cero"),
  body("productId")
    .notEmpty()
    .isMongoId()
    .withMessage("productId debe ser un id válido"),
  body("unitPrice")
    .notEmpty()
    .isFloat({ min: 0.01 })
    .withMessage("precio debe ser mayor a cero"),
  validationMiddleware,
  CreateInventory
);

inventoryRoutes.put(
  "/inventories/:id",
  
  body("stock")
    .optional()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("stock debe ser mayor a cero"),
  body("productId")
    .optional()
    .notEmpty()
    .isMongoId()
    .withMessage("productId debe ser un id válido"),
  body("unitPrice")
    .optional()
    .notEmpty()
    .isFloat({ min: 0.01 })
    .withMessage("precio debe ser mayor a cero"),
  validationMiddleware,
  UpdateInventory
);

inventoryRoutes.delete("/inventories/:id", DeleteInventory);

export default inventoryRoutes;
