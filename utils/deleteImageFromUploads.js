import fs from "node:fs/promises";

export const deleteImageFromUploads = async (imagePath) => {
  try {
    await fs.unlink(imagePath);
  } catch (error) {
    console.log("Error al eliminar la imagen");
  }
};
