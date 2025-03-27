const express = require("express");
const router = express.Router();
const {
 getNews,
 createNews,
 updateNews
} = require("../controllers/newsController");
// const { protect } = require("../Middlewares/authMiddleware");


//this will create a default news record
router.post("/create", createNews);
router.get("/", getNews);
router.patch("/", updateNews);


module.exports = router;
