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
