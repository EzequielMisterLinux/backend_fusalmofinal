import ProductModel from "../../models/product/productModel.js";
import dotenv from "dotenv";

dotenv.config();

export const GetProducts = async (req, res) => {
  const { name } = req.query;
  const queryFilter = { status: "ACTIVE" };

  if (name) {
    queryFilter.name = { $regex: name, $options: "i" };
  }

  const populateQuery = [
    { path: "categoryId", select: "_id category description" },
    { path: "subCategoryId", select: "_id subcategory description" },
  ];

  try {
    const products = await ProductModel.find(queryFilter).populate(
      populateQuery
    );
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetProduct = async (req, res) => {
  const { id } = req.params;

  const populateQuery = [
    { path: "categoryId", select: "_id category description" },
    { path: "subCategoryId", select: "_id subcategory description" },
  ];

  try {
    const product = await ProductModel.findOne({
      _id: id,
      status: "ACTIVE",
    }).populate(populateQuery);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const DeleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findOne({ _id: id, status: "ACTIVE" });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = "INACTIVE";
    await product.save();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
