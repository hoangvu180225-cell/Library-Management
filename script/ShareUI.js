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
            <input type="text" placeholder="Tìm tên sách...">
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
                    <span class="user-role">Thành viên</span>
                </div>
                <ul class="dropdown-items">
                    <li><a href="#" id="open-profile-btn"><i class="fa-solid fa-user"></i> Hồ sơ cá nhân</a></li>
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
                <div class="input-group">
                    <label>Email</label>
                    <input type="email" id="email" placeholder="Ví dụ: sinhvien@hust.edu.vn" required>
                </div>
                <div class="input-group">
                    <label>Mật khẩu</label>
                    <input type="password" id="password" placeholder="Nhập mật khẩu của bạn" required>
                </div>
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
                <div class="input-group">
                    <label>Họ tên</label>
                    <input type="text" placeholder="Nguyễn Văn A" required>
                </div>
                <div class="input-group">
                    <label>Email</label>
                    <input type="email" placeholder="example@hust.edu.vn" required>
                </div>
                <div class="input-group">
                    <label>Mật khẩu</label>
                    <input type="password" placeholder="Tối thiểu 6 ký tự" required>
                </div>
                <div class="input-group">
                    <label>Nhập lại mật khẩu</label>
                    <input type="password" placeholder="Xác nhận lại mật khẩu" required>
                </div>
                <div class="input-group">
                    <label>Số điện thoại</label>
                    <input type="tel" placeholder="Ví dụ: 0987xxxxxx" required>
                </div>
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
                        <img id="profile-avatar-img" src="" alt="Avatar">
                    </div>
                    <h2 class="profile-name" id="display-name">Loading...</h2>
                    <p class="profile-email" id="display-email">...</p>
                    
                    <div class="member-card">
                        <div class="card-row"><span>Hạng</span><span class="rank-badge" id="display-tier">...</span></div>
                        <div class="card-row"><span>Điểm</span><span class="points" id="display-points">0</span></div>
                        <div class="card-row" style="margin-top:5px; border-top:1px solid rgba(255,255,255,0.2); padding-top:5px;">
                            <span>Trạng thái</span>
                            <span id="display-status" style="font-weight:bold;">...</span>
                        </div>
                    </div>
                </div>

                <div class="profile-content">
                    <h3>Cập nhật thông tin</h3>
                    <form id="profile-form">
                        <div class="form-grid">
                            <div class="input-group"><label>Họ tên</label><input type="text" id="input-name" required></div>
                            <div class="input-group"><label>SĐT</label><input type="tel" id="input-phone" required></div>
                            <div class="input-group full-width"><label>Địa chỉ</label><input type="text" id="input-address"></div>
                        </div>

                        <h3 style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">Đổi mật khẩu</h3>
                        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">(Để trống nếu không muốn đổi)</p>
                        
                        <div class="form-grid">
                            <div class="input-group"><label>Mật khẩu hiện tại</label><input type="password" id="input-old-pass"></div>
                            <div class="input-group"><label>Mật khẩu mới</label><input type="password" id="input-new-pass"></div>
                        </div>

                        <div class="profile-actions">
                            <button type="button" class="btn btn-outline close-profile">Hủy</button>
                            <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
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
    setupProfileLogic();
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
        if (userInfo.role === 'ADMIN' || userInfo.role === 'STAFF') {
            const navHome = document.getElementById('nav-home');
            if (navHome && !document.getElementById('nav-admin')) {
                const adminBtn = document.createElement('button');
                adminBtn.id = 'nav-admin';
                adminBtn.className = 'nav-link';
                adminBtn.style.color = '#e74c3c'; // Màu đỏ cho nổi bật
                adminBtn.innerHTML = '<i class="fa-solid fa-user-shield"></i> Quản trị';
                adminBtn.onclick = () => window.location.href = '../AdminPanel/book.html';
                navHome.parentNode.insertBefore(adminBtn, navHome.nextSibling);
            }
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

// --- HÀM XỬ LÝ PROFILE MỚI ---
function setupProfileLogic() {
    const openBtn = document.getElementById("open-profile-btn");
    const modal = document.getElementById("profileModal");
    const closeBtns = document.querySelectorAll(".close-profile");
    const profileForm = document.getElementById("profile-form");
    const userMenuContainer = document.querySelector(".user-menu-container");

    // 1. MỞ MODAL & LOAD DỮ LIỆU TỪ API
    if (openBtn && modal) {
        openBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            if(userMenuContainer) userMenuContainer.classList.remove("active");
            
            modal.style.display = "block";
            
            // Gọi hàm load dữ liệu
            await loadProfileData();
        });
    }

    // 2. ĐÓNG MODAL
    closeBtns.forEach(btn => btn.addEventListener("click", () => modal.style.display = "none"));
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // 3. XỬ LÝ SUBMIT FORM
    if (profileForm) {
        profileForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await handleProfileUpdate();
        });
    }
}

// Hàm gọi API lấy dữ liệu và điền vào form
// Hàm gọi API lấy dữ liệu và điền vào form
async function loadProfileData() {
    try {
        const res = await authApi.getProfile();
        const user = res.data || res; // Tùy vào response trả về

        // 1. Đổ dữ liệu text cơ bản
        document.getElementById('display-name').textContent = user.full_name;
        document.getElementById('display-email').textContent = user.email;
        document.getElementById('profile-avatar-img').src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`;
        
        // 2. XỬ LÝ HẠNG THÀNH VIÊN (LOGIC MỚI)
        const tierEl = document.getElementById('display-tier');
        const tierName = user.tier || "MEMBER"; // Nếu null thì là MEMBER
        
        // Hiển thị tên hạng
        tierEl.textContent = tierName;
        
        // Gán class màu: chuyển về chữ thường (VD: 'GOLD' -> 'gold')
        // Kết quả sẽ là: class="rank-badge gold" hoặc class="rank-badge silver"
        tierEl.className = `rank-badge ${tierName.toLowerCase()}`;

        // 3. Hiển thị điểm
        document.getElementById('display-points').textContent = (user.points || 0).toLocaleString();

        // 4. Xử lý trạng thái (Mapping màu sắc)
        const statusEl = document.getElementById('display-status');
        if (user.status === 'ACTIVE') {
            statusEl.textContent = "Hoạt động";
            statusEl.style.color = "#4ade80"; // Xanh lá
        } else if (user.status === 'BANNED') {
            statusEl.textContent = "Đã khóa";
            statusEl.style.color = "#f87171"; // Đỏ
        } else {
            statusEl.textContent = user.status;
            statusEl.style.color = "#fbbf24"; // Vàng (Chờ duyệt/Khác)
        }

        // 5. Đổ dữ liệu vào Form input
        document.getElementById('input-name').value = user.full_name || "";
        document.getElementById('input-phone').value = user.phone || "";
        document.getElementById('input-address').value = user.address || "";
        
        // Reset ô mật khẩu để tránh người dùng bấm nhầm
        document.getElementById('input-old-pass').value = "";
        document.getElementById('input-new-pass').value = "";

    } catch (error) {
        console.error("Lỗi load profile:", error);
        alert("Không thể tải thông tin cá nhân. Vui lòng thử lại sau.");
    }
}

// Hàm gửi dữ liệu cập nhật
async function handleProfileUpdate() {
    const full_name = document.getElementById('input-name').value;
    const phone = document.getElementById('input-phone').value;
    const address = document.getElementById('input-address').value;
    const currentPassword = document.getElementById('input-old-pass').value;
    const newPassword = document.getElementById('input-new-pass').value;

    // Validate sơ bộ
    if (newPassword && !currentPassword) {
        alert("Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi mật khẩu!");
        return;
    }

    try {
        const payload = {
            full_name,
            phone,
            address,
            currentPassword,
            newPassword
        };

        await authApi.updateProfile(payload);
        
        alert("Cập nhật thông tin thành công!");
        document.getElementById("profileModal").style.display = "none";
        
        // Cập nhật lại localStorage userInfo để Header bên ngoài cũng đổi tên theo
        let currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
        currentUser.name = full_name;
        localStorage.setItem('userInfo', JSON.stringify(currentUser));
        
        // Reload lại trang hoặc gọi lại checkLoginStatus() để cập nhật Header
        window.location.reload();

    } catch (error) {
        console.error(error);
        const msg = error.response?.data?.message || "Lỗi cập nhật profile";
        alert(msg);
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
    // --- XỬ LÝ ĐĂNG NHẬP (Giữ nguyên) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const res = await authApi.login({ email, password });
                
                // Lưu Token và Thông tin User
                localStorage.setItem('accessToken', res.token);
                localStorage.setItem('userInfo', JSON.stringify(res.userInfo));
                
                alert("Đăng nhập thành công!");

                // --- ĐIỀU HƯỚNG DỰA TRÊN ROLE ---
                const role = res.userInfo.role; // Lấy role từ thông tin trả về
                
                if (role === 'ADMIN' || role === 'STAFF') {
                    // Nếu là Admin/Staff thì nhảy qua trang quản lý sách
                    window.location.href = '../AdminPanel/book.html'; 
                } else {
                    // Nếu là USER thì load lại trang hiện tại (Trang chủ)
                    window.location.reload(); 
                }

            } catch (err) {
                console.error(err);
                const msg = err.response?.data?.message || "Đăng nhập thất bại!";
                alert(msg);
            }
        };
    }

    // --- XỬ LÝ ĐĂNG KÝ (Bổ sung phần này) ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            
            // Lấy các ô input theo thứ tự trong HTML
            const inputs = registerForm.querySelectorAll('input');
            const name = inputs[0].value;
            const email = inputs[1].value;
            const password = inputs[2].value;
            const confirmPass = inputs[3].value;
            const phone = inputs[4].value;

            // Validate cơ bản
            if (password.length < 6) {
                alert("Mật khẩu phải có ít nhất 6 ký tự!");
                return;
            }
            if (password !== confirmPass) {
                alert("Mật khẩu nhập lại không khớp!");
                return;
            }

            try {
                // Gọi API Đăng ký
                await authApi.register({ name, email, password, phone });
                alert("Đăng ký thành công! Vui lòng đăng nhập.");

                // Tự động chuyển sang form đăng nhập
                document.getElementById('registerModal').style.display = 'none';
                document.getElementById('loginModal').style.display = 'block';
                
                // Reset form đăng ký
                registerForm.reset();
            } catch (err) {
                console.error(err);
                const msg = err.response?.data?.message || "Đăng ký thất bại (Email có thể đã tồn tại)!";
                alert(msg);
            }
        };
    }
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