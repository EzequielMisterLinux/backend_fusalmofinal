import { Router } from 'express';
import { body } from 'express-validator';
import verifyToken from '../../middlewares/tokenUserAccess.js';
import { CreateSubcategory } from '../../controllers/subcategory/CreateSubcategoryController.js';
import { GetSubcategories, GetSubcategory, DeleteSubcategory } from '../../controllers/subcategory/getAndDeleteSubcategory.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';
import CategoryModel from '../../models/category/categoryModel.js';
import { UpdateSubcategory } from '../../controllers/subcategory/UpdateSubcategoryController.js';

const subcategoryRouter = Router();

subcategoryRouter.post(
  '/subcategories',
  
  body('subcategory').notEmpty().isString(), 
  body('description').notEmpty().isString(), 
  body('categoryId').notEmpty().isMongoId().custom(async (value) => {
    const category = await CategoryModel.findById(value);
    if (!category) {
      throw new Error('La categoría especificada no existe.');
    }
  }),
  validationMiddleware, 
  CreateSubcategory 
);

subcategoryRouter.put('/subcategories/:id', 
  
  body('subcategory').optional().isString(), 
  body('description').optional().isString(), 
  body('categoryId').optional().isMongoId().custom(async (value) => {
    const category = await CategoryModel.findById(value);
    if (!category) {
      throw new Error('La categoría especificada no existe.');
    }
  }),
  validationMiddleware, 
  UpdateSubcategory
);

subcategoryRouter.put('/subcategories/:id',  UpdateSubcategory);
subcategoryRouter.get('/subcategories',  GetSubcategories);
subcategoryRouter.get('/subcategories/:id', GetSubcategory);
subcategoryRouter.delete('/subcategories/:id', DeleteSubcategory);

export default subcategoryRouter;
