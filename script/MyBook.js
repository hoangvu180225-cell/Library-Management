/* =========================================
   SCRIPT QUẢN LÝ GIAO DIỆN TỦ SÁCH 
   (Sử dụng API từ bookApi)
   ========================================= */

// Import service (đảm bảo đường dẫn đúng với file bookApi bạn đã tạo)
import bookApi from '../api/bookAPI'; 

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo ban đầu với tab 'all'
    initMyLibrary();
    setupFilterTabs();
});

// Hàm khởi tạo chính
async function initMyLibrary() {
    // Mặc định ban đầu hiển thị tất cả
    await loadAndRenderBooks('all');
}

// --- HÀM LOAD VÀ RENDER TỪ API ---
async function loadAndRenderBooks(filterStatus) {
    const container = document.getElementById('my-book-container');
    if (!container) return;

    // Hiển thị trạng thái đang tải
    container.innerHTML = '<p style="text-align:center; margin-top:20px;">Đang tải dữ liệu...</p>';

    try {
        /**
         * Giả định: 
         * Endpoint getAll() sẽ trả về danh sách sách của cá nhân người dùng đó.
         * Nếu API yêu cầu truyền filter, ta truyền vào params.
         */
        const response = await bookApi.getAll({ status: filterStatus });
        const myCollection = response.data; // Giả định server trả về array sách

        container.innerHTML = ''; 

        if (!myCollection || myCollection.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#64748b; margin-top:30px;">Danh sách trống.</p>`;
            return;
        }

        // Render dữ liệu nhận được
        myCollection.forEach(userBook => {
            // Với API chuẩn, thường server sẽ join sẵn thông tin sách vào collection
            const html = createBookItemHTML(userBook); 
            container.insertAdjacentHTML('beforeend', html);
        });

    } catch (error) {
        showError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        console.error("API Error:", error);
    }
}

// --- HÀM TẠO HTML (Dữ liệu từ API) ---
function createBookItemHTML(userBook) {
    // Giả định API trả về object lồng nhau: { status: '...', bookInfo: { title: '...', image: '...' } }
    const info = userBook.bookInfo;
    let statusLabel = '', statusClass = '', dateInfo = '', actionBtn = '';

    switch (userBook.status) {
        case 'borrowed':
            statusClass = 'borrowed';
            statusLabel = 'Đang mượn';
            dateInfo = `<p><i class="fa-regular fa-calendar"></i> Mượn: ${userBook.dateAdded}</p>
                        <p class="due-date"><i class="fa-solid fa-triangle-exclamation"></i> Hạn: ${userBook.dueDate}</p>`;
            break;

        case 'bought':
            statusClass = 'bought';
            statusLabel = 'Đã mua';
            dateInfo = `<p><i class="fa-solid fa-bag-shopping"></i> Mua: ${userBook.dateAdded}</p>`;
            break;

        case 'wishlist':
            statusClass = 'wishlist';
            statusLabel = 'Quan tâm';
            dateInfo = `<p><i class="fa-regular fa-clock"></i> Lưu: ${userBook.dateAdded}</p>`;
            // Gọi các hàm xử lý mới bằng ID thay vì Title để chính xác
            actionBtn = `
                <button class="btn-action read" onclick="handleBorrow('${info.id}', '${info.title}')">Mượn sách</button>
                <button class="btn-action bought" onclick="handleBuy('${info.id}', '${info.title}')">Mua sách</button>
                <button class="btn-action remove" onclick="handleDelete('${userBook.id}')">Xóa</button>
            `;
            break;
    }

    return `
        <div class="my-book-item" id="book-item-${userBook.id}">
            <img src="${info.image}" alt="${info.title}" onerror="this.src='../../images/default.jpg'">
            <div class="item-info">
                <h3>${info.title}</h3>
                <p class="author">${info.author}</p>
                <div class="item-meta">${dateInfo}</div>
            </div>
            <div class="item-actions">
                <span class="status-badge ${statusClass}">${statusLabel}</span>
                ${actionBtn}
            </div>
        </div>
    `;
}

// --- XỬ LÝ SỰ KIỆN TABS ---
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', async function() {
            document.querySelector('.tab-btn.active')?.classList.remove('active');
            this.classList.add('active');
            
            const status = this.getAttribute('data-status');
            await loadAndRenderBooks(status);
        });
    });
}

// --- CÁC HÀM GỌI API THAY ĐỔI DỮ LIỆU ---

// Xử lý mượn sách
window.handleBorrow = async (id, title) => {
    try {
        // Giả sử API tạo phiếu mượn là một endpoint POST
        await bookApi.create({ bookId: id, type: 'borrow' });
        alert(`Đã gửi yêu cầu mượn: ${title}.`);
    } catch (error) {
        alert("Lỗi: Không thể thực hiện yêu cầu mượn.");
    }
};

// Xử lý xóa khỏi danh sách (Dùng endpoint DELETE)
window.handleDelete = async (userBookId) => {
    if(confirm('Xóa sách này khỏi danh sách quan tâm?')) {
        try {
            await bookApi.delete(userBookId);
            const item = document.getElementById(`book-item-${userBookId}`);
            item.style.opacity = '0';
            setTimeout(() => item.remove(), 300);
        } catch (error) {
            alert("Lỗi: Không thể xóa sách.");
        }
    }
};

function showError(msg) {
    const container = document.getElementById('my-book-container');
    if(container) container.innerHTML = `<p style="color:red; text-align:center; margin-top:20px;">${msg}</p>`;
}