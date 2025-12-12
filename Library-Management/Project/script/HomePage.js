document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. XỬ LÝ MODAL LOGIN ---
    const loginBtn = document.getElementById('Login-Btn');
    const modal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close-modal');

    // Mở Modal
    if(loginBtn) {
        loginBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    // Đóng Modal khi bấm nút X
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Đóng Modal khi bấm ra ngoài vùng trắng
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // --- 2. XỬ LÝ NÚT DANH MỤC ---
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Xóa class active ở nút cũ
            document.querySelector('.cat-btn.active').classList.remove('active');
            // Thêm class active vào nút được click
            this.classList.add('active');
        });
    });

    // --- 3. HIỆU ỨNG XÓA SÁCH (DEMO) ---
    const deleteBtns = document.querySelectorAll('.icon-btn.delete');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if(confirm("Bạn có chắc muốn xóa sách này khỏi thư viện?")) {
                const bookCard = this.closest('.book-card');
                bookCard.style.opacity = '0';
                bookCard.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    bookCard.remove();
                }, 300);
            }
        });
    });

    // --- 4. XỬ LÝ LOGIN FORM (DEMO) ---
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Đăng nhập thành công! (Đây là giao diện Demo)");
            modal.style.display = 'none';
            
            // Giả lập chuyển đổi giao diện sau khi login
            document.querySelector('.header-right.guest').style.display = 'none';
            document.querySelector('.header-right.user').style.display = 'flex';
        });
    }
});