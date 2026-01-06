USE LibraryManagement;

-- =============================================
-- 1. DATA CHO BẢNG CATEGORIES (THỂ LOẠI)
-- =============================================
INSERT INTO Categories (name, slug) VALUES 
('Văn học', 'van-hoc'),
('Kinh tế', 'kinh-te'),
('Khoa học viễn tưởng', 'khoa-hoc-vien-tuong'),
('Tâm lý - Kỹ năng', 'tam-ly-ky-nang'),
('Thiếu nhi', 'thieu-nhi');

-- =============================================
-- 2. DATA CHO BẢNG USERS (NGƯỜI DÙNG)
-- =============================================
-- Password demo là '123456' (đã hash qua loa hoặc để raw text demo)
INSERT INTO Users (full_name, email, password, role, points, tier, status, phone) VALUES 
-- Staff & Admin
('Phan Hoang Vu', 'vu.admin@library.com', '$2b$10$C8...', 'ADMIN', 0, 'DIAMOND', 'ACTIVE', '0999888777'),
('Lê Thị Lan', 'lan.le@library.com', '$2b$10$C8...', 'LIBRARIAN', 0, 'GOLD', 'ACTIVE', '0988111222'),
('Trần Văn Hùng', 'hung.tran@library.com', '$2b$10$C8...', 'STOCK_MANAGER', 0, 'SILVER', 'RESTRICTED', '0977666555'),

-- Members (Độc giả)
('Nguyễn Văn An', 'vana@gmail.com', '123456', 'MEMBER', 820, 'GOLD', 'ACTIVE', '0912345678'),
('Phạm Thu Hương', 'huong.pham@gmail.com', '123456', 'MEMBER', 150, 'BRONZE', 'ACTIVE', '0987654321'),
('Lê Văn Cường', 'cuong.le@gmail.com', '123456', 'MEMBER', 1250, 'PLATINUM', 'ACTIVE', '0909090909'),
('Đỗ Minh Tuấn', 'tuan.do@gmail.com', '123456', 'MEMBER', 50, 'BRONZE', 'BANNED', '0911223344'),
('Hoàng Thùy Linh', 'linh.hoang@gmail.com', '123456', 'MEMBER', 2100, 'DIAMOND', 'ACTIVE', '0933445566');

-- =============================================
-- 3. DATA CHO BẢNG BOOKS (SÁCH)
-- =============================================
-- Giả sử ID Category: 1=Văn học, 2=Kinh tế, 3=KHVT, 4=Kỹ năng, 5=Thiếu nhi
INSERT INTO Books (book_id, title, author, category_id, image, description, stock, total_stock, views, rating, borrow_count) VALUES 
('LIT01', 'Chúa tể những chiếc nhẫn', 'J.R.R. Tolkien', 1, 'images/lotr.jpg', 'Hành trình tiêu hủy nhẫn...', 5, 10, 2500, 4.9, 150),
('LIT02', 'Nhà giả kim', 'Paulo Coelho', 1, 'images/alchemist.jpg', 'Hành trình tìm kho báu...', 20, 50, 45000, 5.0, 500),
('LIT03', 'Mắt Biếc', 'Nguyễn Nhật Ánh', 1, 'images/matbiec.jpg', 'Chuyện tình đơn phương...', 8, 15, 12000, 4.7, 300),

('SCI01', 'Đấu trường sinh tử', 'Suzanne Collins', 3, 'images/hungergames.jpg', 'Cuộc chiến sinh tồn...', 2, 12, 8000, 4.5, 120),
('SCI02', 'Dị biệt (Divergent)', 'Veronica Roth', 3, 'images/divergent.jpg', 'Xã hội phân chia 5 môn phái...', 0, 10, 5000, 4.2, 80), -- Hết hàng (stock=0)

('ECO01', 'Sapiens: Lược sử loài người', 'Yuval Noah Harari', 2, 'images/sapiens.jpg', 'Lịch sử tiến hóa...', 15, 30, 30000, 4.8, 400),
('ECO02', 'Đắc Nhân Tâm', 'Dale Carnegie', 4, 'images/dacnhantam.jpg', 'Nghệ thuật thu phục lòng người', 50, 100, 50000, 4.6, 600),

('KID01', 'Dế Mèn phiêu lưu ký', 'Tô Hoài', 5, 'images/demen.jpg', 'Chú dế mèn đi du ký...', 25, 30, 15000, 4.8, 220);

-- =============================================
-- 4. DATA CHO BẢNG TRANSACTIONS (MƯỢN/TRẢ/MUA)
-- =============================================
INSERT INTO Transactions (user_id, book_id, type, start_date, due_date, return_date, status, note) VALUES 
-- 1. Đang mượn (Trong hạn)
(4, 'LIT01', 'BORROW', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL, 'BORROWING', NULL),
(4, 'SCI01', 'BORROW', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL, 'BORROWING', NULL),

-- 2. Đang mượn (Quá hạn - Mượn từ tháng trước)
(5, 'ECO01', 'BORROW', '2023-11-01', '2023-11-08', NULL, 'OVERDUE', 'Khách chưa nghe máy'),

-- 3. Đã trả (Thành công)
(6, 'LIT02', 'BORROW', '2023-12-01', '2023-12-08', '2023-12-05', 'RETURNED', 'Sách còn mới'),

-- 4. Đã Mua (Status Completed, Due Date NULL)
(8, 'KID01', 'BUY', '2023-10-15', NULL, NULL, 'COMPLETED', 'Đã thanh toán Online'),
(6, 'ECO02', 'BUY', '2023-12-20', NULL, NULL, 'COMPLETED', 'Mua tại quầy');

-- =============================================
-- 5. DATA CHO BẢNG REVIEWS (ĐÁNH GIÁ)
-- =============================================
INSERT INTO Reviews (user_id, book_id, rating, comment, created_at) VALUES 
(4, 'LIT02', 5, 'Sách quá hay, nên đọc một lần trong đời', NOW()),
(5, 'ECO01', 4, 'Hơi khó hiểu đoạn đầu nhưng rất cuốn hút', NOW()),
(6, 'SCI01', 5, 'Phim hay mà truyện còn hay hơn', NOW()),
(8, 'KID01', 5, 'Con mình rất thích', NOW());