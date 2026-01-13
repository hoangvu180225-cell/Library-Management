/* =========================================
   SCRIPT QUẢN LÝ TOÀN BỘ WEBSITE (Đã tích hợp API)
   ========================================= */
import authApi from '../api/authAPI.js';
import bookApi from '../api/bookAPI.js'; 

// --- CẤU HÌNH CHUNG ---
const ITEMS_PER_PAGE = 6;       // Số sách mỗi trang
let currentPage = 1;            // Trang hiện tại
let currentCategory = 'Tất cả'; // Danh mục đang chọn
let globalBookList = [];        // Biến lưu trữ danh sách sách lấy từ API

/* =========================================
   1. ENTRY POINT (CHẠY KHI WEB TẢI XONG)
   ========================================= */
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1.1 KHỞI TẠO CÁC TÍNH NĂNG UI CƠ BẢN
    checkLoginStatus();    
    setupHeaderNav();      
    setupAuthModals();     

    // 1.2 GỌI API LẤY DANH SÁCH SÁCH (Thay thế cho BookData.js)
    const bookContainer = document.getElementById('book-list-container');
    if (bookContainer) {
        setupCategoryTabs(); // Cài đặt nút lọc danh mục
        await fetchAndRenderBooks();
    }

    // 1.3 KHỞI TẠO TRANG LIÊN HỆ
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) setupContactLogic(contactForm);
});

/* =========================================
   2. LOGIC TƯƠNG TÁC API DỮ LIỆU SÁCH
   ========================================= */
async function fetchAndRenderBooks() {
    try {
        const response = await bookApi.getAll(); 
        
        // Lưu dữ liệu vào biến toàn cục để dùng cho lọc/phân trang client-side
        globalBookList = response.data || response; // Tùy cấu trúc trả về của BE

        console.log("Dữ liệu sách lấy về:", globalBookList); 
        if (globalBookList.length > 0) {
            console.log("Cấu trúc 1 quyển sách:", globalBookList[0]);
        }
        
        // Render lần đầu
        loadPage(1);
        renderRanking(globalBookList);

    } catch (error) {
        console.error("Lỗi lấy dữ liệu sách:", error);
        document.getElementById('book-list-container').innerHTML = 
            `<p style="text-align:center; color:red;">Không thể kết nối đến máy chủ dữ liệu.</p>`;
    }
}

/* =========================================
   3. LOGIC ĐĂNG NHẬP, ĐĂNG KÝ & TÀI KHOẢN (Đã chuẩn hóa)
   ========================================= */
function checkLoginStatus() {
    const token = localStorage.getItem('accessToken');
    // Parse an toàn để tránh lỗi nếu JSON hỏng
    let userInfo = {};
    try {
        userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    } catch (e) { userInfo = {}; }
    
    const guestNav = document.querySelector('.header-right.guest');
    const userNav = document.querySelector('.header-right.user');

    if (token) {
        if(guestNav) guestNav.style.display = 'none';
        if(userNav) {
            userNav.style.display = 'flex';
            
            // Hiển thị Avatar User
            const avatarImg = userNav.querySelector('.user-avatar img');
            if(avatarImg && userInfo.name) {
                avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=random`;
            }

            // Xử lý Đăng xuất
            const avatarDiv = userNav.querySelector('.user-avatar');
            if(avatarDiv) {
                avatarDiv.onclick = () => {
                    if(confirm("Bạn muốn đăng xuất?")) {
                        localStorage.clear();
                        window.location.reload();
                    }
                };
            }
        }
    } else {
        if(guestNav) guestNav.style.display = 'flex';
        if(userNav) userNav.style.display = 'none';
    }
}

function setupAuthModals() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('Login-Btn');
    const registerBtn = document.getElementById('Register-Btn');
    const closeBtns = document.querySelectorAll('.close-modal');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    // Mở Modal (Gán sự kiện bằng JS thay vì HTML onclick)
    if (loginBtn) loginBtn.onclick = () => { loginModal.style.display = 'block'; };
    if (registerBtn) registerBtn.onclick = () => { registerModal.style.display = 'block'; };

    // Đóng Modal
    closeBtns.forEach(btn => {
        btn.onclick = () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        };
    });

    // Click ra ngoài để đóng
    window.onclick = (event) => {
        if (event.target === loginModal) loginModal.style.display = 'none';
        if (event.target === registerModal) registerModal.style.display = 'none';
    };

    // Chuyển đổi qua lại
    if (switchToRegister) {
        switchToRegister.onclick = (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        };
    }

    if (switchToLogin) {
        switchToLogin.onclick = (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        };
    }
    
    handleAuthSubmit();
}

function handleAuthSubmit() {
    // --- XỬ LÝ ĐĂNG NHẬP ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // GỌI API LOGIN
                const response = await authApi.login({ email, password });
                
                // Lưu Token & Info
                localStorage.setItem('accessToken', response.token);
                localStorage.setItem('userInfo', JSON.stringify(response.userInfo));
                
                alert("Đăng nhập thành công!");
                window.location.reload(); // Load lại để cập nhật Header
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
            }
        };
    }

    // --- XỬ LÝ ĐĂNG KÝ ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            const inputs = registerForm.querySelectorAll('input');
            // Mapping theo thứ tự input trong HTML của bạn
            // 0: Họ tên, 1: Email, 2: Pass, 3: Confirm Pass, 4: Phone
            const name = inputs[0].value;
            const email = inputs[1].value;
            const password = inputs[2].value;
            const confirmPass = inputs[3].value;
            const phone = inputs[4].value;

            console.log(name, email, password, phone);
            // --- BỔ SUNG: CHECK ĐỘ DÀI PASSWORD ---
            if (password.length < 6) {
                alert("Mật khẩu phải có ít nhất 6 ký tự!");
                return;
            }

            if (password !== confirmPass) {
                alert("Mật khẩu xác nhận không khớp!");
                return;
            }

            try {
                // GỌI API REGISTER
                await authApi.register({ name, email, password, phone });
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                
                // Chuyển sang Modal Login
                document.getElementById('registerModal').style.display = 'none';
                document.getElementById('loginModal').style.display = 'block';
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || "Lỗi đăng ký! Có thể Email đã tồn tại.");
            }
        };
    }
}

/* =========================================
   4. LOGIC CHUYỂN TRANG (NAVIGATION)
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
    
    // Logo về trang chủ
    const logo = document.querySelector('.header-logo');
    if(logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => window.location.href = 'HomePage.html');
    }
}

/* =========================================
   5. LOGIC HIỂN THỊ SÁCH (LỌC & PHÂN TRANG)
   ========================================= */
   const CATEGORY_MAP = {
    1: 'Khoa học Viễn tưởng',
    2: 'Văn học & Lãng mạn',
    3: 'Trinh thám & Ly kỳ',
    4: 'Sách Thiếu nhi',
    5: 'Lịch sử & Tri thức'
};

function loadPage(page) {
    currentPage = page;
    
    // Lọc dữ liệu
    const filteredBooks = (currentCategory === 'Tất cả') 
        ? globalBookList 
        : globalBookList.filter(book => {
            // Lấy tên thể loại từ ID để so sánh với cái Tab đang chọn
            const catName = CATEGORY_MAP[book.category_id]; 
            return catName === currentCategory;
        });

    // Tính toán phân trang
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
        // --- XỬ LÝ LOGIC HIỂN THỊ ---
        
        // 1. Xử lý tồn kho
        let stockBadge = book.stock > 0 
            ? `<span class="badge in-stock">Còn ${book.stock}</span>` 
            : `<span class="badge out-stock">Hết hàng</span>`;
        
        // 2. Xử lý Thể loại: Nếu backend trả về tên thì dùng, nếu trả về ID thì map sang tên
        let categoryName = book.genre || CATEGORY_MAP[book.category_id] || 'Đang cập nhật';

        // 3. Xử lý Mô tả: Cắt ngắn nếu quá dài (cho đỡ vỡ giao diện)
        // Lấy field 'description' từ DB (Code cũ là 'desc' -> Sai)
        let rawDesc = book.description || 'Chưa có mô tả cho cuốn sách này.';
        let shortDesc = rawDesc.length > 80 ? rawDesc.substring(0, 80) + '...' : rawDesc;

        // --- RENDER HTML ---
        // Lưu ý: Đã thay book.id bằng book.book_id
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
                        <span class="genre">${categoryName}</span>
                        <span class="rating"><i class="fa-solid fa-star"></i> ${book.rating || 5.0}</span>
                    </div>

                    <p class="book-desc" title="${rawDesc}">${shortDesc}</p>
                    
                    <p class="book-price" style="color: #d9534f; font-weight: bold; margin-top: 5px;">
                        ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price || 0)}
                    </p>
                </div>
                <div class="book-actions">
                    <button class="btn-text" onclick="viewDetails('${book.book_id}')">Xem chi tiết</button>
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

    // Nút Previous
    paginationContainer.appendChild(createBtn('<i class="fa-solid fa-chevron-left"></i>', activePage > 1 ? activePage - 1 : 1));

    // Nút số trang
    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.appendChild(createBtn(i, i, i === activePage));
    }

    // Nút Next
    paginationContainer.appendChild(createBtn('<i class="fa-solid fa-chevron-right"></i>', activePage < totalPages ? activePage + 1 : totalPages));
}

function setupCategoryTabs() {
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.cat-btn.active')?.classList.remove('active');
            this.classList.add('active');
            
            currentCategory = this.innerText.trim();
            loadPage(1); // Về trang 1 khi lọc
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
   6. LOGIC BẢNG XẾP HẠNG & LIÊN HỆ
   ========================================= */
function renderRanking(bookList) {
    const container = document.getElementById('rank-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    // Sắp xếp theo views (Giả sử API trả về trường views)
    const topBooks = [...bookList].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

    topBooks.forEach((book, index) => {
        const html = `
            <div class="rank-item">
                <div class="rank-num top-${index + 1}">${index + 1}</div>
                <img src="${book.image}" alt="${book.title}" onclick="viewDetails('${book.book_id}')" style="cursor:pointer">
                <div class="rank-info">
                    <h4 class="btn-text" onclick="viewDetails('${book.book_id}')" style="cursor:pointer">${book.title}</h4>
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
   7. HÀM HỖ TRỢ (UTILS)
   ========================================= */
// QUAN TRỌNG: Gán vào window để HTML onclick gọi được khi dùng module
window.viewDetails = function(id) {
    window.location.href = `BookDetail.html?id=${id}`;
};