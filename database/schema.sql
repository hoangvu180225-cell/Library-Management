CREATE DATABASE IF NOT EXISTS LibraryManagement;
USE LibraryManagement;

-- 1. Bảng Thể loại (Mapping với các tab: Khoa học, Lãng mạn,...)
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- VD: "Khoa học viễn tưởng", "Lãng mạn"
    slug VARCHAR(100)                  -- VD: "khoa-hoc-vien-tuong" (dùng cho URL đẹp)
);

-- 2. Bảng Người dùng (Gộp cả Admin, Nhân viên và Member vào 1 bảng để dễ quản lý login)
-- Khớp với Image 1 và Image 3
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,    -- "Phan Hoang Vu", "Nguyễn Văn An"
    email VARCHAR(100) NOT NULL UNIQUE, -- "vu.admin@library.com"
    password VARCHAR(255) NOT NULL,     -- Lưu hash password
    phone VARCHAR(20),
    avatar VARCHAR(255),                -- Link ảnh đại diện
    
    -- Phân quyền (Khớp Image 1)
    role ENUM('ADMIN', 'LIBRARIAN', 'STOCK_MANAGER', 'MEMBER') DEFAULT 'MEMBER',
    -- ADMIN: Quản trị viên, LIBRARIAN: Thủ thư, STOCK_MANAGER: Kho sách
    
    -- Hệ thống điểm & Hạng (Khớp Image 3)
    points INT DEFAULT 0,               -- VD: 820, 1150
    tier ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND') DEFAULT 'BRONZE',
    
    -- Trạng thái hoạt động
    status ENUM('ACTIVE', 'RESTRICTED', 'BANNED') DEFAULT 'ACTIVE', 
    -- ACTIVE: Đang làm việc/Hoạt động, RESTRICTED: Hạn chế, BANNED: Đã khóa/Nghỉ việc
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày vào làm / Ngày đăng ký
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Bảng Sách (Khớp Image 2)
CREATE TABLE Books (
    book_id VARCHAR(50) PRIMARY KEY,   -- ID dạng chuỗi: "LIT1", "SCI01" (Theo yêu cầu của bạn)
    title VARCHAR(255) NOT NULL,       -- "Đấu trường sinh tử"
    author VARCHAR(100) NOT NULL,      -- "Suzanne Collins"
    category_id INT,
    
    image VARCHAR(255),                -- Link ảnh bìa
    description TEXT,
    
    -- Quản lý kho & Hiển thị
    stock INT DEFAULT 0 CHECK (stock >= 0), -- Số lượng còn lại (nhãn màu xanh "CÒN 20")
    total_stock INT DEFAULT 0,              -- Tổng số lượng sách thư viện có
    
    -- Thống kê
    views INT DEFAULT 0,                    -- Lượt xem
    rating DECIMAL(3, 1) DEFAULT 0.0,       -- Điểm đánh giá trung bình (VD: 4.8)
    borrow_count INT DEFAULT 0,             -- Đếm số lần mượn để làm BXH (Image 2 bên phải)
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

-- 4. Bảng Mượn Trả / Giao dịch (Khớp Image 4)
CREATE TABLE Transactions (
    trans_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id VARCHAR(50) NOT NULL,
    
    type ENUM('BORROW', 'BUY') DEFAULT 'BORROW', -- Hỗ trợ cả Mượn và Mua (như ảnh 4 "ĐÃ MUA")
    
    -- Ngày tháng
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- Ngày mượn / Ngày mua
    due_date DATETIME,                             -- Hạn trả (Chỉ dùng cho BORROW)
    return_date DATETIME,                          -- Ngày khách trả thực tế
    
    -- Trạng thái chi tiết
    status ENUM('PENDING', 'BORROWING', 'RETURNED', 'OVERDUE', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    -- BORROWING: Đang mượn, COMPLETED: Đã mua xong hoặc Đã trả xong
    
    note TEXT, -- Ghi chú (VD: Sách bị rách bìa)
    
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);

-- 5. Bảng Đánh giá (Để tính sao cho sách)
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id VARCHAR(50),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);