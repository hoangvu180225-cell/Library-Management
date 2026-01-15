const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../middleware/cloudinary'); // Middleware Multer của bạn

// === Routes cho Nhân viên ===
router.get('/staffs', adminController.getAllStaffs);
router.post('/staffs', upload.single('avatar'), adminController.createStaff); // Nhớ có upload
router.put('/staffs/:id', adminController.updateStaff);
router.delete('/staffs/:id', adminController.deleteStaff);

// === Routes cho Người dùng ===
router.get('/users', adminController.getAllUsers);
// ...

module.exports = router;