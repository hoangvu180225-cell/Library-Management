const guest = document.querySelector(".header-right.guest");
const user  = document.querySelector(".header-right.user");

const btnLogin    = document.getElementById("Login-Btn");
const btnRegister = document.getElementById("Register-Btn");
const btnLogout = document.getElementById("Logout-Btn");

btnLogin.addEventListener("click", switchToUser);
btnRegister.addEventListener("click", switchToUser);
btnLogout.addEventListener("click", switchToGuest);

function switchToUser() {
    guest.style.display = "none";
    user.style.display = "flex";

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
        
        document.querySelector('.category-btn.active')?.classList.remove('active');
        
        this.classList.add('active');
    });
});

const img_btn = document.querySelectorAll('.book-img');

img_btn.forEach(img => {
    img.addEventListener('click', function () {
    window.location.href = "ChiTietSach.html";
    });
});


