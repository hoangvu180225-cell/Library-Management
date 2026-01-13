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

exports.getBookById = async (req, res) => {
    try {
        const bookId = req.params.id; // Lấy ID từ URL (VD: /books/1)

        // Query Database (Có thể JOIN thêm bảng Categories để lấy tên thể loại)
        const sql = `
            SELECT b.*, c.name as category_name 
            FROM Books b 
            LEFT JOIN Categories c ON b.category_id = c.category_id
            WHERE b.book_id = ?
        `;
        
        const [rows] = await db.execute(sql, [bookId]);

        // Nếu không tìm thấy sách
        if (rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }

        // Trả về object sách đầu tiên tìm thấy
        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi Server" });
    }
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
    try {
        const { title, author, price } = req.body;
        
        // Cloudinary trả về link ảnh ở thuộc tính .path
        const imageUrl = req.file ? req.file.path : null; 

        console.log("Link ảnh Cloudinary:", imageUrl); // Log ra để kiểm tra

        const sql = 'INSERT INTO books (title, author, price, image) VALUES (?, ?, ?, ?)';
        await db.query(sql, [title, author, price, imageUrl]);
        
        res.json({ 
            message: "Tạo sách thành công!",
            data: { title, author, price, image: imageUrl }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};