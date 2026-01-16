const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth'); // Middleware check admin

// User gửi (Public)
router.post('/', contactController.submitContact);

// Admin quản lý (Cần đăng nhập)
router.get('/', authMiddleware, contactController.getAllContacts);
router.put('/:id/reply', authMiddleware, contactController.replyContact);
router.delete('/:id', authMiddleware, contactController.deleteContact);

module.exports = router;