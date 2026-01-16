require('dotenv').config(); // Load biến môi trường từ .env
const express = require('express');
const cors = require('cors');

const app = express();

// --- 1. Middleware hệ thống ---
app.use(cors()); // Cho phép Front-end (React/Axios) truy cập
app.use(express.json()); // Cho phép đọc dữ liệu JSON từ request body
app.use(express.urlencoded({ extended: true })); // Thêm dòng này

// --- 2. Import Routes ---
const authRoutes = require('./backend/routes/authRoutes');
const bookRoutes = require('./backend/routes/bookRoutes');
const adminRoutes = require('./backend/routes/adminRoutes');
const transactionRoutes = require('./backend/routes/transactionRoutes');
const reviewRoutes = require('./backend/routes/reviewRoutes');
const contactRoutes = require('./backend/routes/contactRoutes');

// --- 3. Đăng ký Routes (Khớp với các bảng API của bạn) ---

// Bảng 1: Auth & User (Đăng nhập, Đăng ký)
app.use('/api/auth', authRoutes);

// Bảng 2: Books (Lấy danh sách, Chi tiết, Xếp hạng)
app.use('/api/books', bookRoutes);

// Bảng 3: Admin (Quản lý users và nhân viên)
app.use('/api/admin', adminRoutes);

// Bảng 4: Transaction (Mượn, Mua, Tủ sách cá nhân)
app.use('/api/transaction', transactionRoutes);

// Bảng 5: Reviews (Đánh giá sách)
app.use('/api/reviews', reviewRoutes);

// Bảng 6: Contact (Liên hệ)
app.use('/api/contacts', contactRoutes);

// --- 4. Xử lý lỗi tập trung (Optional) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống!' });
});

// --- 5. Khởi chạy Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('----------------------------------------------');
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📅 Thời gian khởi tạo: ${new Date().toLocaleString()}`);
    console.log('----------------------------------------------');
});