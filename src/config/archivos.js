const multer = require("multer");
const path = require("path");

const diskStorageequipos = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/img/equipos"));
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

        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
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


