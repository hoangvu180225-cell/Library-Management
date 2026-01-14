USE LibraryManagement;

-- 1. THÊM THỂ LOẠI (Theo thứ tự bạn yêu cầu)
INSERT INTO Categories (name, slug) VALUES 
('Hành động', 'hanh-dong'),                  -- ID: 1
('Khoa học viễn tưởng', 'khoa-hoc-vien-tuong'), -- ID: 2
('Lãng mạn', 'lang-man'),                    -- ID: 3
('Lịch sử', 'lich-su'),                      -- ID: 4
('Tiểu thuyết', 'tieu-thuyet'),              -- ID: 5
('Thiếu nhi', 'thieu-nhi'),                  -- ID: 6
('Trinh thám', 'trinh-tham');                -- ID: 7

-- 2. THÊM NGƯỜI DÙNG
INSERT INTO Users (full_name, email, password, phone, role, points, tier, status) VALUES 
('Phan Hoang Vu', 'admin@library.com', '123456', '0988888888', 'ADMIN', 9999, 'DIAMOND', 'ACTIVE'),
('Lê Thủ Thư', 'lib@library.com', '123456', '0977777777', 'LIBRARIAN', 500, 'GOLD', 'ACTIVE'),
('Nguyen Van A', 'member1@gmail.com', '123456', '0911111111', 'MEMBER', 150, 'BRONZE', 'ACTIVE'),
('Tran Thi B', 'member2@gmail.com', '123456', '0922222222', 'MEMBER', 600, 'SILVER', 'ACTIVE'),
('Le Van C', 'member3@gmail.com', '123456', '0933333333', 'MEMBER', 0, 'BRONZE', 'RESTRICTED');

-- 3. THÊM SÁCH (FULL THÔNG TIN MỚI)
INSERT INTO Books (isbn, title, author, category_id, publisher, publication_year, book_format, price, image, description, stock, total_stock, views, rating) VALUES 

-- --- ID: 1 | HÀNH ĐỘNG ---
('978-0439023481', 'The Hunger Games - Đấu Trường Sinh Tử', 'Suzanne Collins', 1, 'NXB Văn Học', 2020, 'Bìa mềm', 150000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338469/action_1_qextum.webp', 'Cuộc chiến sinh tồn khốc liệt tại Panem.\nMột tác phẩm hành động nghẹt thở.', 15, 20, 1500, 4.8),
('978-0062024039', 'Divergent - Những Kẻ Bất Khả Trị', 'Veronica Roth', 1, 'NXB Trẻ', 2021, 'Bìa mềm', 135000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338469/action_2_dwmrg3.webp', 'Một xã hội phân chia theo 5 môn phái dựa trên phẩm chất con người.', 12, 15, 1200, 4.5),
('978-0385737973', 'The Maze Runner - Giải Mã Mê Cung', 'James Dashner', 1, 'NXB Kim Đồng', 2019, 'Bìa mềm', 140000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338470/action_3_ds9ac1.webp', 'Thoát khỏi mê cung khổng lồ hoặc chết.\nBí ẩn đằng sau tổ chức WICKED.', 10, 12, 1100, 4.6),

-- --- ID: 2 | KHOA HỌC VIỄN TƯỞNG ---
('978-0441013593', 'Dune - Xứ Cát', 'Frank Herbert', 2, 'NXB Hội Nhà Văn', 2022, 'Bìa cứng', 250000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/scifi_1_bc6dpw.webp', 'Kiệt tác khoa học viễn tưởng về hành tinh cát Arrakis và gia tộc Atreides.', 8, 8, 2000, 4.9),
('978-0765377067', 'Tam Thể', 'Lưu Từ Hân', 2, 'NXB Nhã Nam', 2023, 'Bìa mềm', 220000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/scifi_3_xvmoue.webp', 'Cuộc tiếp xúc đầu tiên của nhân loại với văn minh ngoài trái đất.', 15, 15, 1800, 5.0),
('978-1451673319', '451 Độ F', 'Ray Bradbury', 2, 'NXB Văn Học', 2018, 'Ebook', 98000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/scifi_4_mh8lh0.jpg', 'Nơi sách bị cấm và lính cứu hỏa đi đốt sách.', 20, 20, 900, 4.7),
('978-0451530706', 'Cỗ Máy Thời Gian', 'H.G. Wells', 2, 'NXB Kim Đồng', 2015, 'Bìa mềm', 85000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338473/scifi_5_cqrpf1.webp', 'Hành trình du hành đến tương lai xa xôi của nhân loại.', 10, 10, 850, 4.3),
('978-0451524935', '1984', 'George Orwell', 2, 'NXB Nhã Nam', 2020, 'Bìa cứng', 110000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338473/scifi_6_hy17xa.jpg', 'Tác phẩm kinh điển về xã hội toàn trị Big Brother đang theo dõi bạn.', 25, 30, 3000, 4.9),

-- --- ID: 3 | LÃNG MẠN ---
('978-0141439518', 'Kiêu Hãnh và Định Kiến', 'Jane Austen', 3, 'NXB Văn Học', 2017, 'Bìa cứng', 95000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338471/romance_1_huo5xj.webp', 'Câu chuyện tình yêu kinh điển mọi thời đại giữa Elizabeth và Darcy.', 20, 20, 2500, 4.8),
('978-0143124542', 'Me Before You', 'Jojo Moyes', 3, 'NXB Trẻ', 2019, 'Bìa mềm', 120000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338471/romance_2_oxpcgz.webp', 'Câu chuyện tình yêu đẫm nước mắt và đầy tính nhân văn.', 15, 15, 1800, 4.6),
('978-0375704024', 'Rừng Na Uy', 'Haruki Murakami', 3, 'NXB Hội Nhà Văn', 2021, 'Bìa mềm', 115000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/romance_4_voffmc.webp', 'Nỗi buồn và sự cô đơn của tuổi trẻ những năm 60.', 25, 25, 3200, 4.7),
('978-0312426781', 'Gọi Em Bằng Tên Anh', 'André Aciman', 3, 'NXB Trẻ', 2020, 'Bìa mềm', 105000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/romance_5_ozgryj.webp', 'Mối tình mùa hè rực rỡ tại vùng quê nước Ý.', 10, 12, 1400, 4.5),
('978-1451635621', 'Cuốn Theo Chiều Gió', 'Margaret Mitchell', 3, 'NXB Văn Học', 2016, 'Bìa cứng', 190000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338472/romance_6_orykdw.webp', 'Thiên tình sử bi tráng thời nội chiến Mỹ của Scarlett O Hara.', 8, 10, 2100, 4.9),
('978-6042145678', 'Nhật Ký Tình Yêu (Chế)', 'Bernard Friot', 3, 'NXB Kim Đồng', 2023, 'Bìa mềm', 50000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338471/romance_3_dsgibt.webp', 'Góc nhìn hài hước về tình yêu tuổi học trò.', 30, 30, 900, 4.0),

-- --- ID: 4 | LỊCH SỬ ---
('978-0062316097', 'Sapiens: Lược Sử Loài Người', 'Yuval Noah Harari', 4, 'NXB Tri Thức', 2022, 'Bìa cứng', 210000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338469/history_1_mvocjg.webp', 'Lịch sử tiến hóa của loài người từ vượn cổ đến trí tuệ nhân tạo.', 20, 25, 3500, 4.9),

-- --- ID: 5 | TIỂU THUYẾT ---
('978-0590353427', 'Harry Potter và Hòn Đá Phù Thủy', 'J.K. Rowling', 5, 'NXB Trẻ', 2024, 'Bìa cứng', 180000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338469/HP1_jrgej4.jpg', 'Khởi đầu cuộc hành trình của cậu bé phù thủy Harry Potter.', 50, 50, 9999, 5.0),
('978-0439136358', 'Harry Potter và Tù Nhân Azkaban', 'J.K. Rowling', 5, 'NXB Trẻ', 2024, 'Bìa cứng', 180000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338470/HP2_dwyxbp.jpg', 'Năm thứ 3 đầy kịch tính tại Hogwarts với Sirius Black.', 45, 45, 8500, 5.0),
('978-0062315007', 'Nhà Giả Kim', 'Paulo Coelho', 5, 'NXB Nhã Nam', 2021, 'Bìa mềm', 79000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338471/lit_2_wkzgdj.webp', 'Hành trình đi tìm kho báu của chàng chăn cừu Santiago.', 60, 60, 6000, 4.9),

-- --- ID: 6 | THIẾU NHI ---
('978-0156012195', 'Hoàng Tử Bé', 'Antoine de Saint-Exupéry', 6, 'NXB Kim Đồng', 2020, 'Bìa mềm', 60000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338470/children_1_bdqlu8.jpg', 'Câu chuyện triết lý nhẹ nhàng dành cho trẻ em và người lớn.', 40, 50, 5000, 5.0),
('978-6042079361', 'Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 6, 'NXB Kim Đồng', 2023, 'Bìa cứng', 55000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338471/children_2_xstrx4.jpg', 'Cuộc phiêu lưu của chú dế mèn đi khắp thế gian.', 100, 100, 4000, 4.8),
('978-6042079378', 'Chim Sẻ Vô Tội', 'Võ Quảng', 6, 'NXB Kim Đồng', 2019, 'Bìa mềm', 45000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338470/children_3_ntisht.webp', 'Tuyển tập truyện đồng thoại hay nhất của nhà văn Võ Quảng.', 30, 30, 600, 4.2),

-- --- ID: 7 | TRINH THÁM ---
('978-0307474278', 'The Da Vinci Code', 'Dan Brown', 7, 'NXB Văn Học', 2018, 'Bìa mềm', 160000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338469/action_5_b3wa2z.webp', 'Cuộc truy tìm chén thánh đầy kịch tính của giáo sư Robert Langdon.', 18, 20, 2200, 4.7),
('978-0553212419', 'Sherlock Holmes Toàn Tập', 'Arthur Conan Doyle', 7, 'NXB Văn Học', 2022, 'Bìa cứng', 350000, 'https://res.cloudinary.com/duwzwoshy/image/upload/v1768338470/action_6_gkpawg.webp', 'Tuyển tập các vụ án của thám tử lừng danh Sherlock Holmes.', 5, 5, 1500, 5.0);

-- 4. GIAO DỊCH (Book ID: 15=Harry Potter 1, 18=Hoàng Tử Bé, 4=Dune)
INSERT INTO Transactions (user_id, book_id, type, start_date, due_date, return_date, status, note) VALUES 
(3, 15, 'BORROW', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL, 'BORROWING', 'Mượn HP1 đọc cuối tuần'),
(4, 18, 'BORROW', '2023-10-01', '2023-10-08', '2023-10-05', 'RETURNED', 'Đã trả Hoàng Tử Bé'),
(3, 4, 'BORROW', '2023-09-01', '2023-09-08', NULL, 'OVERDUE', 'Mượn Dune quá hạn chưa trả');

-- 5. ĐÁNH GIÁ
INSERT INTO Reviews (user_id, book_id, rating, comment) VALUES 
(4, 15, 5, 'Harry Potter luôn là tuyệt nhất!'),
(3, 14, 5, 'Sapiens giúp mở mang kiến thức rất nhiều.'),
(3, 11, 4, 'Rừng Na Uy hơi buồn nhưng hay.');