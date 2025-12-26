/* =========================================
   SCRIPT QUẢN LÝ TRANG CHỦ (HOMEPAGE) - FILTER UPDATE
   ========================================= */

// --- CẤU HÌNH ---
const ITEMS_PER_PAGE = 6; // Số sách hiển thị trên 1 trang
let currentPage = 1;      // Trang hiện tại
let currentCategory = 'Tất cả'; // Danh mục đang chọn (Mặc định lấy tất cả)

/* =========================================
   1. KHỞI TẠO (ENTRY POINT)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    setupModalLogin();
    setupCategoryTabs();
    setupLoginForm();

    // Kiểm tra dữ liệu và render
    if (typeof books !== 'undefined' && Array.isArray(books)) {
        // 1. Load trang đầu tiên
        loadPage(1);

        // 2. Render bảng xếp hạng (Luôn dùng toàn bộ sách, không phụ thuộc bộ lọc)
        renderRanking(books);
    } else {
        console.error("LỖI: Không tìm thấy dữ liệu 'books'.");
        const container = document.getElementById('book-list-container');
        if(container) container.innerHTML = '<p style="text-align:center; color:red;">Lỗi dữ liệu!</p>';
    }
});

/* =========================================
   2. LOGIC LỌC, PHÂN TRANG & RENDER
   ========================================= */

// Hàm trung tâm: Lọc sách -> Phân trang -> Render
function loadPage(page) {
    currentPage = page;
    
    // BƯỚC 1: LỌC SÁCH THEO DANH MỤC
    // Nếu chọn 'Tất cả' thì lấy full mảng, ngược lại filter theo genre
    const filteredBooks = (currentCategory === 'Tất cả') 
        ? books 
        : books.filter(book => book.genre === currentCategory);

    // BƯỚC 2: TÍNH TOÁN PHÂN TRANG TRÊN DANH SÁCH ĐÃ LỌC
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    
    // Cắt mảng sách cho trang hiện tại
    const displayBooks = filteredBooks.slice(start, end);
    
    // BƯỚC 3: RENDER
    renderBooks(displayBooks);
    // Truyền vào độ dài của danh sách ĐÃ LỌC để tính số trang
    renderPagination(filteredBooks.length, page);
}

// Render HTML từng thẻ sách
function renderBooks(bookList) {
    const container = document.getElementById('book-list-container');
    if (!container) return;
    
    container.innerHTML = ''; // Xóa nội dung cũ

    if(bookList.length === 0) {
        container.innerHTML = `<p style="text-align:center; width:100%; color:#64748b; margin-top:40px;">
            Không tìm thấy sách nào thuộc mục "<strong>${currentCategory}</strong>".
        </p>`;
        return;
    }

    bookList.forEach(book => {
        let stockBadge = book.stock > 0 
            ? `<span class="badge in-stock">Còn ${book.stock}</span>` 
            : `<span class="badge out-stock">Hết hàng</span>`;

        const bookHTML = `
            <div class="book-card">
                <div class="book-thumb">
                    ${stockBadge}
                    <img src="${book.image}" alt="${book.title}" loading="lazy">
                </div>
                <div class="book-details">
                    <h3 class="book-title" title="${book.title}">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-meta">
                        <span class="genre">${book.genre}</span>
                        <span class="rating"><i class="fa-solid fa-star"></i> ${book.rating}</span>
                    </div>
                    <p class="book-desc">${book.desc}</p>
                </div>
                <div class="book-actions">
                    <button class="btn-text" onclick="viewDetails('${book.id}')">Xem chi tiết</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', bookHTML);
    });
}

// Render các nút phân trang
function renderPagination(totalItems, activePage) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = ''; 
    
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Nếu không có trang nào hoặc chỉ 1 trang thì ẩn phân trang
    if (totalPages <= 1) return;

    // Nút Previous
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevBtn.className = 'page-btn';
    prevBtn.disabled = activePage === 1;
    prevBtn.onclick = () => loadPage(activePage - 1);
    paginationContainer.appendChild(prevBtn);

    // Các nút số
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `page-btn ${i === activePage ? 'active' : ''}`;
        btn.onclick = () => loadPage(i);
        paginationContainer.appendChild(btn);
    }

    // Nút Next
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextBtn.className = 'page-btn';
    nextBtn.disabled = activePage === totalPages;
    nextBtn.onclick = () => loadPage(activePage + 1);
    paginationContainer.appendChild(nextBtn);
}

/* =========================================
   3. LOGIC BẢNG XẾP HẠNG (GIỮ NGUYÊN)
   ========================================= */
function renderRanking(bookList) {
    const container = document.getElementById('rank-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    const sortedBooks = [...bookList].sort((a, b) => (b.views || 0) - (a.views || 0));
    const topBooks = sortedBooks.slice(0, 5); 

    topBooks.forEach((book, index) => {
        const rank = index + 1;
        let rankClass = '';
        if (rank === 1) rankClass = 'top-1';
        else if (rank === 2) rankClass = 'top-2';
        else if (rank === 3) rankClass = 'top-3';

        const viewDisplay = (book.views || 0).toLocaleString();

        const html = `
            <div class="rank-item">
                <div class="rank-num ${rankClass}">${rank}</div>
                <img src="${book.image}" alt="${book.title}" onclick="viewDetails('${book.id}')" style="cursor:pointer">
                <div class="rank-info">
                    <h4 style="cursor: pointer;" class="btn-text" onclick="viewDetails('${book.id}')">
                        ${book.title}
                    </h4>
                    <span class="views">${viewDisplay} lượt mượn</span>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

/* =========================================
   4. UTILS & EVENTS
   ========================================= */

function viewDetails(id) {
    window.location.href = `BookDetail.html?id=${id}`;
}

function setupCategoryTabs() {
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 1. Xử lý UI active
            document.querySelector('.cat-btn.active')?.classList.remove('active');
            this.classList.add('active');
            
            // 2. Lấy tên danh mục từ nút bấm
            // .trim() để xóa khoảng trắng thừa nếu có
            currentCategory = this.innerText.trim();
            
            console.log("Đang lọc theo:", currentCategory);
            
            // 3. Reset về trang 1 và load lại sách
            loadPage(1);
        });
    });

    // Phần Rank Time (Chưa có logic filter rank, chỉ làm UI)
    const rankTime = document.querySelectorAll('.ranktime');
    rankTime.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.ranktime.active')?.classList.remove('active');
            this.classList.add('active');
        });
    });
}

function setupModalLogin() {
    const loginBtn = document.getElementById('Login-Btn');
    const modal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close-modal');

    if (loginBtn && modal) loginBtn.addEventListener('click', () => modal.style.display = 'block');
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });
}

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const modal = document.getElementById('loginModal');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Đăng nhập thành công! (Phiên bản Demo)");
            if (modal) modal.style.display = 'none';
            const guestNav = document.querySelector('.header-right.guest');
            const userNav = document.querySelector('.header-right.user');
            if (guestNav) guestNav.style.display = 'none';
            if (userNav) userNav.style.display = 'flex';
        });
    }
}