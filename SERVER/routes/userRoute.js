const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/addUser", userController.addUser);
router.post("/loginUser", userController.loginUser);
router.get("/fetchRoleName/:roleId", userController.fetchRoleName)
module.exports = router;
