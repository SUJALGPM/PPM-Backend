const express = require("express");
const { slmRegister, slmLogin } = require("../Controllers/SlmController");
const router = express.Router();


/******************************************  TLM POST ROUTES ************************************************/
router.post("/register/:id", slmRegister);
router.post("/login", slmLogin);




/******************************************  TLM GET ROUTES ************************************************/



module.exports = router;