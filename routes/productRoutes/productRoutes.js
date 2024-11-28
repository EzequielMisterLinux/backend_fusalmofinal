import { Router } from "express";
import { body } from "express-validator";
import uploadImageProduct from "../../middlewares/uploadImage.js";
import verifyToken from "../../middlewares/tokenUserAccess.js";

import { CreateProduct } from "../../controllers/product/CreateProductController.js";

import {
  GetProduct,
  GetProducts,
  DeleteProduct,
} from "../../controllers/product/GetAndDeleteProductController.js";

import {
  UpdateProduct,
  UpdateImageProduct,
} from "../../controllers/product/UpdateProductController.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const productRouter = Router();

productRouter.get("/products", verifyToken, GetProducts);
productRouter.get("/products/:id", verifyToken, GetProduct);
productRouter.post(
  "/products",
  verifyToken,
  uploadImageProduct.single("image"),
  body("name")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Nombre del producto debe tener al menos 5 caracteres"),
  body("description")
    .notEmpty()
    .isLength({ min: 10 })
    .withMessage("Descripción debe tener al menos 10 caracteres"),
  body("brand").notEmpty().isString(),
  body("price").notEmpty().isDecimal(),
  body("categoryId").notEmpty().isMongoId(),
  body("subCategoryId").notEmpty().isMongoId(),
  validationMiddleware,
  CreateProduct
);
productRouter.put(
  "/products/:id",
  verifyToken,
  body("description")
    .optional()
    .isString()
    .isLength({ min: 10 })
    .withMessage("Descripción debe tener al menos 10 caracteres"),
  body("brand").optional().isString(),
  body("price").optional().isDecimal(),
  body("categoryId").optional().isMongoId(),
  body("subCategoryId").optional().isMongoId(),
  validationMiddleware,
  UpdateProduct
);
productRouter.put(
  "/products/upload/:id",
  verifyToken,
  uploadImageProduct.single("image"),
  UpdateImageProduct
);

productRouter.delete("/products/:id", verifyToken, DeleteProduct);

export default productRouter;
