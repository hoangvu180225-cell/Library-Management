const express = require('express');
const router = express.Router();
const db = require('../db'); // Import file kết nối ở trên

// 1. API Lấy danh sách người dùng từ MySQL
router.get('/users', async (req, res) => {
    try {
        // Câu lệnh SQL truy vấn
        const [rows] = await db.query('SELECT id, username, email, role, status FROM users');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Lỗi kết nối database", error });
    }
});

// 2. API Xóa người dùng
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: "Xóa người dùng thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Không thể xóa người dùng" });
    }
});

module.exports = router;