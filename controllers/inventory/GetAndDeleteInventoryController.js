import InventoryModel from "../../models/inventory/inventoryModel.js";
import dotenv from "dotenv";

dotenv.config();

export const GetInventories = async (req, res) => {
  const { name } = req.query;
  const queryFilter = { status: "ACTIVE" };

  if (name) {
    queryFilter.name = { $regex: name, $options: "i" };
  }

  const populateQuery = [
    { path: "productId", select: "_id name description brand" },
  ];

  try {
    const inventories = await InventoryModel.find(queryFilter).populate(
      populateQuery
    );
    res.json(inventories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetInventory = async (req, res) => {
  const { id } = req.params;

  const populateQuery = [
    { path: "productId", select: "_id name description brand" },
  ];

  try {
    const inventory = await InventoryModel.findOne({
      _id: id,
      status: "ACTIVE",
    }).populate(populateQuery);

    if (!inventory) {
      return res.status(404).json({ message: "Inventario no encontrado" });
    }

    return res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const DeleteInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const inventory = await InventoryModel.findOne({
      _id: id,
      status: "ACTIVE",
    });

    if (!inventory) {
      return res.status(404).json({ message: "Inventario no encontrado" });
    }

    inventory.status = "INACTIVE";
    await inventory.save();

    res.json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
