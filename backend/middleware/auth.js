const jwt = require('jsonwebtoken');

// --- 1. Xác thực Token (Kiểm tra đăng nhập) ---
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Vui lòng đăng nhập!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY');
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token không hợp lệ!" });
    }
};

// --- 2. Chỉ dành cho ADMIN (Quyền cao nhất) ---
// Dùng cho: Quản lý nhân viên, Xóa người dùng, Thống kê doanh thu...
const verifyAdmin = (req, res, next) => {
    if (!req.user) return res.status(403).json({ message: "Chưa xác thực!" });

    if (req.user.role === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({ message: "Quyền truy cập bị từ chối! Chỉ Admin mới được thực hiện." });
    }
};

// --- 3. Dành cho STAFF và ADMIN (Quyền quản lý vận hành) ---
// Dùng cho: Thêm/Sửa sách, Mượn/Trả sách...
const verifyStaff = (req, res, next) => {
    if (!req.user) return res.status(403).json({ message: "Chưa xác thực!" });

    // Admin cũng có quyền của Staff
    if (req.user.role === 'ADMIN' || req.user.role === 'STAFF') {
        next();
    } else {
        return res.status(403).json({ message: "Quyền truy cập bị từ chối! Bạn không phải nhân viên." });
    }
};

// Xuất ra 3 hàm
module.exports = { verifyToken, verifyAdmin, verifyStaff };