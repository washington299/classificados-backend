const express = require('express');
const multer = require('multer');

const AuthMiddleware = require('./middlewares/AuthMiddleware');
const uploadConfig = require('./middlewares/UploadMiddleware');

const InfoApi = require('./controllers/InfoController');
const UserController = require('./controllers/UserController');

const router = express.Router();
const upload = multer(uploadConfig);

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

// admin routes
router.post(
  '/categories',
  AuthMiddleware.validateToken,
  upload.single('thumbnail'),
  InfoApi.categoriesPost
);

module.exports = router;
