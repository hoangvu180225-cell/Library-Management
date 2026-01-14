/* =========================================
   SCRIPT QUẢN LÝ TỦ SÁCH CÁ NHÂN
   (Kết nối dữ liệu từ Database thông qua bookApi)
   ========================================= */

import bookApi from '../api/bookAPI.js'; 

document.addEventListener('DOMContentLoaded', () => {
    initMyLibrary();
    setupFilterTabs();
});

async function initMyLibrary() {
    // Mặc định hiển thị tất cả sách trong tủ (Borrow + Buy)
    await loadAndRenderBooks('ALL');
}

// --- HÀM LOAD VÀ RENDER TỪ DATABASE ---
async function loadAndRenderBooks(filterStatus) {
    const container = document.getElementById('my-book-container');
    if (!container) return;

    container.innerHTML = '<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>';

    try {
        /**
         * Gọi API lấy danh sách giao dịch của User
         * FilterStatus: 'ALL', 'BORROWING', 'RETURNED', 'COMPLETED' (Mua), 'OVERDUE'
         */
        const response = await bookApi.getAll({ status: filterStatus });
        const transactions = response.data; 

        container.innerHTML = ''; 

        if (!transactions || transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 50px; color: #64748b;">
                    <i class="fa-solid fa-box-open" style="font-size: 80px; margin-bottom: 20px; color: #cbd5e1;"></i>
                    <p style="font-size: 1.1rem; margin-bottom: 20px;">Tủ sách của bạn đang trống.</p>
                    <a href="HomePage.html" class="btn btn-primary" style="text-decoration: none; padding: 10px 20px; border-radius: 5px;">
                        <i class="fa-solid fa-magnifying-glass"></i> Khám phá ngay
                    </a>
                </div>`;
            return;
        }

        // Render từng item dựa trên dữ liệu từ bảng Transactions join với Books
        transactions.forEach(trans => {
            const html = createBookItemHTML(trans); 
            container.insertAdjacentHTML('beforeend', html);
        });

    } catch (error) {
        showError("Không thể lấy dữ liệu từ máy chủ. Vui lòng kiểm tra kết nối.");
        console.error("API Error:", error);
    }
}

// --- HÀM TẠO HTML (Khớp với Schema Database) ---
function createBookItemHTML(trans) {
    // trans bao gồm thông tin từ bảng Transactions và Books (join)
    const book = trans.bookInfo; // Giả định backend trả về object bookInfo lồng bên trong
    let statusLabel = '', statusClass = '', dateInfo = '', actionBtn = '';

    // Format ngày tháng từ database
    const startDate = new Date(trans.start_date).toLocaleDateString('vi-VN');
    const dueDate = trans.due_date ? new Date(trans.due_date).toLocaleDateString('vi-VN') : '';

    // Logic hiển thị dựa trên status trong bảng Transactions
    switch (trans.status) {
        case 'BORROWING':
            statusClass = 'status-borrowing';
            statusLabel = 'Đang mượn';
            dateInfo = `
                <p><i class="fa-regular fa-calendar"></i> Ngày mượn: ${startDate}</p>
                <p class="due-date"><i class="fa-solid fa-clock"></i> Hạn trả: ${dueDate}</p>`;
            actionBtn = `<button class="btn-action return" onclick="handleReturn('${trans.trans_id}')">Trả sách</button>`;
            break;

        case 'RETURNED':
            statusClass = 'status-returned';
            statusLabel = 'Đã trả';
            dateInfo = `<p><i class="fa-solid fa-circle-check"></i> Đã trả vào: ${new Date(trans.return_date).toLocaleDateString('vi-VN')}</p>`;
            break;

        case 'OVERDUE':
            statusClass = 'status-overdue';
            statusLabel = 'Quá hạn';
            dateInfo = `
                <p style="color:red"><i class="fa-solid fa-triangle-exclamation"></i> Hạn trả: ${dueDate}</p>
                <p class="penalty">Vui lòng hoàn trả sớm!</p>`;
            actionBtn = `<button class="btn-action urgent" onclick="handleReturn('${trans.trans_id}')">Trả ngay</button>`;
            break;

        case 'COMPLETED': // Đối với sách mua
            statusClass = 'status-bought';
            statusLabel = 'Sở hữu';
            dateInfo = `<p><i class="fa-solid fa-bag-shopping"></i> Ngày mua: ${startDate}</p>`;
            actionBtn = `<button class="btn-action read" onclick="location.href='reader.html?id=${trans.book_id}'">Đọc sách</button>`;
            break;
    }

    return `
        <div class="my-book-item" id="trans-item-${trans.trans_id}">
            <div class="book-cover">
                <img src="${book.image}" alt="${book.title}" onerror="this.src='../../images/default-cover.jpg'">
                <span class="status-badge ${statusClass}">${statusLabel}</span>
            </div>
            <div class="item-info">
                <h3>${book.title}</h3>
                <p class="author">Tác giả: ${book.author}</p>
                <div class="item-meta">${dateInfo}</div>
                <div class="item-footer">
                    <p class="isbn text-muted">ISBN: ${book.isbn}</p>
                    <div class="action-group">
                        ${actionBtn}
                        <button class="btn-icon-remove" title="Xóa" onclick="handleDeleteTransaction('${trans.trans_id}')">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- XỬ LÝ TABS (Lọc theo Status Database) ---
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', async function() {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) activeTab.classList.remove('active');
            this.classList.add('active');
            
            const status = this.getAttribute('data-status'); // ALL, BORROWING, COMPLETED...
            await loadAndRenderBooks(status);
        });
    });
}

// --- GỌI API THAY ĐỔI DỮ LIỆU ---

// Xử lý trả sách (Cập nhật status transaction thành 'RETURNED')
window.handleReturn = async (transId) => {
    if(confirm('Bạn xác nhận trả cuốn sách này?')) {
        try {
            await bookApi.updateStatus(transId, { status: 'RETURNED', return_date: new Date() });
            alert("Đã ghi nhận yêu cầu trả sách.");
            initMyLibrary(); // Load lại danh sách
        } catch (error) {
            alert("Không thể thực hiện yêu cầu trả sách.");
        }
    }
};

// Xử lý xóa lịch sử giao dịch
window.handleDeleteTransaction = async (transId) => {
    if(confirm('Bạn muốn xóa bản ghi này khỏi tủ sách?')) {
        try {
            await bookApi.deleteTransaction(transId);
            const item = document.getElementById(`trans-item-${transId}`);
            item.style.transform = 'translateX(50px)';
            item.style.opacity = '0';
            setTimeout(() => item.remove(), 300);
        } catch (error) {
            alert("Lỗi: Không thể xóa.");
        }
    }
};

function showError(msg) {
    const container = document.getElementById('my-book-container');
    if(container) container.innerHTML = `<div class="error-msg">${msg}</div>`;
}