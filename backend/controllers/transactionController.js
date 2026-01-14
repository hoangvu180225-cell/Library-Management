const db = require('../db');

// 1. MƯỢN SÁCH
exports.borrowBook = async (req, res) => {
    const { bookID } = req.body;
    
    // Validate
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Vui lòng đăng nhập!" });
    }

    const userId = req.user.id; 

    try {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // Hạn trả 14 ngày
        
        // STATUS: 'BORROWING' (Khớp Schema)
        await db.query(
            'INSERT INTO transactions (user_id, book_id, type, status, due_date) VALUES (?, ?, "BORROW", "BORROWING", ?)', 
            [userId, bookID, dueDate]
        );
        res.json({ message: "Mượn sách thành công", hanTra: dueDate });
    } catch (error) { 
        console.error("Lỗi Mượn:", error);
        res.status(500).json({ message: "Lỗi server: " + error.message }); 
    }
};

// 2. LẤY DANH SÁCH TỦ SÁCH (Mượn + Mua + Quan tâm)
exports.getLibrary = async (req, res) => {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Chưa đăng nhập" });

    try {
        // Lấy query param status từ frontend (nếu có lọc)
        const { status } = req.query;
        
        let sql = `SELECT t.*, b.title, b.author, b.image, b.isbn 
                   FROM transactions t 
                   JOIN books b ON t.book_id = b.book_id 
                   WHERE t.user_id = ?`;
        
        const params = [req.user.id];

        // Nếu có filter status (VD: 'BORROWING', 'COMPLETED')
        if (status) {
            sql += ` AND t.status = ?`;
            params.push(status);
        }

        // Sắp xếp mới nhất lên đầu
        sql += ` ORDER BY t.start_date DESC`;

        const [rows] = await db.query(sql, params);

        // Map lại dữ liệu để khớp với Frontend (trans.bookInfo)
        const formattedRows = rows.map(row => ({
            trans_id: row.trans_id,
            status: row.status,
            start_date: row.start_date,
            due_date: row.due_date,
            return_date: row.return_date,
            book_id: row.book_id,
            bookInfo: {
                title: row.title,
                author: row.author,
                image: row.image,
                isbn: row.isbn
            }
        }));

        res.json(formattedRows); 
    } catch (error) { 
        console.error("Lỗi Get Library:", error);
        res.status(500).json({ message: error.message }); 
    }
};

// 3. MUA SÁCH
exports.buyBook = async (req, res) => {
    const { bookID } = req.body;
    
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Chưa đăng nhập" });

    try {
        // STATUS: 'COMPLETED' (Khớp Schema)
        await db.query(
            'INSERT INTO transactions (user_id, book_id, type, status) VALUES (?, ?, "BUY", "COMPLETED")', 
            [req.user.id, bookID]
        );
        res.json({ message: "Mua sách thành công!" });
    } catch (error) { 
        console.error("Lỗi Mua:", error);
        res.status(500).json({ message: "Lỗi mua sách: " + error.message }); 
    }
};

// 4. THÊM VÀO TỦ (QUAN TÂM)
exports.addToLibrary = async (req, res) => {
    const { bookID } = req.body;
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Chưa đăng nhập" });

    try {
        // STATUS: 'WISHLIST' (Khớp Schema - Bạn nhớ chạy lệnh ALTER TABLE thêm enum này nhé)
        await db.query(
            'INSERT INTO transactions (user_id, book_id, type, status) VALUES (?, ?, "BORROW", "WISHLIST")', 
            [req.user.id, bookID]
        );
        res.json({ message: "Đã thêm vào thư viện cá nhân" });
    } catch (error) { 
        console.error("Lỗi Wishlist:", error);
        res.status(500).json({ message: error.message }); 
    }
};

// 5. XÓA GIAO DỊCH (Xóa khỏi tủ sách)
exports.deleteTransaction = async (req, res) => {
    const transId = req.params.id;
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Chưa đăng nhập" });

    try {
        await db.query(
            'DELETE FROM transactions WHERE trans_id = ? AND user_id = ?', 
            [transId, req.user.id]
        );
        res.json({ message: "Đã xóa thành công" });
    } catch (error) {
        console.error("Lỗi Xóa:", error);
        res.status(500).json({ message: error.message });
    }
};