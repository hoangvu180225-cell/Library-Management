const db = require('../db');

// 1. MƯỢN SÁCH (Có trừ kho)
exports.borrowBook = async (req, res) => {
    const { bookID } = req.body;
    const userId = req.user.id; 

    try {
        // Kiểm tra xem sách còn trong kho không
        const [book] = await db.query('SELECT stock FROM Books WHERE book_id = ?', [bookID]);
        if (!book.length || book[0].stock <= 0) {
            return res.status(400).json({ message: "Sách đã hết trong kho!" });
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        // Nên dùng Transaction ở đây nếu làm hệ thống lớn
        await db.query(
            'INSERT INTO transactions (user_id, book_id, type, status, due_date) VALUES (?, ?, "BORROW", "BORROWING", ?)', 
            [userId, bookID, dueDate]
        );

        // Cập nhật giảm kho
        await db.query('UPDATE Books SET stock = stock - 1, borrow_count = borrow_count + 1 WHERE book_id = ?', [bookID]);

        res.json({ message: "Mượn sách thành công", hanTra: dueDate });
    } catch (error) { 
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
        if (status && status !== 'ALL') {
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
    const userId = req.user.id;

    if (!userId) return res.status(401).json({ message: "Chưa đăng nhập" });

    try {
        // 1. Kiểm tra tồn kho và lấy giá sách
        const [book] = await db.query('SELECT stock, price FROM Books WHERE book_id = ?', [bookID]);
        
        if (book.length === 0) return res.status(404).json({ message: "Sách không tồn tại" });
        if (book[0].stock <= 0) return res.status(400).json({ message: "Sách đã hết hàng" });

        // 2. Thực hiện giao dịch (Nên dùng TRANSACTION trong SQL để đảm bảo an toàn dữ liệu)
        // Ở đây mình viết dạng tuần tự cho dễ hiểu:
        
        // A. Tạo bản ghi giao dịch
        await db.query(
            'INSERT INTO transactions (user_id, book_id, type, status) VALUES (?, ?, "BUY", "COMPLETED")', 
            [userId, bookID]
        );

        // B. Giảm số lượng trong kho
        await db.query('UPDATE Books SET stock = stock - 1 WHERE book_id = ?', [bookID]);

        // C. Cộng điểm tích lũy cho User (Ví dụ: 1/1000 giá trị sách quy ra điểm)
        const earnedPoints = Math.floor(book[0].price / 1000);
        if (earnedPoints > 0) {
            await db.query('UPDATE Users SET points = points + ? WHERE user_id = ?', [earnedPoints, userId]);
        }

        res.json({ 
            message: "Mua sách thành công!", 
            pointsEarned: earnedPoints 
        });

    } catch (error) { 
        console.error("Lỗi Mua:", error);
        res.status(500).json({ message: "Lỗi hệ thống: " + error.message }); 
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

// 6. CẬP NHẬT TRẠNG THÁI (TRẢ SÁCH)
exports.updateStatus = async (req, res) => {
    const transId = req.params.id;
    const { status } = req.body; 

    try {  
        // 1. Lấy thông tin giao dịch cũ để xem book_id là gì
        const [trans] = await db.query('SELECT book_id, status FROM transactions WHERE trans_id = ?', [transId]);
        
        if (trans.length > 0 && status === 'RETURNED' && trans[0].status !== 'RETURNED') {
            // 2. Cập nhật trạng thái và cộng lại kho
            await db.query(
                'UPDATE transactions SET status = ?, return_date = NOW() WHERE trans_id = ?', 
                [status, transId]
            );
            await db.query('UPDATE Books SET stock = stock + 1 WHERE book_id = ?', [trans[0].book_id]);
        } else {
            await db.query('UPDATE transactions SET status = ? WHERE trans_id = ?', [status, transId]);
        }

        res.json({ message: "Cập nhật thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};