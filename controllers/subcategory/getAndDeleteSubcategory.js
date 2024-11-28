import ProductModel from "../../models/product/productModel.js";
import SubcategoryModel from "../../models/subcategory/subcategoryModel.js";
import dotenv from "dotenv";

dotenv.config();

export const GetSubcategories = async (req, res) => {
  const { subcategory } = req.query;
  const queryFilter = { status: "ACTIVE" };

  if (subcategory) {
    queryFilter.subcategory = { $regex: subcategory, $options: "i" };
  }

  try {
    const subcategories = await SubcategoryModel.find(queryFilter).populate('category', 'category description');
    res.json(subcategories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetSubcategory = async (req, res) => {
  const { id } = req.params;
  try {
    const subcategory = await SubcategoryModel.findOne({ _id: id, status: "ACTIVE" }).populate('category', 'category description');

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategoria no encontrada" });
    }

    return res.json(subcategory);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const DeleteSubcategory = async (req, res) => {
  const { id } = req.params;
  try {
    const subcategory = await SubcategoryModel.findOne({ _id: id, status: "ACTIVE" });
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategoria no encontrada" });
    }

    // Verificar si hay productos asociados a la subcategoría
    const productsUsingSubcategory = await ProductModel.find({ subCategoryId: id, status: "ACTIVE" });
    if (productsUsingSubcategory.length > 0) {
      return res.status(400).json({ message: "Cannot delete subcategory as it is associated with active products." });
    }

    // Inactivar la subcategoría
    subcategory.status = "INACTIVE";
    await subcategory.save();

    res.json({ message: "Subcategoria eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
