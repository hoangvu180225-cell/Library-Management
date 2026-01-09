exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, role, status FROM users');
        res.json(rows); // Trả về userInfo
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { status, role } = req.body; // Input: status, role
    try {
        await db.query('UPDATE users SET status = ?, role = ? WHERE id = ?', [status, role, id]);
        res.json({ message: "Cập nhật người dùng thành công" });
    } catch (error) { res.status(500).json({ message: error.message }); }
};