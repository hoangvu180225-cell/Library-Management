const db = require('../db');

// --- HÀM PHỤ: LẤY THÔNG TIN HẠN MỨC (QUOTA) ---
const getBorrowLimit = (tier) => {
    switch (tier) {
        case 'BRONZE': return 5;
        case 'SILVER': return 6;
        case 'GOLD': return 7;
        case 'PLATINUM': return 8;
        case 'DIAMOND': return 9;
        default: return 5; // Mặc định là Bronze
    }
};

// --- HÀM PHỤ: CẬP NHẬT HẠNG DỰA TRÊN ĐIỂM ---
const updateTier = async (userId) => {
    // Lấy điểm hiện tại
    const [userRows] = await db.query('SELECT points FROM Users WHERE user_id = ?', [userId]);
    if (userRows.length === 0) return;
    
    const points = userRows[0].points;
    let newTier = 'BRONZE';

    if (points >= 2000) newTier = 'DIAMOND';
    else if (points >= 1000) newTier = 'PLATINUM';
    else if (points >= 500) newTier = 'GOLD';
    else if (points >= 200) newTier = 'SILVER';

    await db.query('UPDATE Users SET tier = ? WHERE user_id = ?', [newTier, userId]);
};


// 1. MƯỢN SÁCH (CHECK HẠN MỨC & TRỪ KHO)
exports.borrowBook = async (req, res) => {
    const { bookID } = req.body;
    const userId = req.user.id; 

    try {
        // --- BƯỚC 1: KIỂM TRA HẠN MỨC (QUOTA) ---
        // Lấy thông tin Hạng của User
        const [userRows] = await db.query('SELECT tier FROM Users WHERE user_id = ?', [userId]);
        if (userRows.length === 0) return res.status(404).json({ message: "User không tồn tại" });
        
        const userTier = userRows[0].tier || 'BRONZE';
        const limit = getBorrowLimit(userTier);

        // Đếm số sách đã mượn trong 7 ngày qua (Tính cả đang mượn và đã trả)
        // Hoặc logic chặt hơn: Chỉ đếm số sách ĐANG MƯỢN (BORROWING) chưa trả
        // Ở đây mình làm theo logic "mượn 5 quyển 1 tuần" -> check ngày tạo đơn
        const [countRows] = await db.query(
            `SELECT COUNT(*) as count FROM transactions 
             WHERE user_id = ? AND type = 'BORROW' 
             AND start_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)`, 
            [userId]
        );
        
        const booksBorrowedThisWeek = countRows[0].count;

        if (booksBorrowedThisWeek >= limit) {
            return res.status(400).json({ 
                message: `Bạn đã đạt giới hạn mượn (${limit} quyển/tuần) của hạng ${userTier}. Hãy nâng hạng để mượn thêm!` 
            });
        }

        // --- BƯỚC 2: KIỂM TRA KHO ---
        const [book] = await db.query('SELECT stock FROM Books WHERE book_id = ?', [bookID]);
        if (!book.length || book[0].stock <= 0) {
            return res.status(400).json({ message: "Sách đã hết trong kho!" });
        }

        // --- BƯỚC 3: TẠO GIAO DỊCH ---
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // Hạn 2 tuần

        await db.query(
            'INSERT INTO transactions (user_id, book_id, type, status, due_date) VALUES (?, ?, "BORROW", "BORROWING", ?)', 
            [userId, bookID, dueDate]
        );

        // Cập nhật giảm kho
        await db.query('UPDATE Books SET stock = stock - 1, borrow_count = borrow_count + 1 WHERE book_id = ?', [bookID]);

        res.json({ message: "Mượn sách thành công", hanTra: dueDate, remainingQuota: limit - (booksBorrowedThisWeek + 1) });
    } catch (error) { 
        res.status(500).json({ message: "Lỗi server: " + error.message }); 
    }
};

// 2. LẤY DANH SÁCH TỦ SÁCH
exports.getLibrary = async (req, res) => {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Chưa đăng nhập" });

    try {
        const { status } = req.query;
        
        let sql = `SELECT t.*, b.title, b.author, b.image, b.isbn 
                   FROM transactions t 
                   JOIN books b ON t.book_id = b.book_id 
                   WHERE t.user_id = ?`;
        
        const params = [req.user.id];

        if (status && status !== 'ALL') {
            sql += ` AND t.status = ?`;
            params.push(status);
        }

        sql += ` ORDER BY t.start_date DESC`;

        const [rows] = await db.query(sql, params);

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

// 3. MUA SÁCH (CỘNG ĐIỂM KHI MUA)
exports.buyBook = async (req, res) => {
    const { bookID } = req.body;
    const userId = req.user.id;

    if (!userId) return res.status(401).json({ message: "Chưa đăng nhập" });

    try {
        const [book] = await db.query('SELECT stock, price FROM Books WHERE book_id = ?', [bookID]);
        
        if (book.length === 0) return res.status(404).json({ message: "Sách không tồn tại" });
        if (book[0].stock <= 0) return res.status(400).json({ message: "Sách đã hết hàng" });

        await db.query(
            'INSERT INTO transactions (user_id, book_id, type, status) VALUES (?, ?, "BUY", "COMPLETED")', 
            [userId, bookID]
        );

        await db.query('UPDATE Books SET stock = stock - 1 WHERE book_id = ?', [bookID]);

        // Cộng điểm mua sách (Ví dụ: 1 điểm cho mỗi 10.000đ)
        const earnedPoints = Math.floor(book[0].price / 10000); 
        if (earnedPoints > 0) {
            await db.query('UPDATE Users SET points = points + ? WHERE user_id = ?', [earnedPoints, userId]);
            await updateTier(userId); // Check lại hạng sau khi cộng điểm
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

// 4. THÊM VÀO TỦ (WISHLIST)
exports.addToLibrary = async (req, res) => {
    const { bookID } = req.body;
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Chưa đăng nhập" });

    try {
        // Kiểm tra xem đã có trong wishlist chưa để tránh duplicate
        const [exist] = await db.query(
            'SELECT trans_id FROM transactions WHERE user_id = ? AND book_id = ? AND status = "WISHLIST"', 
            [req.user.id, bookID]
        );
        if(exist.length > 0) return res.status(400).json({ message: "Sách đã có trong danh sách quan tâm" });

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

// 5. XÓA GIAO DỊCH
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

// 6. CẬP NHẬT TRẠNG THÁI (TRẢ SÁCH & TÍNH ĐIỂM)
exports.updateStatus = async (req, res) => {
    const transId = req.params.id;
    const { status } = req.body; 

    try {   
        // 1. Lấy thông tin giao dịch cũ
        const [trans] = await db.query('SELECT * FROM transactions WHERE trans_id = ?', [transId]);
        
        if (trans.length === 0) return res.status(404).json({ message: "Giao dịch không tồn tại" });
        const transaction = trans[0];

        // LOGIC TRẢ SÁCH (RETURNED)
        if (status === 'RETURNED' && transaction.status === 'BORROWING') {
            
            // A. TÍNH ĐIỂM
            const today = new Date();
            const dueDate = new Date(transaction.due_date);
            let pointsChange = 0;
            let message = "Trả sách thành công.";

            const diffTime = today - dueDate; 
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            if (diffDays <= 0) {
                // Trả ĐÚNG hạn hoặc SỚM
                pointsChange = 20; 
                message += " Bạn nhận được +20 điểm uy tín!";
            } else {
                // Trả MUỘN (Phạt 5đ/ngày)
                const penalty = diffDays * 5;
                pointsChange = -penalty; 
                message += ` Trả muộn ${diffDays} ngày. Bạn bị trừ ${penalty} điểm.`;
            }

            // B. UPDATE DB
            // 1. Cập nhật trạng thái transaction
            await db.query(
                'UPDATE transactions SET status = ?, return_date = NOW() WHERE trans_id = ?', 
                [status, transId]
            );
            
            // 2. Trả lại kho
            await db.query('UPDATE Books SET stock = stock + 1 WHERE book_id = ?', [transaction.book_id]);

            // 3. Cập nhật điểm User
            if (pointsChange !== 0) {
                await db.query('UPDATE Users SET points = points + ? WHERE user_id = ?', [pointsChange, transaction.user_id]);
                
                // 4. Kiểm tra và cập nhật Tier ngay lập tức
                await updateTier(transaction.user_id);
            }

            return res.json({ message, pointsChange });
        } 
        
        // LOGIC KHÁC (CANCELLED, BORROWING...)
        else {
            if (status === 'CANCELLED' && transaction.status === 'BORROWING') {
                // Nếu hủy khi đang mượn (trường hợp admin hủy hoặc lỗi), nhớ trả lại kho
                await db.query('UPDATE Books SET stock = stock + 1 WHERE book_id = ?', [transaction.book_id]);
            }
            
            await db.query('UPDATE transactions SET status = ? WHERE trans_id = ?', [status, transId]);
            res.json({ message: "Cập nhật thành công" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 7. REVIEW SÁCH (CỘNG ĐIỂM) - Placeholder cho tính năng tương lai
exports.reviewBook = async (req, res) => {
    // Logic: Khi user post review -> cộng 5 điểm
    // await db.query('UPDATE Users SET points = points + 5 WHERE user_id = ?', [userId]);
    // await updateTier(userId);
    res.json({ message: "Review tính năng đang phát triển" });
};