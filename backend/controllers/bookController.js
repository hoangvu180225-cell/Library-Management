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
    // 1. Lấy ID sách từ URL (VD: /api/books/10)
    const bookId = req.params.id; 

    // 2. Lấy toàn bộ dữ liệu từ Frontend gửi lên (req.body)
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
        image // Đây là link ảnh (chuỗi text)
    } = req.body;

    try {
        // 3. Câu lệnh SQL Update đầy đủ
        // Lưu ý: Thứ tự dấu ? phải khớp chính xác với thứ tự biến trong mảng params bên dưới
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

        // 4. Mảng tham số (Mapping 1-1 với dấu ?)
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
            bookId // Tham số cuối cùng cho điều kiện WHERE book_id = ?
        ];

        // 5. Thực thi câu lệnh
        const [result] = await db.query(sql, params);

        // Kiểm tra xem có sách nào được update không (phòng trường hợp ID sai)
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