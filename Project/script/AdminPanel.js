/*-----------------------------------------------------------FUNCTION BUTTON SWITCH-----------------------------------------------------------*/
const function_btns = document.querySelectorAll('.function');

    function_btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Xóa class active khỏi tất cả nút
            function_btns.forEach(b => b.classList.remove('active'));
            function_btns.forEach(b => b.classList.add('off'));

            // Gán class active cho nút được click
            btn.classList.remove('off');
            btn.classList.add('active');
        });
    });

/*-----------------------------------------------------------ADD/EDIT BUTTON SWITCH-----------------------------------------------------------*/
const add_btn = document.querySelector(".add-button");
const save_btn = document.querySelector(".add-save");
const cancel_btn = document.querySelector(".cancel-button");
const edit_btns = document.querySelectorAll(".edit-btn");
const form_title = document.querySelector(".form-title");
const delete_btn = document.querySelector(".delete");
const inputs = document.querySelectorAll(".add-book-site input");

const add_book_site = document.querySelector('.add-book-site');
const galery_space = document.querySelector('.galery-space');

function toggleView(isShowForm) {
    if (isShowForm) {
        add_book_site.style.display = "flex";
        galery_space.style.display = "none";
        
        add_btn.style.display = "none";
        cancel_btn.style.display = "inline-block"; 
    } else {
        add_book_site.style.display = "none";
        galery_space.style.display = "grid"; 
        
        add_btn.style.display = "inline-block";
        cancel_btn.style.display = "none";
    }
}


add_btn.addEventListener('click', function() {
    inputs.forEach(input => input.value = "");
    form_title.innerText = "Thêm sách";
    delete_btn.style.display = "none";

    toggleView(true);
});

cancel_btn.addEventListener('click', () => toggleView(false));

save_btn.addEventListener('click', () => {
    // Xử lý lưu dữ liệu ở đây nếu cần
    toggleView(false); // Quay về trang chủ sau khi lưu
});

edit_btns.forEach(btn => {
    btn.addEventListener('click', function(event) {
        /*
        const bookItem = event.target.closset('.book');
        const name = bookItem.querySelector(".book-name").innerText;
        const author = bookItem.querySelector(".book-author").innerText;
        */
        form_title.innerText = "Sửa sách";
        delete_btn.style.display = "inline-block";
        toggleView(true);
    });
});