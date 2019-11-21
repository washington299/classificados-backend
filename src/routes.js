const express = require("express");
const multer = require("multer");
const uploadConfig = require("./config/upload");

const InfoApi = require("./controllers/InfoControllers");

const router = express.Router();
const upload = multer(uploadConfig);

router.get("/states", InfoApi.state);
router.post("/categories", upload.single("thumbnail"), InfoApi.categoriesPost);

module.exports = router;
