const db = require('../db'); 

// --- HÀM PHỤ: TÍNH TIER THEO ĐIỂM ---
// Logic: 0-199: Bronze, 200-399: Silver, 400-599: Gold, 600-799: Platinum, 800+: Diamond
const calculateTier = (points) => {
    const p = points || 0; // Nếu null/undefined thì tính là 0
    if (p < 200) return 'BRONZE';
    if (p < 400) return 'SILVER';
    if (p < 600) return 'GOLD';
    if (p < 800) return 'PLATINUM';
    return 'DIAMOND';
};

// --- A. QUẢN LÝ NHÂN VIÊN (STAFF) ---

// 1. GET: Lấy danh sách nhân viên
exports.getAllStaffs = async (req, res) => {
    try {
        const query = `
            SELECT user_id as id, full_name, email, phone, role, status, avatar, created_at 
            FROM Users 
            WHERE role IN ('ADMIN', 'STAFF') 
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
    const { full_name, email, phone, role, status } = req.body;
    const defaultPass = '123456'; 

    try {
        const [exists] = await db.query('SELECT user_id FROM Users WHERE email = ?', [email]);
        if (exists.length > 0) return res.status(400).json({ message: "Email đã tồn tại!" });

        const query = `
            INSERT INTO Users (full_name, email, password, phone, role, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        // Đã xóa avatarPath để tránh lỗi undefined
        await db.query(query, [full_name, email, defaultPass, phone, role, status || 'ACTIVE']);
        
        res.status(201).json({ message: "Tạo nhân viên thành công" });
    } catch (error) {
        console.error("Lỗi tạo NV:", error); 
        res.status(500).json({ message: error.message });
    }
};

// 3. PUT: Cập nhật nhân viên
exports.updateStaff = async (req, res) => {
    const { id } = req.params;
    const { full_name, phone, role, status } = req.body;
    
    // GIẢ SỬ: req.user chứa thông tin người đang đăng nhập (lấy từ Token/Session)
    const currentUserRole = req.user ? req.user.role : 'ADMIN'; // Mặc định test là ADMIN

    // LOGIC CHẶN: Nếu là STAFF thì không được sửa ai cả (hoặc chỉ được sửa chính mình - tùy logic)
    if (currentUserRole === 'STAFF') {
        return res.status(403).json({ message: "Bạn không có quyền sửa thông tin nhân viên!" });
    }

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

// 4. DELETE Nhân viên
exports.deleteStaff = async (req, res) => {
    const { id } = req.params;

    // LOGIC CHẶN: Chỉ ADMIN mới được xóa
    const currentUserRole = req.user ? req.user.role : 'ADMIN'; 
    if (currentUserRole !== 'ADMIN') {
        return res.status(403).json({ message: "Chỉ Admin mới được xóa nhân viên!" });
    }

    try {
        await db.query('DELETE FROM Users WHERE user_id = ?', [id]);
        res.json({ message: "Đã xóa nhân viên" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --- B. QUẢN LÝ USER THƯỜNG ---

// 1. GET Users
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

// 2. CREATE User (Tự động tính Tier)
exports.createUser = async (req, res) => {
    // Không lấy tier từ body nữa
    const { full_name, email, phone, points, status } = req.body;
    const defaultPass = '123456'; 

    // Tự động tính Tier dựa trên Points
    const calculatedTier = calculateTier(points);

    try {
        const [exists] = await db.query('SELECT user_id FROM Users WHERE email = ?', [email]);
        if (exists.length > 0) return res.status(400).json({ message: "Email đã tồn tại!" });

        const query = `
            INSERT INTO Users (full_name, email, password, phone, role, status, tier, points) 
            VALUES (?, ?, ?, ?, 'MEMBER', ?, ?, ?)
        `;
        // Truyền calculatedTier vào query
        await db.query(query, [full_name, email, defaultPass, phone, status || 'ACTIVE', calculatedTier, points || 0]);
        
        res.status(201).json({ message: "Tạo người dùng thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. UPDATE User (Tự động cập nhật Tier khi sửa điểm)
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    // Không nhận tier từ body, chỉ nhận points
    const { full_name, phone, email, points, status } = req.body;

    // Tự động tính lại Tier theo điểm mới
    const newTier = calculateTier(points);

    try {
        const [user] = await db.query('SELECT user_id FROM Users WHERE user_id = ?', [id]);
        if (user.length === 0) return res.status(404).json({ message: "Người dùng không tồn tại" });

        const [emailCheck] = await db.query(
            'SELECT user_id FROM Users WHERE email = ? AND user_id != ?', 
            [email, id]
        );
        if (emailCheck.length > 0) return res.status(400).json({ message: "Email này đã được sử dụng!" });

        const query = `
            UPDATE Users 
            SET full_name = ?, phone = ?, email = ?, tier = ?, points = ?, status = ?
            WHERE user_id = ?
        `;

        // Update cả tier và points
        await db.query(query, [
            full_name, 
            phone, 
            email, 
            newTier, // Dùng tier vừa tính được
            points, 
            status, 
            id
        ]);
        
        res.json({ message: "Cập nhật thông tin thành công" });

    } catch (error) {
        console.error("Lỗi update user:", error);
        res.status(500).json({ message: "Lỗi Server: " + error.message });
    }
};

// 4. DELETE User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM Users WHERE user_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để xóa" });
        }
        res.json({ message: "Đã xóa người dùng thành công" });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                message: "Không thể xóa: Người dùng này đang có dữ liệu giao dịch." 
            });
        }
        console.error("Lỗi delete user:", error);
        res.status(500).json({ message: "Lỗi Server: " + error.message });
    }
};