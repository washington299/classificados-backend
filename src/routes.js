const express = require('express');
const multer = require('multer');

const AuthMiddleware = require('./middlewares/AuthMiddleware');
const uploadConfig = require('./middlewares/UploadMiddleware');

const InfoApi = require('./controllers/InfoController');
const UserController = require('./controllers/UserController');
const AdController = require('./controllers/AdController');

const router = express.Router();
const uploadCatItem = multer(uploadConfig.uploadCatItem);
const uploadAdImgs = multer(uploadConfig.uploadAdImgs);

// public routes
router.get('/states', InfoApi.state);
router.get('/categories', InfoApi.categoriesGet);
router.get('/islogged', AuthMiddleware.isLogged);

// users routes
router.post('/user/signup', UserController.register);
router.post('/user/signin', UserController.login);
router.get('/user/me', AuthMiddleware.validateToken, UserController.show);
router.put('/user/me', AuthMiddleware.validateToken, UserController.update);
router.get('/logout', AuthMiddleware.validateToken, UserController.logout);

// ads routes
router.post(
  '/ad/add',
  uploadAdImgs.array('img', 10),
  AuthMiddleware.validateToken,
  AdController.store
);

// admin routes
router.post(
  '/categories',
  uploadCatItem.single('thumbnail'),
  AuthMiddleware.validateToken,
  InfoApi.categoriesPost
);

module.exports = router;
