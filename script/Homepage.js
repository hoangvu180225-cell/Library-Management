/* =========================================
   SCRIPT: Homepage.js
   Mục đích: Xử lý Trang Chủ (Load sách, Tìm kiếm, Phân trang, Xếp hạng)
   ========================================= */
import bookApi from '../api/bookAPI.js'; 
import { initSharedUI } from './ShareUI.js'; // Chú ý: tên file SharedUI phải đúng chính tả

// --- CẤU HÌNH ---
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let currentCategory = 'Tất cả';
let globalBookList = [];

const CATEGORY_MAP = {
    1: 'Hành động',
    2: 'Khoa học viễn tưởng',
    3: 'Lãng mạn',
    4: 'Lịch sử',
    5: 'Tiểu thuyết',
    6: 'Thiếu nhi',
    7: 'Trinh thám'
};

/* =========================================
   1. ENTRY POINT
   ========================================= */
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1.1 Khởi tạo Header/Footer/Modal
    initSharedUI(); 

    // 1.2 Setup Logic Tìm kiếm (MỚI THÊM)
    setupSearchLogic();

    // 1.3 Logic Trang chủ
    const bookContainer = document.getElementById('book-list-container');
    if (bookContainer) {
        setupCategoryTabs();
        await fetchAndRenderBooks(); // Gọi lần đầu (không có keyword)
    }
});

/* =========================================
   2. LOGIC TÌM KIẾM (MỚI)
   ========================================= */
function setupSearchLogic() {
    // Vì SharedUI bơm HTML vào, ta cần query các phần tử sau khi initSharedUI chạy
    const searchInput = document.querySelector('.search-box input');
    const searchIcon = document.querySelector('.search-box .search-icon');

    if (!searchInput) return;

    // Hàm xử lý tìm kiếm
    const handleSearch = () => {
        const keyword = searchInput.value.trim();
        // Gọi hàm load sách với từ khóa
        fetchAndRenderBooks(keyword);
        
        // Reset tab danh mục về "Tất cả" để không bị lẫn lộn
        currentCategory = 'Tất cả';
        document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.cat-btn:first-child')?.classList.add('active');
        
        // Cuộn xuống phần danh sách sách cho người dùng thấy kết quả
        const container = document.getElementById('book-list-container');
        if(container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // 1. Bắt sự kiện nhấn Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // 2. Bắt sự kiện click icon kính lúp
    if (searchIcon) {
        searchIcon.style.cursor = 'pointer'; // Thêm con trỏ tay cho đẹp
        searchIcon.addEventListener('click', handleSearch);
    }
}

/* =========================================
   3. LOGIC TƯƠNG TÁC API & DỮ LIỆU
   ========================================= */
// SỬA: Thêm tham số keyword (mặc định là rỗng)
async function fetchAndRenderBooks(keyword = '') {
    try {
        // Tạo params gửi đi
        const params = keyword ? { keyword: keyword } : {};

        // Gọi API với params
        const response = await bookApi.getAll(params); 
        
        globalBookList = Array.isArray(response) ? response : (response.data || []);

        if (globalBookList.length === 0) {
            let msg = keyword 
                ? `Không tìm thấy sách nào với từ khóa "<strong>${keyword}</strong>".`
                : `Chưa có dữ liệu sách.`;
            
            document.getElementById('book-list-container').innerHTML = 
                `<p style="text-align:center; color:#64748b; margin-top: 20px;">${msg}</p>`;
            
            // Ẩn phân trang nếu không có dữ liệu
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        // Render trang đầu tiên
        loadPage(1);
        
        // Nếu là lần load đầu (không tìm kiếm), thì mới render ranking để tối ưu
        if (!keyword) {
            renderRanking(globalBookList, 'reading');
        }

    } catch (error) {
        console.error("Lỗi lấy dữ liệu sách:", error);
        const container = document.getElementById('book-list-container');
        if(container) {
            container.innerHTML = `<p style="text-align:center; color:red;">Lỗi kết nối Server.</p>`;
        }
    }
}

/* =========================================
   4. LOGIC HIỂN THỊ (GIỮ NGUYÊN CODE CŨ)
   ========================================= */
function loadPage(page) {
    currentPage = page;
    
    const filteredBooks = (currentCategory === 'Tất cả') 
        ? globalBookList 
        : globalBookList.filter(book => {
            const catName = CATEGORY_MAP[book.category_id]; 
            return catName === currentCategory;
        });

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const displayBooks = filteredBooks.slice(start, end);
    
    renderBooks(displayBooks);
    renderPagination(filteredBooks.length, page);
}

function renderBooks(bookList) {
    const container = document.getElementById('book-list-container');
    if (!container) return;
    
    container.innerHTML = '';

    if(bookList.length === 0) {
        container.innerHTML = `<p style="text-align:center; width:100%; color:#64748b; margin-top:30px;">
            Không có sách nào thuộc mục "${currentCategory}".
        </p>`;
        return;
    }

    bookList.forEach(book => {
        let stockBadge = book.stock > 0 
            ? `<span class="badge in-stock">Còn ${book.stock}</span>` 
            : `<span class="badge out-stock">Hết hàng</span>`;
        
        let categoryName = book.genre || CATEGORY_MAP[book.category_id] || 'Khác';
        let rawDesc = book.description || 'Chưa có mô tả.';
        let shortDesc = rawDesc.length > 80 ? rawDesc.substring(0, 80) + '...' : rawDesc;
        let priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price || 0);

        const html = `
            <div class="book-card">
                <div class="book-thumb">
                    ${stockBadge}
                    <img src="${book.image}" alt="${book.title}" loading="lazy">
                </div>
                <div class="book-details">
                    <h3 class="book-title" title="${book.title}">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-meta">
                        <span class="genre">${categoryName}</span>
                        <span class="rating"><i class="fa-solid fa-star"></i> ${book.rating || 5.0}</span>
                    </div>
                    <p class="book-desc" title="${rawDesc}">${shortDesc}</p>
                    <p class="book-price" style="color: #d9534f; font-weight: bold; margin-top: 5px;">
                        ${priceFormatted}
                    </p>
                </div>
                <div class="book-actions">
                    <button class="btn-text" onclick="viewDetails('${book.book_id}')">Xem chi tiết</button>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function renderPagination(totalItems, activePage) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = ''; 
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (totalPages <= 1) return;

    const createBtn = (content, targetPage, isActive = false) => {
        const btn = document.createElement('button');
        btn.innerHTML = content;
        btn.className = `page-btn ${isActive ? 'active' : ''}`;
        btn.onclick = () => loadPage(targetPage);
        return btn;
    };

    paginationContainer.appendChild(createBtn('<i class="fa-solid fa-chevron-left"></i>', activePage > 1 ? activePage - 1 : 1));

    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 10 && (i < activePage - 2 || i > activePage + 2) && i !== 1 && i !== totalPages) continue;
        paginationContainer.appendChild(createBtn(i, i, i === activePage));
    }

    paginationContainer.appendChild(createBtn('<i class="fa-solid fa-chevron-right"></i>', activePage < totalPages ? activePage + 1 : totalPages));
}

function setupCategoryTabs() {
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.cat-btn.active')?.classList.remove('active');
            this.classList.add('active');
            currentCategory = this.innerText.trim();
            loadPage(1); 
        });
    });
    
    const rankTimeBtns = document.querySelectorAll('.ranktime');
    rankTimeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.ranktime.active')?.classList.remove('active');
            this.classList.add('active');
            const type = this.innerText.trim();
            if (type === "Top Reading") renderRanking(globalBookList, 'reading');
            else if (type === "Trending") renderRanking(globalBookList, 'trending');
        });
    });
}

function renderRanking(bookList, criteria = 'reading') {
    const container = document.getElementById('rank-list-container');
    if (!container) return;
    container.innerHTML = '';
    let sortedBooks = [...bookList];

    if (criteria === 'reading') sortedBooks.sort((a, b) => (b.borrow_count || 0) - (a.borrow_count || 0));
    else sortedBooks.sort((a, b) => (b.views || 0) - (a.views || 0));

    const topBooks = sortedBooks.slice(0, 5);

    topBooks.forEach((book, index) => {
        const statsLabel = criteria === 'reading' 
            ? `${(book.borrow_count || 0).toLocaleString()} lượt mượn`
            : `${(book.views || 0).toLocaleString()} lượt xem`;

        const html = `
            <div class="rank-item">
                <div class="rank-num top-${index + 1}">${index + 1}</div>
                <img src="${book.image}" alt="${book.title}" onclick="viewDetails('${book.book_id}')" style="cursor:pointer">
                <div class="rank-info">
                    <h4 class="btn-text" onclick="viewDetails('${book.book_id}')" style="cursor:pointer">${book.title}</h4>
                    <span class="views">${statsLabel}</span>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

window.viewDetails = function(id) {
    window.location.href = `BookDetail.html?id=${id}`;
};