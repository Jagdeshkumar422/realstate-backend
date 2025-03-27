const express = require('express')
const { RegisterController, LoginController, getAll, DelUser, getSpecificUser, getuserById, updateUserName } = require('../controllers/userController')
const router = express.Router()
const protect = require("../middlewares/protect")

router.post("/register", RegisterController)
router.put("/profile/:id", updateUserName);
router.post("/login", LoginController)
router.get("/all", getAll)
router.get("/profile/:userId", getSpecificUser)
router.delete("/delete/:id", DelUser)
router.post("/users/bulk", getuserById);
  

module.exports = router