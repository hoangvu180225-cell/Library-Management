const category_btns = document.querySelectorAll('.category-btn');

category_btns.forEach(btn => {
    btn.addEventListener('click', function() {
        
        // Lệnh này sẽ tự động dừng lại nếu querySelector trả về null (rất an toàn)
        document.querySelector('.category-btn.active')?.classList.remove('active');
        
        // Bật trạng thái sáng cho nút vừa click
        this.classList.add('active');
    });
});