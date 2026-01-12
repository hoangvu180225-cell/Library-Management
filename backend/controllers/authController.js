const db = require('../db');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        await db.query(
            'INSERT INTO users (full_name, email, password, phone) VALUES (?, ?, ?, ?)',
            [name, email, password, phone]
        );
        res.json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi đăng ký", error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    // ... Logic kiểm tra email/password trong database ...
    
    // Giả sử user hợp lệ, tạo token chứa ID và Role
    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        'SECRET_KEY', 
        { expiresIn: '1d' } // Token hết hạn sau 1 ngày
    );

    res.json({
        token,
        userInfo: { id: user.id, name: user.username, role: user.role }
    });
};