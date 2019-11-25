const multer = require('multer');
const path = require('path');
const uuid = require('uuid');

const uploadCatItem = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'images'),
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
};

const uploadAdImgs = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (_req, file, cb) => {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowed.includes(file.mimetype)) {
        cb(new Error('Apenas imagens são permitidas!!'));
        return;
      }

      cb(null, file.fieldname + uuid.v4() + path.extname(file.originalname));
    },
  }),
};

module.exports = {
  uploadCatItem,
  uploadAdImgs,
};
