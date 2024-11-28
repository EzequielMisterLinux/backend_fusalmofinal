import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const imageExtension = file.mimetype.split("/")[1];
  const validImageExtensions = ["jpg", "jpeg", "png", "webp"];
  if (validImageExtensions.includes(imageExtension)) {
    return cb(null, true);
  }

  return cb(
    new multer.MulterError(
      "LIMIT_UNEXPECTED_FILE",
      "Formato de imagen no permitido"
    )
  );
};

const uploadImageProduct = multer({ storage, fileFilter });

export default uploadImageProduct;
