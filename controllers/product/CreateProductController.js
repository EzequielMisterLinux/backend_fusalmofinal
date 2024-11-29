import ProductModel from "../../models/product/productModel.js";
import CategoryModel from "../../models/category/categoryModel.js";
import SubcategoryModel from "../../models/subcategory/subcategoryModel.js";
import { deleteImageFromUploads } from "../../utils/deleteImageFromUploads.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config();

export const CreateProduct = async (req, res) => {
  const { name, description, brand, price, categoryId, subCategoryId } =
    req.body;
 
  const image = req.file.filename;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const imagesUploadsPath = path.join(__dirname, "../../uploads");

  try {
    const category = await CategoryModel.findById(categoryId);
    const subCategory = await SubcategoryModel.findById(subCategoryId);

    if (!category) {
      if (req.file) {
        await deleteImageFromUploads(
          `${imagesUploadsPath}/${req.file.filename}`
        );
      }
      return res.status(400).json({ message: "La categoría no existe" });
    }

    if (!subCategory) {
      if (req.file) {
        await deleteImageFromUploads(
          `${imagesUploadsPath}/${req.file.filename}`
        );
      }
      return res.status(400).json({ message: "La subcategoría no existe" });
    }

    const newProduct = new ProductModel({
      name,
      description,
      brand,
      price,
      categoryId,
      subCategoryId,
      image: `/uploads/${image}`,
    });

    await newProduct.save();

    const populateQuery = [
      { path: "categoryId", select: "_id category description" },
      { path: "subCategoryId", select: "_id subcategory description" },
    ];

    const getProduct = await ProductModel.findById(newProduct._id).populate(
      populateQuery
    );

    res.status(201).json(getProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
