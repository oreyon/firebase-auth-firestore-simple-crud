const express = require('express');
const router = express.Router();

const {login, loginWithGoogle, logout} = require('../controllers/auth');

router.route('/login').post(login);
router.route('/login/google').post(loginWithGoogle);
router.route('/logout').get(logout);

module.exports = router;