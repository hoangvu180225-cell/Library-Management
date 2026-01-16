const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth'); 

// Route công khai (Ai cũng gọi được)
router.post('/login', authController.login);
router.post('/register', authController.register);

// Route bảo vệ (Phải có Token mới gọi được)
// Middleware sẽ chạy trước, nếu Token ngon lành thì mới cho vào Controller
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;