const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// --- 1. IMPORT MIDDLEWARE ---
// Import đúng 3 hàm đã tách ra trong file auth.js
const { verifyToken, verifyAdmin, verifyStaff } = require('../middleware/auth');

// --- 2. ÁP DỤNG MIDDLEWARE XÁC THỰC TOKEN CHO TOÀN BỘ ROUTER ---
// Dòng này đảm bảo tất cả các API bên dưới đều phải Đăng nhập mới được gọi
router.use(verifyToken);

// ==============================
// 1. QUẢN LÝ NHÂN VIÊN (STAFF)
// ==============================
// Logic: Chỉ có ADMIN mới được quyền thêm/sửa/xóa nhân viên
router.get('/staffs', verifyAdmin, adminController.getAllStaffs);
router.post('/staffs', verifyAdmin, adminController.createStaff);
router.put('/staffs/:id', verifyAdmin, adminController.updateStaff);
router.delete('/staffs/:id', verifyAdmin, adminController.deleteStaff);

// ==============================
// 2. QUẢN LÝ NGƯỜI DÙNG (USER/ĐỘC GIẢ)
// ==============================
// Logic: STAFF cũng cần quyền xem và tạo/sửa độc giả để làm thẻ thư viện
router.get('/users', verifyStaff, adminController.getAllUsers);
router.post('/users', verifyStaff, adminController.createUser);       
router.put('/users/:id', verifyStaff, adminController.updateUser);    

// Riêng hành động XÓA User thì nên để Admin làm để an toàn dữ liệu (Hoặc đổi thành verifyStaff nếu bạn muốn)
router.delete('/users/:id', verifyAdmin, adminController.deleteUser); 

// ==============================
// 3. QUẢN LÝ GIAO DỊCH (TRANSACTIONS)
// ==============================
// Logic: STAFF cần quyền này để thực hiện quy trình Mượn/Trả sách
router.get('/transactions', verifyStaff, adminController.getAllTransactions);
router.put('/transactions/:id', verifyStaff, adminController.updateTransaction);

// Xóa lịch sử giao dịch là hành động nhạy cảm, nên để Admin
router.delete('/transactions/:id', verifyAdmin, adminController.deleteTransaction);

module.exports = router;