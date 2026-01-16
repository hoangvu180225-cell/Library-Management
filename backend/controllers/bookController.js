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
    try {
        const [rows] = await db.query('SELECT * FROM books ORDER BY views DESC LIMIT 5');
        res.json(rows); 
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getBookById = async (req, res) => {
    try {
        const bookId = req.params.id; 

        const updateViewSql = `UPDATE Books SET views = views + 1 WHERE book_id = ?`;
        await db.execute(updateViewSql, [bookId]);
        
        const sql = `
            SELECT b.*, c.name as category_name 
            FROM Books b 
            LEFT JOIN Categories c ON b.category_id = c.category_id
            WHERE b.book_id = ?
        `;
        
        const [rows] = await db.execute(sql, [bookId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.updateBook = async (req, res) => {
    const bookId = req.params.id; 

    const { 
        isbn, 
        title, 
        author, 
        description, 
        publisher, 
        publication_year, 
        book_format, 
        category_id, 
        stock, 
        price, 
        image
    } = req.body;

    try {
        const sql = `
            UPDATE Books 
            SET 
                isbn = ?, 
                title = ?, 
                author = ?, 
                description = ?, 
                publisher = ?, 
                publication_year = ?, 
                book_format = ?, 
                category_id = ?, 
                stock = ?, 
                price = ?, 
                image = ? 
            WHERE book_id = ?
        `;

        const params = [
            isbn, 
            title, 
            author, 
            description, 
            publisher, 
            publication_year, 
            book_format, 
            category_id, 
            stock, 
            price, 
            image, 
            bookId 
        ];

        const [result] = await db.query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy sách có ID: " + bookId });
        }

        res.json({ message: "Cập nhật thông tin sách thành công!" });

    } catch (error) { 
        console.error("Lỗi Update:", error);
        res.status(500).json({ message: "Lỗi server: " + error.message }); 
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await db.query('DELETE FROM books WHERE book_id = ?', [req.params.id]);
        res.json({ message: "Xóa sách thành công" });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createBook = async (req, res) => {
    try {
        // Log ra để kiểm tra chắc chắn data đã vào
        console.log("Body:", req.body); 
        
        const { 
            isbn, title, author, description, publisher, 
            publication_year, book_format, category_id, stock, price 
        } = req.body;
        
        // --- LOGIC NHẬN ẢNH ĐÃ SỬA ---
        let finalImage = ''; 

        if (req.file && req.file.path) {
            // Trường hợp 1: Có file upload (Key 'image') -> Lấy path từ Cloudinary
            finalImage = req.file.path;
        } else if (req.body.image_link) { 
            // Trường hợp 2: Có link text (Key 'image_link') -> Lấy từ body
            // (Lưu ý: phải khớp tên với Frontend vừa sửa)
            finalImage = req.body.image_link;
        }

        // Kiểm tra lần cuối
        console.log("Ảnh sẽ lưu vào DB:", finalImage);

        // --- CÂU SQL (Giữ nguyên chuẩn 11 biến) ---
        const sql = `
            INSERT INTO Books 
            (isbn, title, author, description, publisher, publication_year, book_format, category_id, total_stock, price, image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            isbn, title, author, description, publisher, 
            publication_year, book_format, category_id, stock, price, 
            finalImage // Giờ nó sẽ là đường dẫn link ông nhập, không bị undefined nữa
        ];

        const [result] = await db.query(sql, params);
        
        res.status(201).json({ 
            message: "Tạo sách thành công!",
            bookId: result.insertId
        });

    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ message: "Lỗi server: " + error.message });
    }
};