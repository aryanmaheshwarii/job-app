const express = require('express');
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/auth');
const router = express.Router();

// yha user register, login, logout hoga..

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', isAuthenticated, userController.logout); // agar humare user ke pass cookie nahi hai to vo logout nahi kr payega.
router.get('/getuser', isAuthenticated, userController.getUser);

module.exports = router;