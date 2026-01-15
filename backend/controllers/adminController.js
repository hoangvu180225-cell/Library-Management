const db = require('../db'); 

// --- A. QUẢN LÝ NHÂN VIÊN (STAFF) ---

// 1. GET: Lấy danh sách nhân viên
exports.getAllStaffs = async (req, res) => {
    try {
        // Lấy user_id đổi tên thành id cho Frontend dễ dùng
        // Chỉ lấy role là ADMIN, LIBRARIAN, STOCK_MANAGER (bỏ MEMBER)
        const query = `
            SELECT user_id as id, full_name, email, phone, role, status, avatar, created_at 
            FROM Users 
            WHERE role IN ('ADMIN', 'LIBRARIAN', 'STOCK_MANAGER') 
            ORDER BY user_id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. POST: Thêm nhân viên
exports.createStaff = async (req, res) => {
    const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;
    const { full_name, email, phone, role, status } = req.body;

    // Database yêu cầu password NOT NULL -> Set mặc định
    const defaultPass = '123456'; 

    try {
        const [exists] = await db.query('SELECT user_id FROM Users WHERE email = ?', [email]);
        if (exists.length > 0) return res.status(400).json({ message: "Email đã tồn tại!" });

        // Không insert hire_date vì DB không có cột đó
        const query = `
            INSERT INTO Users (full_name, email, password, phone, role, status, avatar) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Lưu ý: role và status phải đúng value trong ENUM ('LIBRARIAN', 'ACTIVE'...)
        await db.query(query, [full_name, email, defaultPass, phone, role, status || 'ACTIVE', avatarPath]);
        
        res.status(201).json({ message: "Tạo nhân viên thành công" });
    } catch (error) {
        // Log lỗi ra terminal để dễ debug
        console.error("Lỗi tạo NV:", error); 
        res.status(500).json({ message: error.message });
    }
};

// 3. PUT: Cập nhật
exports.updateStaff = async (req, res) => {
    const { id } = req.params; // Đây là user_id
    const { full_name, phone, role, status } = req.body;

    try {
        const query = `
            UPDATE Users 
            SET full_name = ?, phone = ?, role = ?, status = ?
            WHERE user_id = ?
        `;
        await db.query(query, [full_name, phone, role, status, id]);
        
        res.json({ message: "Cập nhật thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. DELETE
exports.deleteStaff = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Users WHERE user_id = ?', [id]);
        res.json({ message: "Đã xóa nhân viên" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- B. QUẢN LÝ USER THƯỜNG ---
exports.getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT user_id as id, full_name, email, phone, role, status, points, tier 
            FROM Users 
            WHERE role = 'MEMBER' 
            ORDER BY user_id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};