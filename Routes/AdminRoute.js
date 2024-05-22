const express = require("express");
const { adminRegister, adminLogin } = require("../Controllers/adminController");
const router = express.Router();


/************************************* ADMIN POST ROUTES **************************************/
router.post("/register",adminRegister);
router.post("/login",adminLogin);




/************************************* ADMIN GET ROUTES **************************************/




module.exports = router;