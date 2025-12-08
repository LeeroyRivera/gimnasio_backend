const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Asegura que el directorio exista antes de usarlo como destino
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
const multer = require("multer");
const path = require("path");

const diskStorageequipos = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "../../public/img/equipos");
    ensureDir(dest);
    cb(null, dest);
  },

  filename: (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      const uniqueSuffix = Math.round(Math.random() * (99999 - 10000)) + 10000;

      cb(
        null,
        "equipos-" +
          Date.now() +
          uniqueSuffix +
          "-" +
          file.mimetype.replace("/", ".")
      );
    }
  },
});

exports.uploadImagenEquipos = multer({
  storage: diskStorageequipos,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo archivos png, jpeg o jpg"));
    }
  },
  limits: {
    fileSize: 20000000, // 20MB
  },
}).single("imagen");

const diskStoragePagos = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "../../public/img/pagos"); // carpeta destino
    ensureDir(dest);
    cb(null, dest);
  },

  filename: (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      const uniqueSuffix = Math.round(Math.random() * (99999 - 10000)) + 10000;
      cb(
        null,
        "comprobante-" +
          Date.now() +
          uniqueSuffix +
          "-" +
          file.mimetype.replace("/", ".")
      );
    }
  },
});

exports.uploadComprobantePago = multer({
  storage: diskStoragePagos,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo archivos PNG, JPEG o JPG"));
    }
  },
  limits: {
    fileSize: 20000000, // 20MB
  },
}).single("comprobante");
