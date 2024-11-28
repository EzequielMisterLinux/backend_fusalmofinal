import ProductModel from "../../models/product/productModel.js";
import InventoryModel from "../../models/inventory/inventoryModel.js";

export const UpdateInventory = async (req, res) => {
  const { stock, unitPrice, productId } = req.body;
  const { id } = req.params;
  const user = req.user;
  const populateQuery = [
    { path: "productId", select: "_id name description brand" },
  ];

  try {
    const inventory = await InventoryModel.findOne({
      _id: id,
      status: "ACTIVE",
    }).populate(populateQuery);

    if (!inventory) {
      return res.status(404).json({ message: " Inventario no encontrado" });
    }

    if (productId) {
      const product = await ProductModel.findOne({
        _id: productId,
        status: "ACTIVE",
      });

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
    }

    inventory.stock = stock || inventory.stock;
    inventory.unitPrice = unitPrice || inventory.unitPrice;
    inventory.productId = productId || inventory.productId;
    inventory.updatedBy = user.id;

    await inventory.save();

    res.json(inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
