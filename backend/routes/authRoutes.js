const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// SỬA LẠI DÒNG NÀY: Dùng destructuring để lấy đúng hàm verifyToken
const { verifyToken } = require('../middleware/auth'); 

// --- Route công khai ---
router.post('/login', authController.login);
router.post('/register', authController.register);

// --- Middleware xác thực ---
// Kể từ dòng này trở xuống, tất cả các route đều yêu cầu Token
router.use(verifyToken);

// --- Route bảo vệ ---
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);

module.exports = router;