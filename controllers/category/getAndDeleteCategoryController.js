import CategoryModel from "../../models/category/categoryModel.js";
import dotenv from "dotenv";
import SubcategoryModel from "../../models/subcategory/subcategoryModel.js";
import ProductModel from "../../models/product/productModel.js";

dotenv.config();

export const GetCategories = async (req, res) => {
  const { category } = req.query;
  const queryFilter = { status: "ACTIVE" };

  if (category) {
    queryFilter.category = { $regex: category, $options: "i" };
  }

  try {
    const categories = await CategoryModel.find(queryFilter);
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await CategoryModel.findOne({ _id: id, status: "ACTIVE" });

    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    const subcategories = await SubcategoryModel.find({
      category: id,
      status: "ACTIVE",
    });

    return res.json({ category, subcategories });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const DeleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await CategoryModel.findOne({ _id: id, status: "ACTIVE" });
    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    // Verificar si hay subcategorías asociadas a productos
    const subcategories = await SubcategoryModel.find({ category: id });
    const subcategoryIds = subcategories.map((subcategory) => subcategory._id);
    const productsUsingCategory = await ProductModel.find({
      $or: [{ categoryId: id }, { subCategoryId: { $in: subcategoryIds } }],
      status: "ACTIVE",
    });

    if (productsUsingCategory.length > 0) {
      return res.status(400).json({
        message:
          "No se puede eliminar la categoría, ya que está asociada a productos activos.",
      });
    }

    // Inactivar todas las subcategorías asociadas
    await SubcategoryModel.updateMany(
      { category: id, status: "ACTIVE" },
      { status: "INACTIVE" }
    );

    // Inactivar la categoría
    category.status = "INACTIVE";
    await category.save();

    res.json({
      message:
        "La categoría y las subcategorías relacionadas se eliminaron correctamente",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
