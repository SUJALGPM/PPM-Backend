const express = require("express");
const { flmRegister, flmLogin } = require("../Controllers/FlmController");
const router = express.Router();


/******************************************  TLM POST ROUTES ************************************************/
router.post("/register/:id",flmRegister);
router.post("/login", flmLogin);




/******************************************  TLM GET ROUTES ************************************************/



module.exports = router;