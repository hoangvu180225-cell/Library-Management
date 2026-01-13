USE LibraryManagement;

-- 1. THÊM THỂ LOẠI (CATEGORIES)
INSERT INTO Categories (name, slug) VALUES 
('Công nghệ thông tin', 'cong-nghe-thong-tin'),
('Kinh tế - Tài chính', 'kinh-te-tai-chinh'),
('Tiểu thuyết & Văn học', 'tieu-thuyet-van-hoc'),
('Kỹ năng sống', 'ky-nang-song'),
('Truyện tranh (Manga)', 'truyen-tranh-manga');

-- 2. THÊM NGƯỜI DÙNG (USERS)
-- Password demo là '123456' (thực tế code backend sẽ hash MD5/Bcrypt)
INSERT INTO Users (full_name, email, password, phone, role, points, tier, status) VALUES 
('Phan Hoang Vu', 'admin@library.com', '123456', '0988888888', 'ADMIN', 9999, 'DIAMOND', 'ACTIVE'),
('Lê Thủ Thư', 'lib@library.com', '123456', '0977777777', 'LIBRARIAN', 500, 'GOLD', 'ACTIVE'),
('Nguyen Van A', 'member1@gmail.com', '123456', '0911111111', 'MEMBER', 150, 'BRONZE', 'ACTIVE'),
('Tran Thi B', 'member2@gmail.com', '123456', '0922222222', 'MEMBER', 600, 'SILVER', 'ACTIVE'),
('Le Van C', 'member3@gmail.com', '123456', '0933333333', 'MEMBER', 0, 'BRONZE', 'RESTRICTED'); -- Đang bị hạn chế

-- 3. THÊM SÁCH (BOOKS)
-- Giả sử ID Category: 1=CNTT, 2=Kinh tế, 3=Tiểu thuyết, 4=Kỹ năng, 5=Manga
INSERT INTO Books (title, author, category_id, price, image, description, stock, total_stock, views, rating) VALUES 
('Clean Code - Mã sạch', 'Robert C. Martin', 1, 350000, 'clean-code.jpg', 'Cuốn sách gối đầu giường cho mọi lập trình viên.', 10, 10, 1200, 5.0),
('Design Patterns', 'Erich Gamma', 1, 280000, 'design-pattern.jpg', 'Các mẫu thiết kế phần mềm kinh điển.', 5, 8, 800, 4.8),
('Nhà Giả Kim', 'Paulo Coelho', 3, 79000, 'nha-gia-kim.jpg', 'Hành trình đi tìm kho báu của chàng chăn cừu.', 50, 50, 5000, 4.9),
('Cha Giàu Cha Nghèo', 'Robert Kiyosaki', 2, 110000, 'rich-dad.jpg', 'Tư duy tài chính khác biệt.', 20, 25, 3000, 4.5),
('Đắc Nhân Tâm', 'Dale Carnegie', 4, 85000, 'dac-nhan-tam.jpg', 'Nghệ thuật thu phục lòng người.', 15, 20, 4500, 4.7),
('Doraemon Tập 1', 'Fujiko F. Fujio', 5, 25000, 'doraemon-1.jpg', 'Mèo máy đến từ tương lai.', 100, 100, 9000, 5.0);

-- 4. THÊM GIAO DỊCH (TRANSACTIONS)
-- Giả sử ID User: 3=Nguyen Van A, 4=Tran Thi B. ID Book: 1=Clean Code, 3=Nhà Giả Kim...
INSERT INTO Transactions (user_id, book_id, type, start_date, due_date, return_date, status, note) VALUES 
-- Mượn đang diễn ra (Chưa trả)
(3, 1, 'BORROW', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL, 'BORROWING', 'Sách mới, yêu cầu giữ kỹ'),
-- Mượn đã trả
(4, 3, 'BORROW', '2023-10-01', '2023-10-08', '2023-10-05', 'RETURNED', 'Trả đúng hạn'),
-- Mượn quá hạn (Due date là quá khứ)
(3, 2, 'BORROW', '2023-09-01', '2023-09-08', NULL, 'OVERDUE', 'Liên lạc thuê bao không nghe máy'),
-- Mua sách
(4, 6, 'BUY', NOW(), NULL, NULL, 'COMPLETED', 'Đã thanh toán qua VNPAY');

-- 5. THÊM ĐÁNH GIÁ (REVIEWS)
INSERT INTO Reviews (user_id, book_id, rating, comment) VALUES 
(4, 3, 5, 'Sách rất hay, ý nghĩa, đọc đi đọc lại vẫn thấy thấm.'),
(3, 1, 5, 'Sách chuyên ngành xịn, giấy tốt.'),
(3, 2, 4, 'Nội dung hơi khó hiểu với người mới.');