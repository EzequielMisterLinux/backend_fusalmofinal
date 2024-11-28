import ProductModel from "../../models/product/productModel.js";
import InventoryModel from "../../models/inventory/inventoryModel.js";

export const CreateInventory = async (req, res) => {
  const { stock, productId, unitPrice } = req.body;
  const { id } = req.user;

  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(400).json({ message: "El producto no existe" });
    }

    const totalRegisters = await InventoryModel.find({}).countDocuments();
    const code = `ABSINV-${totalRegisters + 1}`;

    const newInventory = new InventoryModel({
      code,
      stock,
      unitPrice,
      productId,
      createdBy: id,
      updatedBy: id,
    });

    await newInventory.save();

    const populateQuery = [
      { path: "productId", select: "_id name description brand" },
    ];

    const getInventory = await InventoryModel.findById(
      newInventory._id
    ).populate(populateQuery);

    res.status(201).json(getInventory);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
