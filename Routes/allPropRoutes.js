const express = require("express");
const router = express.Router();
const {
  getPropertyById,
  getLatestProperties
} = require("../controllers/allPropController");

router.get("/:type/:id", getPropertyById);
router.get("/latest", getLatestProperties);


module.exports = router;