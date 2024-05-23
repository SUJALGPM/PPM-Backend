const express = require("express");
const { flmRegister, flmLogin, createPlan, updatePlan, deletePlan, updateStatePlan } = require("../Controllers/FlmController");
const router = express.Router();


/******************************************  TLM POST ROUTES ************************************************/
router.post("/register/:id", flmRegister);
router.post("/login", flmLogin);
router.post("/create-plan/:id", createPlan);
router.put('/update-plan/:flmId/:planId', updatePlan);
router.delete("/delete-plan/:flmId/:planId", deletePlan);
router.put('/update-state-plan/:flmId/:planId', updateStatePlan);




/******************************************  TLM GET ROUTES ************************************************/








module.exports = router;