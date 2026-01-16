const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// 1. IMPORT CÁC HÀM TỪ FILE AUTH
const { verifyToken, verifyAdmin, verifyStaff } = require('../middleware/auth');

// --- ROUTE CÔNG KHAI ---
// Người dùng gửi tin nhắn liên hệ (Không cần đăng nhập)
router.post('/', contactController.submitContact);

// --- CÁC ROUTE BẢO VỆ (Cần đăng nhập) ---
// Yêu cầu đăng nhập trước khi thực hiện các thao tác bên dưới
router.use(verifyToken);

// Xem danh sách liên hệ: Admin và Staff đều xem được
router.get('/', verifyStaff, contactController.getAllContacts);

// Trả lời liên hệ: Admin và Staff đều có thể phản hồi khách hàng
router.put('/:id/reply', verifyStaff, contactController.replyContact);

// Xóa liên hệ: Chỉ Admin mới có quyền xóa tin nhắn khỏi Database
router.delete('/:id', verifyAdmin, contactController.deleteContact);

module.exports = router;