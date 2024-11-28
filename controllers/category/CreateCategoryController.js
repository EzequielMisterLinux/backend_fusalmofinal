import CategoryModel from "../../models/category/categoryModel.js";
import dotenv from "dotenv";
dotenv.config();

export const CreateCategory = async (req, res) => {
  const { category, description } = req.body;
  const { id } = req.user;

  if (!category || !description) {
    return res
      .status(400)
      .json({ message: "Categoria y descripcion son requeridas" });
  }

  try {
    const existingCategory = await CategoryModel.findOne({ category });
    if (existingCategory) {
      return res.status(400).json({ message: "Esta categoria ya existe" });
    }

    const newCategory = new CategoryModel({
      category,
      description,
      createdBy: id,
      updatedBy: id,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
