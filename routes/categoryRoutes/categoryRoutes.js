import { Router } from "express";
import { body } from "express-validator";
import verifyToken from "../../middlewares/tokenUserAccess.js";
import { CreateCategory } from "../../controllers/category/CreateCategoryController.js";
import {
  GetCategories,
  GetCategory,
  DeleteCategory,
} from "../../controllers/category/getAndDeleteCategoryController.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { UpdateCategory } from "../../controllers/category/UpdateCategoryController.js";

const categoryRouter = Router();

categoryRouter.post(
  "/categories",
  verifyToken,
  body("category").notEmpty().isString(),
  body("description").notEmpty().isString(),
  validationMiddleware,
  CreateCategory
);

categoryRouter.put(
  "/categories/:id",
  verifyToken,
  body("category").optional().isString(),
  body("description").optional().isString(),
  validationMiddleware,
  UpdateCategory
);

categoryRouter.get("/categories", verifyToken, GetCategories);
categoryRouter.get("/categories/:id", verifyToken, GetCategory);
categoryRouter.delete("/categories/:id", verifyToken, DeleteCategory);

export default categoryRouter;
