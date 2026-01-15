import adminApi from '../../api/adminAPI.js'; 

let globalTrans = []; 

document.addEventListener('DOMContentLoaded', () => {
    fetchTransactions();
});

// 1. FETCH API
async function fetchTransactions() {
    try {
        const response = await adminApi.getAllTransactions();
        globalTrans = Array.isArray(response) ? response : (response.data || []);
        renderTable(globalTrans);
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

// 2. RENDER TABLE
function renderTable(list) {
    const tableBody = document.getElementById('transTableBody');
    tableBody.innerHTML = '';

    if (!list || list.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Không có giao dịch nào</td></tr>`;
        return;
    }

    list.forEach(item => {
        // --- LOGIC NÚT BẤM (ACTION BUTTON) ---
        let actionBtnHTML = '';

        if (item.status === 'PENDING') {
            // Case 1: Đơn mới (Chờ duyệt)
            if (item.type === 'BORROW') {
                // Nếu là Mượn -> Nút "Duyệt cho mượn"
                actionBtnHTML = `
                    <button class="btn-confirm btn-borrow" onclick="updateStatus(${item.trans_id}, 'BORROWING')">
                        <i class="fas fa-check"></i> Duyệt mượn
                    </button>`;
            } else {
                // Nếu là Mua -> Nút "Xác nhận giao"
                actionBtnHTML = `
                    <button class="btn-confirm btn-buy" onclick="updateStatus(${item.trans_id}, 'COMPLETED')">
                        <i class="fas fa-shipping-fast"></i> Giao hàng
                    </button>`;
            }
        } 
        else if (item.status === 'BORROWING' || item.status === 'OVERDUE') {
            // Case 2: Đang mượn -> Nút "Đã trả sách"
            actionBtnHTML = `
                <button class="btn-confirm btn-return" onclick="updateStatus(${item.trans_id}, 'RETURNED')">
                    <i class="fas fa-undo"></i> Khách trả sách
                </button>`;
        } 
        else {
            // Case 3: Đã xong -> Không hiện nút hoặc hiện text
            actionBtnHTML = `<span class="text-completed"><i class="fas fa-check-circle"></i> Hoàn tất</span>`;
        }
        
        // Format ngày
        const startDate = new Date(item.start_date).toLocaleDateString('vi-VN');
        const dueDate = item.due_date ? new Date(item.due_date).toLocaleDateString('vi-VN') : '---';

        // Badge loại đơn
        const typeBadge = item.type === 'BORROW' 
            ? `<span class="badge-type type-borrow">MƯỢN</span>` 
            : `<span class="badge-type type-buy">MUA</span>`;

        const rowHTML = `
            <tr>
                <td><b>#${item.trans_id}</b></td>
                <td>
                    <div class="trans-info">
                        <div class="book-title">${item.title}</div>
                        <div class="user-name"><i class="fas fa-user"></i> ${item.full_name}</div>
                        <div class="trans-type">${typeBadge}</div>
                    </div>
                </td>
                <td>
                    <div class="date-info">
                        <div>Tạo: ${startDate}</div>
                        ${item.type === 'BORROW' && item.status !== 'PENDING' ? `<div style="color:#d9534f; font-size:0.8rem;">Hạn: ${dueDate}</div>` : ''}
                    </div>
                </td>
                <td><span class="status-badge st-${item.status.toLowerCase()}">${getStatusLabel(item.status)}</span></td>
                <td>
                    ${actionBtnHTML}
                </td>
                <td style="text-align:center;">
                   ${(item.status === 'RETURNED' || item.status === 'COMPLETED' || item.status === 'CANCELLED') ? 
                     `<i class="fas fa-trash btn-delete-icon" onclick="deleteTrans(${item.trans_id})" title="Xóa lịch sử đơn này"></i>` : ''}
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', rowHTML);
    });
}

// Helper: Dịch status sang tiếng Việt
function getStatusLabel(status) {
    const map = {
        'PENDING': 'Chờ duyệt',
        'BORROWING': 'Đang mượn',
        'OVERDUE': 'Quá hạn',
        'RETURNED': 'Đã trả',
        'COMPLETED': 'Đã giao',
        'CANCELLED': 'Đã hủy'
    };
    return map[status] || status;
}

// 3. XỬ LÝ SỰ KIỆN CLICK (Gửi API Update)
window.updateStatus = async (id, newStatus) => {
    // Xác nhận nhẹ
    let msg = "";
    if (newStatus === 'BORROWING') msg = "Xác nhận cho khách mượn sách này?";
    if (newStatus === 'COMPLETED') msg = "Xác nhận đã giao sách cho khách?";
    if (newStatus === 'RETURNED') msg = "Xác nhận khách đã trả sách?";

    if (!confirm(msg)) return;

    try {
        await adminApi.updateTransaction(id, { status: newStatus });
        // Không alert rườm rà, load lại bảng luôn cho mượt
        fetchTransactions();
    } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
};

window.deleteTrans = async (id) => {
    if(!confirm("Bạn có chắc muốn xóa lịch sử giao dịch này không?")) return;
    try {
        await adminApi.deleteTransaction(id);
        fetchTransactions();
    } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
};