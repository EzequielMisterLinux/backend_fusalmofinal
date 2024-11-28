import CategoryModel from "../../models/category/categoryModel.js";

export const UpdateCategory = async (req, res) => {
  const { id } = req.params;
  const { category, description } = req.body;
  const { id: userId } = req.user;

  try {
    const existingCategory = await CategoryModel.findOne({ _id: id, status: "ACTIVE" });

    if (!existingCategory) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    existingCategory.category = category || existingCategory.category;
    existingCategory.description = description || existingCategory.description;
    existingCategory.updatedBy = userId;
    existingCategory.updatedAt = Date.now();

    await existingCategory.save();

    res.json({ message: "Categoría actualizada con éxito", category: existingCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
