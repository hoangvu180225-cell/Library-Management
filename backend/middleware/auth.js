const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // 1. Lấy token từ header "Authorization"
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Không tìm thấy token, quyền truy cập bị từ chối!" });
    }

    try {
        // 2. Giải mã token
        const decoded = jwt.verify(token, 'SECRET_KEY');
        
        // 3. Gán thông tin user vào request để các Controller sau này sử dụng
        req.user = decoded; 
        next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
        res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

module.exports = auth;