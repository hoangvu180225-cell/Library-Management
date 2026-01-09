const db = require('../db');

exports.getAllBooks = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM books');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRanking = async (req, res) => {
    const { type } = req.query; // week/month/year
    try {
        const [rows] = await db.query('SELECT * FROM books ORDER BY views DESC LIMIT 5');
        res.json(rows); // Trả về top 5 books
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getDetail = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Không tìm thấy sách" });
        res.json(rows[0]);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateBook = async (req, res) => {
    const { title, author, price } = req.body;
    try {
        await db.query('UPDATE books SET title=?, author=?, price=? WHERE id=?', [title, author, price, req.params.id]);
        res.json({ message: "Cập nhật thành công" });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteBook = async (req, res) => {
    try {
        await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);
        res.json({ message: "Xóa sách thành công" });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createBook = async (req, res) => {
    const { title, author, price } = req.body; // bookInfo
    try {
        await db.query('INSERT INTO books (title, author, price) VALUES (?, ?, ?)', [title, author, price]);
        res.json({ message: "Tạo sách mới thành công" });
    } catch (error) { res.status(500).json({ message: error.message }); }
};