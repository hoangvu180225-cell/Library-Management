const db = require('../db');
const nodemailer = require('nodemailer');

// --- CẤU HÌNH GỬI MAIL (Thay thông tin của bạn vào đây) ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bivu7b@gmail.com', // [THAY EMAIL CỦA BẠN]
        pass: 'elho dbtb stmi hpwh' // [THAY APP PASSWORD CỦA BẠN - KHÔNG PHẢI PASS GMAIL THƯỜNG]
    }
});

// 1. User Gửi Liên Hệ
exports.submitContact = async (req, res) => {
    const { full_name, email, message } = req.body;
    try {
        await db.query(
            'INSERT INTO Contacts (full_name, email, message) VALUES (?, ?, ?)',
            [full_name, email, message]
        );
        res.json({ message: "Gửi liên hệ thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server: " + error.message });
    }
};

// 2. Admin Lấy Danh Sách
exports.getAllContacts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Contacts ORDER BY status ASC, created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Admin Trả Lời Liên Hệ (GỬI MAIL THẬT)
exports.replyContact = async (req, res) => {
    const { id } = req.params;
    const { replyText } = req.body; 

    try {
        // A. Lấy thông tin người nhận từ DB
        const [rows] = await db.query('SELECT full_name, email, message FROM Contacts WHERE contact_id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Tin nhắn không tồn tại" });
        
        const contact = rows[0];

        // B. Cấu hình nội dung Email
        const mailOptions = {
            from: '"Thư Viện Bách Khoa" <no-reply@library.com>',
            to: contact.email, // Gửi đến email của người dùng
            subject: 'Phản hồi từ Ban quản trị Thư Viện',
            html: `
                <h3>Xin chào ${contact.full_name},</h3>
                <p>Chúng tôi đã nhận được câu hỏi của bạn với nội dung:</p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #ccc;">
                    "${contact.message}"
                </blockquote>
                <p><strong>Câu trả lời của chúng tôi:</strong></p>
                <p style="color: #2563eb; font-size: 16px;">${replyText}</p>
                <br>
                <hr>
                <p style="font-size: 12px; color: #888;">Đây là email tự động, vui lòng không trả lời lại.</p>
            `
        };
        

        // C. Gửi Email
        await transporter.sendMail(mailOptions);

        // D. Cập nhật Database sau khi gửi thành công
        await db.query(
            'UPDATE Contacts SET status = "REPLIED", reply_text = ?, replied_at = NOW() WHERE contact_id = ?',
            [replyText, id]
        );

        res.json({ message: "Đã gửi email và lưu phản hồi thành công!" });

    } catch (error) {
        console.error("Lỗi gửi mail:", error);
        res.status(500).json({ message: "Lỗi khi gửi email: " + error.message });
    }
};

// 4. Admin Xóa Liên Hệ
exports.deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Contacts WHERE contact_id = ?', [id]);
        res.json({ message: "Đã xóa liên hệ" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};