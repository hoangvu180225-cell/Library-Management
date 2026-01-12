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
    // 1. Lấy thông tin chữ từ body

    console.log("Check Body:", req.body);
    console.log("Check File:", req.file);
    
    const { title, author, price } = req.body; 
    
    // 2. Lấy thông tin file ảnh từ Cloudinary trả về (QUAN TRỌNG)
    // Nếu user có up ảnh thì lấy link, không thì để chuỗi rỗng hoặc null
    const imageUrl = req.file ? req.file.path : ''; 

    try {
        // 3. Sửa câu lệnh SQL: Thêm cột image và thêm 1 dấu ?
        const sql = 'INSERT INTO books (title, author, price, image) VALUES (?, ?, ?, ?)';
        
        // 4. Truyền thêm biến imageUrl vào mảng tham số
        await db.query(sql, [title, author, price, imageUrl]);
        
        res.json({ 
            message: "Tạo sách mới thành công",
            book: { title, author, price, image: imageUrl } // Trả về để check luôn
        });

    } catch (error) { 
        console.error(error); // Log ra terminal để dễ debug
        res.status(500).json({ message: error.message }); 
    }
};