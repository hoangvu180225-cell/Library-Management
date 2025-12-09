// Lấy các phần tử
var modal = document.getElementById("loginModal");
var btn = document.getElementById("openLoginBtn");
var span = document.getElementsByClassName("close")[0];

// Khi người dùng click nút, mở Modal
btn.onclick = function() {
    modal.style.display = "block";
}

// Khi người dùng click vào dấu (x), đóng Modal
span.onclick = function() {
    modal.style.display = "none";
}

// Khi người dùng click bất kỳ đâu bên ngoài Modal, đóng Modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}