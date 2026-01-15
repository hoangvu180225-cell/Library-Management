const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ==============================
// 1. QUẢN LÝ NHÂN VIÊN (STAFF)
// ==============================
router.get('/staffs', adminController.getAllStaffs);
router.post('/staffs', adminController.createStaff);
router.put('/staffs/:id', adminController.updateStaff);
router.delete('/staffs/:id', adminController.deleteStaff);

// ==============================
// 2. QUẢN LÝ NGƯỜI DÙNG (USER)
// ==============================
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);       // Thêm User
router.put('/users/:id', adminController.updateUser);    // Sửa User
router.delete('/users/:id', adminController.deleteUser); // Xóa User

// ==============================
// 3. QUẢN LÝ GIAO DỊCH (TRANSACTIONS) - MỚI BỔ SUNG
// ==============================
router.get('/transactions', adminController.getAllTransactions);
router.put('/transactions/:id', adminController.updateTransaction);
router.delete('/transactions/:id', adminController.deleteTransaction);

module.exports = router;