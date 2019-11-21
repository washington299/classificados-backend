const multer = require("multer");
const path = require("path");

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "images"),
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
};
