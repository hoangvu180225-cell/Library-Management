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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ Email và Mật khẩu!" });
        }

        const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
        }

        if (user.status === 'BANNED') {
            return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Mật khẩu không chính xác!" });
        }

        // 6. Tạo Token
        const token = jwt.sign(
            { 
                id: user.user_id,      // Mapping với user_id trong DB
                role: user.role,       // ADMIN, MEMBER, ...
                email: user.email 
            }, 
            'SECRET_KEY',              // Nên để trong file .env
            { expiresIn: '1d' }
        );

        // 7. Trả về kết quả
        res.json({
            message: "Đăng nhập thành công!",
            token,
            userInfo: {
                id: user.user_id,
                name: user.full_name,  // DB là full_name, không phải username
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                tier: user.tier        // Trả thêm hạng thành viên để hiển thị cho oách
            }
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};