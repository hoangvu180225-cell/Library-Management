const db = require('../db');

exports.borrowBook = async (req, res) => {
    const { bookID } = req.body;
    const userId = req.user.id; // Lấy từ middleware auth
    try {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); 
        
        await db.query(
            'INSERT INTO transactions (user_id, book_id, type, status) VALUES (?, ?, "loan", "borrowed")', 
            [userId, bookID]
        );
        res.json({ message: "Mượn sách thành công", hanTra: dueDate });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

exports.getLibrary = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT t.*, b.title, b.author 
             FROM transactions t 
             JOIN books b ON t.book_id = b.id 
             WHERE t.user_id = ?`, 
            [req.user.id]
        );
        res.json(rows); 
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

exports.addToLibrary = async (req, res) => {
    const { bookID } = req.body;
    try {
        await db.query(
            'INSERT INTO transactions (user_id, book_id, type) VALUES (?, ?, "library_add")', 
            [req.user.id, bookID]
        );
        res.json({ message: "Đã thêm vào thư viện cá nhân" });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

exports.buyBook = async (req, res) => {
    const { bookID } = req.body;
    try {
        await db.query(
            'INSERT INTO transactions (user_id, book_id, type, status) VALUES (?, ?, "buy", "purchased")', 
            [req.user.id, bookID]
        );
        res.json({ message: "Mua sách thành công!" });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};