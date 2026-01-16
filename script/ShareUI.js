/* =========================================
   FILE: SharedUI.js
   Mục đích: Chứa HTML chung và Logic xử lý Header, Footer, Auth, Modals
   ========================================= */
import authApi from '../api/authAPI.js';

// --- PHẦN 1: HTML TEMPLATES (Copy HTML từ file cũ vào đây) ---

const HEADER_HTML = `
    <div class="header-logo">
        <img src="../../icons/Logo HUST.png" alt="Logo HUST">
    </div>
    <div class="header-middle">
        <div class="search-box">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" placeholder="Tìm tên sách, tác giả, ISBN...">
        </div>
    </div>
    <div class="header-right guest">
        <button id="Login-Btn" class="btn btn-outline">Đăng nhập</button>
        <button id="Register-Btn" class="btn btn-primary">Đăng ký</button>
    </div>
    <div class="header-right user" style="display: none;">
        <button id="nav-home" class="nav-link">Trang Chủ</button>
        <button id="nav-books" class="nav-link">Sách của tôi</button>
        <button id="nav-policy" class="nav-link">Chính sách</button>
        <button id="nav-contact" class="nav-link">Liên hệ</button>
        <button id="nav-notif" class="nav-link">Thông báo</button>
        
        <div class="user-menu-container">
            <div class="user-avatar" id="avatar-btn">
                <img src="" alt="Avatar"> </div>
            <div class="dropdown-menu" id="user-dropdown">
                <div class="dropdown-header">
                    <span class="user-name">User</span>
                    <span class="user-role">Sinh viên</span>
                </div>
                <ul class="dropdown-items">
                    <li><a href="#" id="open-profile-btn"><i class="fa-solid fa-user"></i> Hồ sơ cá nhân</a></li>
                    <li><a href="#"><i class="fa-solid fa-gear"></i> Cài đặt</a></li>
                    <li class="divider"></li>
                    <li><a href="#" class="logout"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</a></li>
                </ul>
            </div>
        </div>
    </div>
`;

const FOOTER_HTML = `
    <div class="footer-content">
        <div class="footer-section about">
            <div class="footer-logo">
                <img src="../../icons/Logo HUST.png" alt="Logo Footer" style="height: 50px; margin-bottom: 15px;">
                <h3>Thư viện Bách Khoa</h3>
            </div>
            <p>Hệ thống thư viện hiện đại, cung cấp hàng ngàn tài liệu học tập và nghiên cứu.</p>
            <div class="socials">
                <a href="#"><i class="fa-brands fa-facebook"></i></a>
                <a href="#"><i class="fa-brands fa-youtube"></i></a>
            </div>
        </div>
        <div class="footer-section links">
            <h3>Khám phá</h3>
            <ul>
                <li><a href="#">Sách mới nhất</a></li>
                <li><a href="#">Tài liệu số</a></li>
            </ul>
        </div>
        <div class="footer-section contact">
            <h3>Liên hệ</h3>
            <div class="contact-info">
                <p><i class="fa-solid fa-location-dot"></i> Số 1 Đại Cồ Việt, Hà Nội</p>
                <p><i class="fa-solid fa-envelope"></i> library@hust.edu.vn</p>
            </div>
        </div>
    </div>
    <div class="footer-bottom">&copy; 2025 Library Management System | Nhóm PHV</div>
`;

const MODALS_HTML = `
    <div id="loginModal" class="modal-overlay">
        <div class="modal-box">
            <span class="close-modal close-login">&times;</span>
            <div class="modal-header"><h2>Đăng nhập</h2></div>
            <form id="login-form">
                <div class="input-group"><label>Email</label><input type="email" id="email" required></div>
                <div class="input-group"><label>Mật khẩu</label><input type="password" id="password" required></div>
                <button type="submit" class="btn-submit">Đăng nhập</button>
                <div class="auth-switch">Chưa có tài khoản? <a href="#" id="switch-to-register">Đăng ký ngay</a></div>
            </form>
        </div>
    </div>

    <div id="registerModal" class="modal-overlay">
        <div class="modal-box">
            <span class="close-modal close-register">&times;</span>
            <div class="modal-header"><h2>Đăng ký</h2></div>
            <form id="register-form">
                <div class="input-group"><label>Họ tên</label><input type="text" required></div>
                <div class="input-group"><label>Email</label><input type="email" required></div>
                <div class="input-group"><label>Mật khẩu</label><input type="password" required></div>
                <div class="input-group"><label>Nhập lại MK</label><input type="password" required></div>
                <div class="input-group"><label>SĐT</label><input type="tel" required></div>
                <button type="submit" class="btn-submit">Đăng ký</button>
                <div class="auth-switch">Đã có tài khoản? <a href="#" id="switch-to-login">Đăng nhập</a></div>
            </form>
        </div>
    </div>

    <div id="profileModal" class="modal-overlay">
        <div class="modal-box profile-modal-box">
            <span class="close-modal close-profile">&times;</span>
            <div class="profile-container">
                <div class="profile-sidebar">
                    <div class="profile-avatar-large">
                        <img src="" alt="Avatar">
                    </div>
                    <h2 class="profile-name">User</h2>
                    <p class="profile-email">email@hust.edu.vn</p>
                    <div class="member-card">
                        <div class="card-row"><span>Hạng</span><span class="rank-badge gold">VÀNG</span></div>
                        <div class="card-row"><span>Điểm</span><span class="points">1,250 đ</span></div>
                    </div>
                </div>
                <div class="profile-content">
                    <h3>Cập nhật thông tin</h3>
                    <form id="profile-form">
                        <div class="form-grid">
                            <div class="input-group"><label>Họ tên</label><input type="text"></div>
                            <div class="input-group"><label>SĐT</label><input type="tel"></div>
                            <div class="input-group full-width"><label>Địa chỉ</label><input type="text"></div>
                        </div>
                        <div class="profile-actions">
                            <button type="button" class="btn btn-outline close-profile">Hủy</button>
                            <button type="submit" class="btn btn-primary">Lưu</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
`;

// --- PHẦN 2: LOGIC KHỞI TẠO (Export hàm này ra ngoài) ---

export function initSharedUI() {
    // 1. Inject HTML vào trang
    renderSharedHTML();

    // 2. Kích hoạt các tính năng
    checkLoginStatus();
    setupHeaderNav();
    setupAuthModals();
    setupUserDropdown();
    setupProfileModal();
}

// Hàm bơm HTML vào các thẻ placeholder
function renderSharedHTML() {
    const headerEl = document.querySelector('.header');
    if (headerEl) headerEl.innerHTML = HEADER_HTML;

    const footerEl = document.querySelector('.footer');
    if (footerEl) footerEl.innerHTML = FOOTER_HTML;

    // Modals thì append vào cuối body
    document.body.insertAdjacentHTML('beforeend', MODALS_HTML);
}

// --- PHẦN 3: CÁC HÀM LOGIC (Chuyển từ Homepage.js sang) ---

function checkLoginStatus() {
    const token = localStorage.getItem('accessToken');
    let userInfo = {};
    try { userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}'); } catch (e) {}
    
    const guestNav = document.querySelector('.header-right.guest');
    const userNav = document.querySelector('.header-right.user');

    if (token && userNav) {
        if(guestNav) guestNav.style.display = 'none';
        userNav.style.display = 'flex';
        
        // Update Avatar & Name
        const allAvatars = document.querySelectorAll('.user-avatar img, .profile-avatar-large img');
        allAvatars.forEach(img => {
            img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name || 'User')}&background=random`;
        });
        
        const nameEls = document.querySelectorAll('.user-name, .profile-name');
        nameEls.forEach(el => el.textContent = userInfo.name);
        
        const emailEls = document.querySelectorAll('.profile-email');
        emailEls.forEach(el => el.textContent = userInfo.email);

        // Logout logic
        const logoutBtn = document.querySelector('.logout');
        if(logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if(confirm("Đăng xuất?")) {
                    localStorage.clear();
                    window.location.href = 'HomePage.html';
                }
            });
        }
    } else {
        if(guestNav) guestNav.style.display = 'flex';
        if(userNav) userNav.style.display = 'none';
    }
}

function setupUserDropdown() {
    const avatarBtn = document.getElementById("avatar-btn");
    const userMenuContainer = document.querySelector(".user-menu-container");

    if (avatarBtn && userMenuContainer) {
        avatarBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            userMenuContainer.classList.toggle("active");
        });
        document.addEventListener("click", (e) => {
            if (!userMenuContainer.contains(e.target)) userMenuContainer.classList.remove("active");
        });
    }
}

function setupProfileModal() {
    const openBtn = document.getElementById("open-profile-btn");
    const modal = document.getElementById("profileModal");
    const closeBtns = document.querySelectorAll(".close-profile");
    const userMenuContainer = document.querySelector(".user-menu-container");

    if (openBtn && modal) {
        openBtn.addEventListener("click", (e) => {
            e.preventDefault();
            modal.style.display = "block";
            if(userMenuContainer) userMenuContainer.classList.remove("active");
        });
        
        closeBtns.forEach(btn => btn.addEventListener("click", () => modal.style.display = "none"));
        
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }
}

function setupAuthModals() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('Login-Btn');
    const registerBtn = document.getElementById('Register-Btn');
    
    // Nút tắt
    document.querySelectorAll('.close-login').forEach(btn => btn.onclick = () => loginModal.style.display = 'none');
    document.querySelectorAll('.close-register').forEach(btn => btn.onclick = () => registerModal.style.display = 'none');

    // Nút mở
    if (loginBtn) loginBtn.onclick = () => loginModal.style.display = 'block';
    if (registerBtn) registerBtn.onclick = () => registerModal.style.display = 'block';

    // Chuyển đổi
    const toReg = document.getElementById('switch-to-register');
    const toLog = document.getElementById('switch-to-login');
    
    if(toReg) toReg.onclick = (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    }
    if(toLog) toLog.onclick = (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    }

    handleAuthSubmit();
}

function handleAuthSubmit() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res = await authApi.login({ email, password });
                localStorage.setItem('accessToken', res.token);
                localStorage.setItem('userInfo', JSON.stringify(res.userInfo));
                alert("Đăng nhập thành công");
                window.location.reload();
            } catch (err) {
                alert("Đăng nhập thất bại");
            }
        };
    }
    // (Thêm logic registerForm tương tự...)
}

function setupHeaderNav() {
    const navLinks = {
        'nav-home': 'HomePage.html',
        'nav-books': 'MyBook.html',
        'nav-policy': 'Policy.html',
        'nav-contact': 'Contact.html',
        'nav-notif': 'Notification.html'
    };
    for (const [id, url] of Object.entries(navLinks)) {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => window.location.href = url);
    }
    const logo = document.querySelector('.header-logo');
    if(logo) logo.addEventListener('click', () => window.location.href = 'HomePage.html');
}