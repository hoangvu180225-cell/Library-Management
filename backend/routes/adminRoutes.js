const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// --- 1. IMPORT MIDDLEWARE ---
// Đảm bảo bạn đã có file này (xem code ở phần 2 bên dưới)
const auth = require('../middleware/auth');

// --- 2. ÁP DỤNG MIDDLEWARE CHO TOÀN BỘ ROUTER ---

// ==============================
// 1. QUẢN LÝ NHÂN VIÊN (STAFF)
// ==============================
router.get('/staffs', auth, adminController.getAllStaffs);
router.post('/staffs', auth, adminController.createStaff);
router.put('/staffs/:id', auth, adminController.updateStaff);
router.delete('/staffs/:id', auth, adminController.deleteStaff);

// ==============================
// 2. QUẢN LÝ NGƯỜI DÙNG (USER)
// ==============================
router.get('/users', auth, adminController.getAllUsers);
router.post('/users', auth, adminController.createUser);       
router.put('/users/:id', auth, adminController.updateUser);    
router.delete('/users/:id', auth, adminController.deleteUser); 

// ==============================
// 3. QUẢN LÝ GIAO DỊCH (TRANSACTIONS)
// ==============================
router.get('/transactions', auth, adminController.getAllTransactions);
router.put('/transactions/:id', auth, adminController.updateTransaction);
router.delete('/transactions/:id', auth, adminController.deleteTransaction);

module.exports = router;