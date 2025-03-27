const express = require("express");
const router = express.Router();
const {
  getAllBuy,
  getBuyById,
  createBuy,
  updateBuyById,
  deleteBuyById,
  removeImage,
  getAllBuyWithFilter
} = require("../controllers/buyController");
const uploads =require ("../middlewares/ImageUploads");
const { protect } = require("../middlewares/protect");


// const { protect } = require("../Middlewares/authMiddleware");

router.get("/", getAllBuy);
router.get("/search", getAllBuyWithFilter);
router.post("/", uploads.fields([{ name: "image" }]), createBuy);
router.get("/:id", getBuyById);
router.put("/:id",uploads.fields([{ name: "image" }]), updateBuyById);
router.delete("/:id", deleteBuyById);
router.get("/image/:propertyId/:imageId",removeImage)

module.exports = router;
