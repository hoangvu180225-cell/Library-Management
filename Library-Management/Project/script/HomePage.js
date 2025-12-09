/*-----------------------------------------------------------GENERAL-----------------------------------------------------------*/
const guest = document.querySelector('.header-right.guest');
const user = document.querySelector('.header-right.user');

const Submimt_btn = document.querySelector('.submit-btn');
const Logout_btn = document.getElementById('Logout-Btn');

const modal = document.getElementById("loginModal"); 
const Login_btn = document.getElementById("Login-Btn");
const close = document.querySelector('.close');

const login_form = document.getElementById('login-form');
/*-----------------------------------------------------------LOGIN/LOGOUT SWITCH-----------------------------------------------------------*/
login_form.addEventListener('submit', function(event) {
    event.preventDefault();
    switchToUser();
    mo
})
Logout_btn.addEventListener('click', switchToGuest);

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


/*-----------------------------------------------------------LOGIN MODAL SWITCH-----------------------------------------------------------*/
Login_btn.addEventListener('click', function() {
    modal.style.display = "block";
});

close.addEventListener('click', function() {
    modal.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

/*-----------------------------------------------------------CATEGORY BUTTON SWITCH-----------------------------------------------------------*/

    const category_btns = document.querySelectorAll('.category-btn');

    category_btns.forEach(btn => {
        btn.addEventListener('click', function() {
            
            document.querySelector('.category-btn.active')?.classList.remove('active');
            
            this.classList.add('active');
        });
    });

/*-----------------------------------------------------------BOOKDETAIL SWITCH-----------------------------------------------------------*/

    const img_btn = document.querySelectorAll('.book-img');

    img_btn.forEach(img => {
        img.addEventListener('click', function () {
        window.location.href = "BookDetail.html";
        });
    });

    //-------------------------------------------------------------
    
