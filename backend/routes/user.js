const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user.js');
const checkPassword = require('../controllers/password.js');

router.post('/signup', checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;