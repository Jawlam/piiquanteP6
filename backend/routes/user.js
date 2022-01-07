const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const checkEmail = require('../middleware/check-email');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;