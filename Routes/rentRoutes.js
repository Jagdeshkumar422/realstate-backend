const express = require("express");
const router = express.Router();
const {
  getAllRent,
  getRentById,
  createRent,
  updateRentById,
  deleteRentById,
  getAllRentWithFilter,
  removeImage
} = require("../controllers/rentController");

const uploads =require ("../middlewares/ImageUploads");
// const { protect } = require("../Middlewares/authMiddleware");

router.get("/", getAllRent);
router.get("/search",getAllRentWithFilter)
router.post("/", uploads.fields([{ name: "image" }]), createRent);
router.get("/:id", getRentById);
router.put("/:id",uploads.fields([{ name: "image" }]), updateRentById);
router.delete("/:id", deleteRentById);
router.get("/image/:propertyId/:imageId",removeImage)

module.exports = router;
