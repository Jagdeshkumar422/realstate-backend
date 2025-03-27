const express = require("express");
const router = express.Router();
const {
  addSliderImage,
  deleteSliderImage,
  getAllSliderImages
} = require("../controllers/sliderImagesController");
// const { protect } = require("../Middlewares/authMiddleware");
const uploads = require("../middlewares/ImageUploads");

router.get("/", getAllSliderImages);
router.post("/",  uploads.single("image"), addSliderImage);
router.delete("/:id",  deleteSliderImage);

module.exports = router;
