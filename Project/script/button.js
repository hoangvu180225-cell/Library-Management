// Chọn đúng các div theo class
const guest = document.querySelector(".header-right.guest");
const user  = document.querySelector(".header-right.user");

// Chọn các nút
const btnLogin    = document.getElementById("Login-Btn");
const btnRegister = document.getElementById("Register-Btn");
const btnLogout = document.getElementById("Logout-Btn");

// Khi bấm Đăng nhập hoặc Đăng ký → chuyển giao diện
btnLogin.addEventListener("click", switchToUser);
btnRegister.addEventListener("click", switchToUser);
btnLogout.addEventListener("click", switchToGuest);

function switchToUser() {
    guest.style.display = "none";
    user.style.display = "flex";

    // Lưu trạng thái để reload trang vẫn giữ giao diện user
    localStorage.setItem("isLogin", "true");
}

localStorage.setItem("isLogin", "false");

function switchToGuest() {
    guest.style.display = "flex";
    user.style.display = "none";

    localStorage.setItem("isLogin", "false");
}

if(localStorage.getItem("isLogin") === "true") {
    guest.style.display = "none";
    user.style.display  = "flex";
} else {
    guest.style.display = "flex";
    user.style.display  = "none";
}

const category_btns = document.querySelectorAll('.category-btn');

category_btns.forEach(btn => {
    btn.addEventListener('click', function() {
        
        // Lệnh này sẽ tự động dừng lại nếu querySelector trả về null (rất an toàn)
        document.querySelector('.category-btn.active')?.classList.remove('active');
        
        // Bật trạng thái sáng cho nút vừa click
        this.classList.add('active');
    });
});

