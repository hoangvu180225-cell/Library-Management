USE LibraryManagement;

-- =============================================
-- 2. INSERT DỮ LIỆU (SEED DATA)
-- =============================================

-- --- A. THỂ LOẠI ---
INSERT INTO Categories (name, slug) VALUES 
('Hành động', 'hanh-dong'),                  -- ID: 1
('Khoa học viễn tưởng', 'khoa-hoc-vien-tuong'), -- ID: 2
('Lãng mạn', 'lang-man'),                     -- ID: 3
('Lịch sử', 'lich-su'),                       -- ID: 4
('Tiểu thuyết', 'tieu-thuyet'),               -- ID: 5
('Thiếu nhi', 'thieu-nhi'),                   -- ID: 6
('Trinh thám', 'trinh-tham');                 -- ID: 7

-- --- B. NGƯỜI DÙNG (Đã thêm địa chỉ) ---
INSERT INTO Users (full_name, email, password, phone, address, role, points, tier, status) VALUES 
-- 1. Admin
('Phan Hoang Vu', 'admin@library.com', '123456', '0988888888', '123 Đường Admin, Q.1, TP.HCM', 'ADMIN', 9999, 'DIAMOND', 'ACTIVE'),

-- 2, 3, 4. Nhân viên (STAFF)
('Lê Thủ Thư', 'staff1@library.com', '123456', '0977777777', '456 Đường Sách, Q.3, TP.HCM', 'STAFF', 500, 'GOLD', 'ACTIVE'),
('Nguyễn Quản Kho', 'staff2@library.com', '123456', '0966666666', '789 Đường Kho, Q.Thủ Đức, TP.HCM', 'STAFF', 0, 'BRONZE', 'ACTIVE'),
('Trần Hỗ Trợ', 'staff3@library.com', '123456', '0955555555', '321 Đường Hỗ Trợ, Q.Bình Thạnh, TP.HCM', 'STAFF', 0, 'BRONZE', 'ACTIVE'),

-- 5, 6, 7, 8, 9. Độc giả (MEMBER)
('Nguyen Van A', 'member1@gmail.com', '123456', '0911111111', '12 Ngõ Trạm, Hà Nội', 'MEMBER', 150, 'BRONZE', 'ACTIVE'),
('Tran Thi B', 'member2@gmail.com', '123456', '0922222222', '34 Lê Lợi, Đà Nẵng', 'MEMBER', 300, 'SILVER', 'ACTIVE'),
('Le Van C', 'member3@gmail.com', '123456', '0933333333', '56 Nguyễn Huệ, Q.1, TP.HCM', 'MEMBER', 0, 'BRONZE', 'RESTRICTED'),
('Pham Thi D', 'member4@gmail.com', '123456', '0944444444', '78 Trần Hưng Đạo, Cần Thơ', 'MEMBER', 550, 'GOLD', 'ACTIVE'),
('Hoang Van E', 'member5@gmail.com', '123456', '0900000000', '90 Hùng Vương, Huế', 'MEMBER', 900, 'DIAMOND', 'ACTIVE');

-- --- C. SÁCH ---
INSERT INTO Books (isbn, title, author, category_id, publisher, publication_year, book_format, price, image, description, stock, total_stock, views, rating, borrow_count) VALUES 

-- ID: 1, 2, 3 (Hành động)
('978-0439023481', 'The Hunger Games', 'Suzanne Collins', 1, 'NXB Văn Học', 2020, 'Bìa mềm', 150000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338469/action_1_qextum.webp', 'Cuộc chiến sinh tồn khốc liệt.', 15, 20, 1500, 4.8, 120),
('978-0062024039', 'Divergent', 'Veronica Roth', 1, 'NXB Trẻ', 2021, 'Bìa mềm', 135000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338469/action_2_dwmrg3.webp', 'Xã hội phân chia 5 môn phái.', 12, 15, 1200, 4.5, 95),
('978-0385737973', 'Maze Runner', 'James Dashner', 1, 'NXB Kim Đồng', 2019, 'Bìa mềm', 140000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338470/action_3_ds9ac1.webp', 'Giải mã mê cung.', 10, 12, 1100, 4.6, 88),

-- ID: 4..8 (Sci-Fi)
('978-0441013593', 'Dune - Xứ Cát', 'Frank Herbert', 2, 'NXB Hội Nhà Văn', 2022, 'Bìa cứng', 250000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/scifi_1_bc6dpw.webp', 'Kiệt tác khoa học viễn tưởng.', 8, 8, 2000, 4.9, 210),
('978-0765377067', 'Tam Thể', 'Lưu Từ Hân', 2, 'NXB Nhã Nam', 2023, 'Bìa mềm', 220000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/scifi_3_xvmoue.webp', 'Văn minh ngoài trái đất.', 15, 15, 1800, 5.0, 150),
('978-1451673319', '451 Độ F', 'Ray Bradbury', 2, 'NXB Văn Học', 2018, 'Ebook', 98000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/scifi_4_mh8lh0.jpg', 'Nơi sách bị cấm.', 20, 20, 900, 4.7, 72),
('978-0451530706', 'Cỗ Máy Thời Gian', 'H.G. Wells', 2, 'NXB Kim Đồng', 2015, 'Bìa mềm', 85000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338473/scifi_5_cqrpf1.webp', 'Du hành thời gian.', 10, 10, 850, 4.3, 55),
('978-0451524935', '1984', 'George Orwell', 2, 'NXB Nhã Nam', 2020, 'Bìa cứng', 110000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338473/scifi_6_hy17xa.jpg', 'Anh cả đang theo dõi bạn.', 25, 30, 3000, 4.9, 300),

-- ID: 9..14 (Lãng mạn)
('978-0141439518', 'Kiêu Hãnh và Định Kiến', 'Jane Austen', 3, 'NXB Văn Học', 2017, 'Bìa cứng', 95000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338471/romance_1_huo5xj.webp', 'Tình yêu kinh điển.', 20, 20, 2500, 4.8, 450),
('978-0143124542', 'Me Before You', 'Jojo Moyes', 3, 'NXB Trẻ', 2019, 'Bìa mềm', 120000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338471/romance_2_oxpcgz.webp', 'Câu chuyện đẫm nước mắt.', 15, 15, 1800, 4.6, 220),
('978-0375704024', 'Rừng Na Uy', 'Haruki Murakami', 3, 'NXB Hội Nhà Văn', 2021, 'Bìa mềm', 115000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/romance_4_voffmc.webp', 'Nỗi buồn tuổi trẻ.', 25, 25, 3200, 4.7, 340),
('978-0312426781', 'Gọi Em Bằng Tên Anh', 'André Aciman', 3, 'NXB Trẻ', 2020, 'Bìa mềm', 105000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/romance_5_ozgryj.webp', 'Mối tình mùa hè.', 10, 12, 1400, 4.5, 115),
('978-1451635621', 'Cuốn Theo Chiều Gió', 'Margaret Mitchell', 3, 'NXB Văn Học', 2016, 'Bìa cứng', 190000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/romance_6_orykdw.webp', 'Tình yêu thời chiến.', 8, 10, 2100, 4.9, 280),
('978-6042145678', 'Nhật Ký Tình Yêu (Chế)', 'Bernard Friot', 3, 'NXB Kim Đồng', 2023, 'Bìa mềm', 50000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338471/romance_3_dsgibt.webp', 'Hài hước tuổi học trò.', 30, 30, 900, 4.0, 45),

-- ID: 15 (Lịch sử)
('978-0062316097', 'Sapiens: Lược Sử Loài Người', 'Yuval Noah Harari', 4, 'NXB Tri Thức', 2022, 'Bìa cứng', 210000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338469/history_1_mvocjg.webp', 'Lịch sử tiến hóa.', 20, 25, 3500, 4.9, 410),

-- ID: 16, 17, 18 (Tiểu thuyết)
('978-0590353427', 'Harry Potter 1', 'J.K. Rowling', 5, 'NXB Trẻ', 2024, 'Bìa cứng', 180000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338469/HP1_jrgej4.jpg', 'Hòn đá phù thủy.', 50, 50, 9999, 5.0, 850),
('978-0439136358', 'Harry Potter 3', 'J.K. Rowling', 5, 'NXB Trẻ', 2024, 'Bìa cứng', 180000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338470/HP2_dwyxbp.jpg', 'Tù nhân Azkaban.', 45, 45, 8500, 5.0, 780),
('978-0062315007', 'Nhà Giả Kim', 'Paulo Coelho', 5, 'NXB Nhã Nam', 2021, 'Bìa mềm', 79000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338471/lit_2_wkzgdj.webp', 'Đi tìm kho báu.', 60, 60, 6000, 4.9, 920),

-- ID: 19, 20, 21 (Thiếu nhi)
('978-0156012195', 'Hoàng Tử Bé', 'Antoine de Saint-Exupéry', 6, 'NXB Kim Đồng', 2020, 'Bìa mềm', 60000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338470/children_1_bdqlu8.jpg', 'Triết lý nhẹ nhàng.', 40, 50, 5000, 5.0, 560),
('978-6042079361', 'Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 6, 'NXB Kim Đồng', 2023, 'Bìa cứng', 55000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338471/children_2_xstrx4.jpg', 'Cuộc phiêu lưu của Dế Mèn.', 100, 100, 4000, 4.8, 600),
('978-6042079378', 'Chim Sẻ Vô Tội', 'Võ Quảng', 6, 'NXB Kim Đồng', 2019, 'Bìa mềm', 45000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338470/children_3_ntisht.webp', 'Truyện đồng thoại.', 30, 30, 600, 4.2, 80),

-- ID: 22, 23 (Trinh thám)
('978-0307474278', 'The Da Vinci Code', 'Dan Brown', 7, 'NXB Văn Học', 2018, 'Bìa mềm', 160000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338469/action_5_b3wa2z.webp', 'Truy tìm chén thánh.', 18, 20, 2200, 4.7, 310),
('978-0553212419', 'Sherlock Holmes', 'Arthur Conan Doyle', 7, 'NXB Văn Học', 2022, 'Bìa cứng', 350000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338470/action_6_gkpawg.webp', 'Thám tử lừng danh.', 5, 5, 1500, 5.0, 480);

-- --- D. GIAO DỊCH MẪU ---
INSERT INTO Transactions (user_id, book_id, type, start_date, due_date, return_date, status, note) VALUES 
(5, 16, 'BORROW', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), NULL, 'BORROWING', 'Mượn HP1'),
(8, 1, 'BORROW', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), NULL, 'BORROWING', 'VIP mượn'),
(6, 19, 'BORROW', '2023-10-01', '2023-10-15', '2023-10-05', 'RETURNED', 'Trả sớm'),
(9, 23, 'BORROW', '2023-11-01', '2023-11-15', '2023-11-10', 'RETURNED', 'Trả đúng hạn'),
(5, 4, 'BORROW', '2023-09-01', '2023-09-15', NULL, 'OVERDUE', 'Quá hạn'),
(6, 15, 'BORROW', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), NULL, 'PENDING', 'Chờ duyệt'),
(8, 22, 'BORROW', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), NULL, 'PENDING', 'Chờ duyệt'),
-- Thêm ví dụ Wishlist (Quan tâm)
(9, 10, 'BORROW', NOW(), NULL, NULL, 'WISHLIST', 'Sách muốn đọc sau này');

-- --- E. ĐÁNH GIÁ ---
INSERT INTO Reviews (user_id, book_id, rating, comment) VALUES 
(6, 16, 5, 'Tuyệt vời!'),
(5, 15, 5, 'Rất hay.'),
(9, 23, 5, 'Kinh điển.');

-- --- F. LIÊN HỆ MẪU (CONTACTS) ---
INSERT INTO Contacts (full_name, email, message, reply_text, status, replied_at) VALUES
('Nguyen Van A', 'member1@gmail.com', 'Tôi muốn hỏi về cách gia hạn sách?', 'Bạn có thể gia hạn trực tiếp trên web hoặc mang sách đến quầy.', 'REPLIED', NOW()),
('Tran Thi B', 'member2@gmail.com', 'Sách Harry Potter bao giờ có thêm hàng?', NULL, 'PENDING', NULL),
('Khách vãng lai', 'guest@gmail.com', 'Làm sao để đăng ký thẻ thành viên?', NULL, 'PENDING', NULL);