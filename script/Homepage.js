/* =========================================
   SCRIPT QUẢN LÝ TOÀN BỘ WEBSITE (ALL-IN-ONE)
   ========================================= */

// --- CẤU HÌNH CHUNG ---
const ITEMS_PER_PAGE = 6;       // Số sách mỗi trang
let currentPage = 1;            // Trang hiện tại
let currentCategory = 'Tất cả'; // Danh mục đang chọn

/* =========================================
   1. ENTRY POINT (CHẠY KHI WEB TẢI XONG)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1.1 KHỞI TẠO CÁC TÍNH NĂNG CHUNG (HEADER, LOGIN)
    checkLoginStatus();    // Kiểm tra đã đăng nhập chưa
    setupHeaderNav();      // Cài đặt chuyển trang trên menu
    setupModalLogin();     // Cài đặt popup đăng nhập
    setupLoginForm();      // Xử lý nút Submit đăng nhập

    // 1.2 KHỞI TẠO RIÊNG CHO TRANG CHỦ (Nếu tìm thấy chỗ hiện sách)
    const bookContainer = document.getElementById('book-list-container');
    if (bookContainer && typeof books !== 'undefined') {
        setupCategoryTabs(); // Cài đặt nút lọc danh mục
        loadPage(1);         // Load sách trang 1
        renderRanking(books);// Load bảng xếp hạng
    }

    // 1.3 KHỞI TẠO RIÊNG CHO TRANG LIÊN HỆ (Nếu tìm thấy form)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        setupContactLogic(contactForm);
    }
});

/* =========================================
   2. LOGIC ĐĂNG NHẬP & TÀI KHOẢN (QUAN TRỌNG)
   ========================================= */

// Kiểm tra trạng thái đăng nhập từ localStorage
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const guestNav = document.querySelector('.header-right.guest'); // Nút Đăng nhập/Đăng ký
    const userNav = document.querySelector('.header-right.user');   // Avatar user

    if (isLoggedIn) {
        // Đã đăng nhập
        if(guestNav) guestNav.style.display = 'none';
        if(userNav) {
            userNav.style.display = 'flex';
            
            // Tính năng Đăng xuất khi bấm vào Avatar
            const avatar = userNav.querySelector('.user-avatar');
            if(avatar) {
                avatar.onclick = () => {
                    if(confirm("Bạn muốn đăng xuất?")) {
                        localStorage.setItem('isLoggedIn', 'false');
                        window.location.reload(); // Tải lại trang để reset
                    }
                };
                avatar.title = "Bấm để đăng xuất";
            }
        }
    } else {
        // Chưa đăng nhập
        if(guestNav) guestNav.style.display = 'flex';
        if(userNav) userNav.style.display = 'none';
    }
}

// Cài đặt nút mở/đóng Modal
function setupModalLogin() {
    const loginBtn = document.getElementById('Login-Btn');
    const modal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close-modal');

    // Chỉ gán sự kiện nếu nút và modal CÓ tồn tại trên trang này
    if (loginBtn && modal) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }

    // Đóng khi bấm ra ngoài
    window.addEventListener('click', (e) => {
        if (modal && e.target == modal) {
            modal.style.display = 'none';
        }
    });
}

// Xử lý sự kiện Submit Form Đăng nhập
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const modal = document.getElementById('loginModal');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Chặn load lại trang
            
            // 1. Giả lập đăng nhập thành công
            alert("Đăng nhập thành công! (Demo)");
            
            // 2. Lưu trạng thái
            localStorage.setItem('isLoggedIn', 'true');
            
            // 3. Ẩn modal và cập nhật giao diện
            if (modal) modal.style.display = 'none';
            checkLoginStatus();
        });
    }
}

/* =========================================
   3. LOGIC CHUYỂN TRANG (NAVIGATION)
   ========================================= */
function setupHeaderNav() {
    // Map ID nút -> File HTML đích
    const navLinks = {
        'nav-home': 'HomePage.html',
        'nav-policy': 'Policy.html',
        'nav-contact': 'Contact.html',
        'nav-notif': 'Notification.html',
        'nav-books': 'MyBook.html' 
    };

    for (const [id, url] of Object.entries(navLinks)) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                if (url === '#') alert("Tính năng đang phát triển!");
                else window.location.href = url;
            });
        }
    }

    // Click Logo về trang chủ
    const logo = document.querySelector('.header-logo');
    if(logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => window.location.href = 'HomePage.html');
    }
}

/* =========================================
   4. LOGIC HIỂN THỊ SÁCH (LỌC & PHÂN TRANG)
   ========================================= */

// Hàm điều phối chính
function loadPage(page) {
    currentPage = page;
    
    // 1. Lọc sách theo danh mục hiện tại
    const filteredBooks = (currentCategory === 'Tất cả') 
        ? books 
        : books.filter(book => book.genre === currentCategory);

    // 2. Tính toán phân trang
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const displayBooks = filteredBooks.slice(start, end);
    
    // 3. Render ra màn hình
    renderBooks(displayBooks);
    renderPagination(filteredBooks.length, page);
}

// Render HTML sách
function renderBooks(bookList) {
    const container = document.getElementById('book-list-container');
    if (!container) return; // Bảo vệ: Nếu không có container thì dừng
    
    container.innerHTML = ''; // Xóa cũ

    if(bookList.length === 0) {
        container.innerHTML = `<p style="text-align:center; width:100%; color:#64748b; margin-top:30px;">
            Không có sách nào thuộc mục "${currentCategory}".
        </p>`;
        return;
    }

    bookList.forEach(book => {
        let stockBadge = book.stock > 0 
            ? `<span class="badge in-stock">Còn ${book.stock}</span>` 
            : `<span class="badge out-stock">Hết hàng</span>`;

        // Format số tiền hoặc số liệu khác nếu cần
        
        const html = `
            <div class="book-card">
                <div class="book-thumb">
                    ${stockBadge}
                    <img src="${book.image}" alt="${book.title}" loading="lazy">
                </div>
                <div class="book-details">
                    <h3 class="book-title" title="${book.title}">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-meta">
                        <span class="genre">${book.genre}</span>
                        <span class="rating"><i class="fa-solid fa-star"></i> ${book.rating}</span>
                    </div>
                    <p class="book-desc">${book.desc}</p>
                </div>
                <div class="book-actions">
                    <button class="btn-text" onclick="viewDetails('${book.id}')">Xem chi tiết</button>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// Render các nút số trang
function renderPagination(totalItems, activePage) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = ''; 
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (totalPages <= 1) return; // Ít sách quá thì ẩn phân trang

    // Helper tạo nút
    const createBtn = (content, targetPage, isActive = false) => {
        const btn = document.createElement('button');
        btn.innerHTML = content;
        btn.className = `page-btn ${isActive ? 'active' : ''}`;
        btn.onclick = () => loadPage(targetPage);
        return btn;
    };

    // Nút Previous
    paginationContainer.appendChild(createBtn('<i class="fa-solid fa-chevron-left"></i>', activePage > 1 ? activePage - 1 : 1));

    // Nút số
    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.appendChild(createBtn(i, i, i === activePage));
    }

    // Nút Next
    paginationContainer.appendChild(createBtn('<i class="fa-solid fa-chevron-right"></i>', activePage < totalPages ? activePage + 1 : totalPages));
}

// Xử lý nút Danh mục
function setupCategoryTabs() {
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Đổi màu nút active
            document.querySelector('.cat-btn.active')?.classList.remove('active');
            this.classList.add('active');
            
            // Lấy tên danh mục và load lại
            currentCategory = this.innerText.trim();
            loadPage(1); // Về trang 1
        });
    });
    
    // Xử lý nút Rank Time (Chỉ UI)
    const rankTime = document.querySelectorAll('.ranktime');
    rankTime.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.ranktime.active')?.classList.remove('active');
            this.classList.add('active');
        });
    });
}

/* =========================================
   5. LOGIC BẢNG XẾP HẠNG & LIÊN HỆ
   ========================================= */

function renderRanking(bookList) {
    const container = document.getElementById('rank-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    // Sắp xếp theo views giảm dần, lấy top 5
    const topBooks = [...bookList].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

    topBooks.forEach((book, index) => {
        const html = `
            <div class="rank-item">
                <div class="rank-num top-${index + 1}">${index + 1}</div>
                <img src="${book.image}" alt="${book.title}" onclick="viewDetails('${book.id}')" style="cursor:pointer">
                <div class="rank-info">
                    <h4 class="btn-text" onclick="viewDetails('${book.id}')" style="cursor:pointer">${book.title}</h4>
                    <span class="views">${(book.views || 0).toLocaleString()} lượt mượn</span>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function setupContactLogic(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn.");
        form.reset();
    });
}

/* =========================================
   6. HÀM HỖ TRỢ (UTILS)
   ========================================= */
function viewDetails(id) {
    // Chuyển hướng sang trang chi tiết
    window.location.href = `BookDetail.html?id=${id}`;
}