const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Lưu ý: Đã xóa dòng require upload vì bạn không dùng tính năng up ảnh nữa

// ==============================
// 1. ROUTES QUẢN LÝ NHÂN VIÊN (STAFF)
// ==============================
router.get('/staffs', adminController.getAllStaffs);
router.post('/staffs', adminController.createStaff); // Đã bỏ middleware upload
router.put('/staffs/:id', adminController.updateStaff);
router.delete('/staffs/:id', adminController.deleteStaff);

// ==============================
// 2. ROUTES QUẢN LÝ NGƯỜI DÙNG (USER)
// ==============================
router.get('/users', adminController.getAllUsers);

// --- BẠN ĐANG THIẾU 3 DÒNG DƯỚI ĐÂY ---
router.post('/users', adminController.createUser);       // Thêm mới User
router.put('/users/:id', adminController.updateUser);    // Cập nhật User
router.delete('/users/:id', adminController.deleteUser); // Xóa User

module.exports = router;