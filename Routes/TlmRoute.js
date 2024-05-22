const express = require("express");
const { tlmRegister, tlmLogin } = require("../Controllers/TlmController");
const router = express.Router();


/******************************************  TLM POST ROUTES ************************************************/
router.post("/register/:id", tlmRegister);
router.post("/login", tlmLogin);




/******************************************  TLM GET ROUTES ************************************************/



module.exports = router;