const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
//const sauce = require("../models/sauce");
const auth = require("../middleware/auth");

router.post("/", auth, sauceCtrl.createSauce);
router.put("/:id", auth, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.use("/", auth, sauceCtrl.getAllSauces);

module.exports = router;