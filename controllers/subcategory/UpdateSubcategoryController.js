import SubcategoryModel from "../../models/subcategory/subcategoryModel.js";
import CategoryModel from "../../models/category/categoryModel.js";

export const UpdateSubcategory = async (req, res) => {
  const { id } = req.params;
  const { subcategory, description, categoryId } = req.body;
  const { id: userId } = req.user;

  try {
    const existingSubcategory = await SubcategoryModel.findOne({ _id: id, status: "ACTIVE" });

    if (!existingSubcategory) {
      return res.status(404).json({ message: "Subcategoria no encontrada" });
    }

    if (categoryId) {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "La categoría especificada no existe." });
      }
    }

    existingSubcategory.subcategory = subcategory || existingSubcategory.subcategory;
    existingSubcategory.description = description || existingSubcategory.description;
    existingSubcategory.category = categoryId || existingSubcategory.category;
    existingSubcategory.updatedBy = userId;
    existingSubcategory.updatedAt = Date.now();

    await existingSubcategory.save();

    res.json({ message: "Subcategoría actualizada con exito", subcategory: existingSubcategory });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
