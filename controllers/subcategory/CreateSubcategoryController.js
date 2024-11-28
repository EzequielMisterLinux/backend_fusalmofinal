import SubcategoryModel from '../../models/subcategory/subcategoryModel.js';
import CategoryModel from '../../models/category/categoryModel.js';

export const CreateSubcategory = async (req, res) => {
  const { subcategory, description, categoryId } = req.body;
  const { id } = req.user;

  try {
    const existingCategory = await CategoryModel.findById(categoryId);
    if (!existingCategory) {
      return res.status(400).json({ message: 'La categoría especificada no existe.' });
    }

    const existingSubcategory = await SubcategoryModel.findOne({
      subcategory,
      category: categoryId,
    });

    if (existingSubcategory) {
      return res.status(400).json({ message: 'Ya existe una subcategoría con este nombre en esta categoría.' });
    }

    const newSubcategory = new SubcategoryModel({
      subcategory,
      description,
      category: categoryId,
      createdBy: id,
      updatedBy: id,
    });

    await newSubcategory.save();

    res.status(201).json(newSubcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
