/* =========================================
   SCRIPT QUẢN LÝ TOÀN BỘ WEBSITE
   ========================================= */

// --- CẤU HÌNH CHUNG ---
const ITEMS_PER_PAGE = 6;       // Số sách mỗi trang
let currentPage = 1;            // Trang hiện tại
let currentCategory = 'Tất cả'; // Danh mục đang chọn

/* =========================================
   1. ENTRY POINT (CHẠY KHI WEB TẢI XONG)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1.1 KHỞI TẠO CÁC TÍNH NĂNG CHUNG
    checkLoginStatus();    // Kiểm tra đã đăng nhập chưa
    setupHeaderNav();      // Cài đặt chuyển trang trên menu
    setupAuthModals();     // Cài đặt Popup Đăng nhập & Đăng ký

    // 1.2 KHỞI TẠO RIÊNG CHO TRANG CHỦ (Nếu tìm thấy chỗ hiện sách)
    const bookContainer = document.getElementById('book-list-container');
    if (bookContainer && typeof books !== 'undefined') {
        setupCategoryTabs(); // Cài đặt nút lọc danh mục
        loadPage(1);         // Load sách trang 1
        renderRanking(books);// Load bảng xếp hạng
    }

    // 1.3 KHỞI TẠO RIÊNG CHO TRANG LIÊN HỆ
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        setupContactLogic(contactForm);
    }
});

/* =========================================
   2. LOGIC ĐĂNG NHẬP, ĐĂNG KÝ & TÀI KHOẢN
   ========================================= */

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const guestNav = document.querySelector('.header-right.guest');
    const userNav = document.querySelector('.header-right.user');

    if (isLoggedIn) {
        if(guestNav) guestNav.style.display = 'none';
        if(userNav) {
            userNav.style.display = 'flex';
            const avatar = userNav.querySelector('.user-avatar');
            if(avatar) {
                avatar.onclick = () => {
                    if(confirm("Bạn muốn đăng xuất?")) {
                        localStorage.setItem('isLoggedIn', 'false');
                        window.location.reload();
                    }
                };
                avatar.title = "Bấm để đăng xuất";
            }
        }
    } else {
        if(guestNav) guestNav.style.display = 'flex';
        if(userNav) userNav.style.display = 'none';
    }
}

// Hàm quản lý Modal: Mở, Đóng, Chuyển đổi Login <-> Register
function setupAuthModals() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    const loginBtn = document.getElementById('Login-Btn');
    const registerBtn = document.getElementById('Register-Btn');

    const closeBtns = document.querySelectorAll('.close-modal');
    
    // Link chuyển đổi
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    // 1. Mở Modal từ Header
    if (loginBtn && loginModal) {
        loginBtn.onclick = () => {
            loginModal.style.display = 'block';
            registerModal.style.display = 'none';
        };
    }
    if (registerBtn && registerModal) {
        registerBtn.onclick = () => {
            registerModal.style.display = 'block';
            loginModal.style.display = 'none';
        };
    }

    // 2. Đóng Modal (Dấu X)
    closeBtns.forEach(btn => {
        btn.onclick = () => {
            if(loginModal) loginModal.style.display = 'none';
            if(registerModal) registerModal.style.display = 'none';
        };
    });

    // 3. Đóng khi click ra ngoài (Overlay)
    window.onclick = (event) => {
        if (loginModal && event.target === loginModal) loginModal.style.display = 'none';
        if (registerModal && event.target === registerModal) registerModal.style.display = 'none';
    };

    // 4. Chuyển đổi Login <-> Register
    if (switchToRegister && registerModal && loginModal) {
        switchToRegister.onclick = (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        };
    }

    if (switchToLogin && loginModal && registerModal) {
        switchToLogin.onclick = (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        };
    }

    // 5. Gọi hàm xử lý Submit
    handleAuthSubmit();
}

function handleAuthSubmit() {
    // --- Xử lý Đăng Nhập ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            alert("Đăng nhập thành công! (Demo)");
            localStorage.setItem('isLoggedIn', 'true');
            document.getElementById('loginModal').style.display = 'none';
            checkLoginStatus(); // Cập nhật lại Header ngay lập tức
        };
    }

    // --- Xử lý Đăng Ký ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.onsubmit = (e) => {
            e.preventDefault();
            
            // Lấy dữ liệu (Demo check pass)
            const inputs = registerForm.querySelectorAll('input');
            const password = inputs[3].value;       // Input thứ 4 là Pass
            const confirmPass = inputs[4].value;    // Input thứ 5 là Confirm Pass

            if (password !== confirmPass) {
                alert("Mật khẩu xác nhận không khớp!");
                return;
            }

            alert("Đăng ký thành công! Hãy đăng nhập ngay.");
            
            // Chuyển sang màn hình đăng nhập
            document.getElementById('registerModal').style.display = 'none';
            document.getElementById('loginModal').style.display = 'block';
            
            // Reset form
            registerForm.reset();
        };
    }
}

/* =========================================
   3. LOGIC CHUYỂN TRANG (NAVIGATION)
   ========================================= */
function setupHeaderNav() {
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

    const logo = document.querySelector('.header-logo');
    if(logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => window.location.href = 'HomePage.html');
    }
}

/* =========================================
   4. LOGIC HIỂN THỊ SÁCH (LỌC & PHÂN TRANG)
   ========================================= */
function loadPage(page) {
    currentPage = page;
    
    const filteredBooks = (currentCategory === 'Tất cả') 
        ? books 
        : books.filter(book => book.genre === currentCategory);

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const displayBooks = filteredBooks.slice(start, end);
    
    renderBooks(displayBooks);
    renderPagination(filteredBooks.length, page);
}

function renderBooks(bookList) {
    const container = document.getElementById('book-list-container');
    if (!container) return;
    
    container.innerHTML = '';

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

function renderPagination(totalItems, activePage) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = ''; 
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (totalPages <= 1) return;

    const createBtn = (content, targetPage, isActive = false) => {
        const btn = document.createElement('button');
        btn.innerHTML = content;
        btn.className = `page-btn ${isActive ? 'active' : ''}`;
        btn.onclick = () => loadPage(targetPage);
        return btn;
    };

    paginationContainer.appendChild(createBtn('<i class="fa-solid fa-chevron-left"></i>', activePage > 1 ? activePage - 1 : 1));

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.appendChild(createBtn(i, i, i === activePage));
    }

    paginationContainer.appendChild(createBtn('<i class="fa-solid fa-chevron-right"></i>', activePage < totalPages ? activePage + 1 : totalPages));
}

function setupCategoryTabs() {
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.cat-btn.active')?.classList.remove('active');
            this.classList.add('active');
            
            currentCategory = this.innerText.trim();
            loadPage(1);
        });
    });
    
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
    window.location.href = `BookDetail.html?id=${id}`;
}