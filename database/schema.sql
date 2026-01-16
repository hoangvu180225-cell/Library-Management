DROP DATABASE IF EXISTS LibraryManagement;
CREATE DATABASE LibraryManagement;
USE LibraryManagement;

-- 1. Bảng Thể loại
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, 
    slug VARCHAR(100)                  
);

-- 2. Bảng Người dùng (Đã thêm cột address)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,    
    email VARCHAR(100) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL,     
    phone VARCHAR(20),
    address VARCHAR(255),               -- MỚI: Thêm cột địa chỉ ở đây
    avatar VARCHAR(255),                
    role ENUM('ADMIN', 'STAFF', 'MEMBER') DEFAULT 'MEMBER',
    points INT DEFAULT 0,               
    tier ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND') DEFAULT 'BRONZE',
    status ENUM('ACTIVE', 'RESTRICTED', 'BANNED') DEFAULT 'ACTIVE', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Bảng Sách
CREATE TABLE Books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE,                
    title VARCHAR(255) NOT NULL,       
    author VARCHAR(100) NOT NULL,      
    category_id INT,
    
    publisher VARCHAR(100) DEFAULT NULL,        -- Nhà xuất bản
    publication_year INT DEFAULT NULL,          -- Năm xuất bản
    book_format VARCHAR(50) DEFAULT 'Bìa mềm',  -- Hình thức
    
    price DECIMAL(10, 2) DEFAULT 0,         
    image VARCHAR(255),                 
    description TEXT,
    
    stock INT DEFAULT 0 CHECK (stock >= 0), 
    total_stock INT DEFAULT 0,              
    
    views INT DEFAULT 0,                    
    rating DECIMAL(3, 1) DEFAULT 0.0,       
    borrow_count INT DEFAULT 0,             
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

-- 4. Bảng Giao dịch (Mượn/Trả/Mua)
CREATE TABLE Transactions (
    trans_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL, 
    type ENUM('BORROW', 'BUY') DEFAULT 'BORROW', 
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
    due_date DATETIME,                                     
    return_date DATETIME,                                  
    status ENUM('PENDING', 'BORROWING', 'RETURNED', 'OVERDUE', 'COMPLETED', 'CANCELLED', 'WISHLIST') DEFAULT 'PENDING',
    note TEXT, 
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);

-- 5. Bảng Đánh giá
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT, 
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);