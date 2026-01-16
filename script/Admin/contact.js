/* =========================================
   SCRIPT QUẢN LÝ LIÊN HỆ (ADMIN) - UPDATED
   ========================================= */
import contactApi from '../../api/contactAPI.js';
import { setupAdminProfile } from './dropdown.js'; // Nhớ check đúng tên file này

let globalContacts = [];
let currentReplyId = null;

// 1. KHỞI TẠO
document.addEventListener('DOMContentLoaded', () => {
    setupAdminProfile(); 
    fetchContacts();     
    setupModalLogic();   
});

// 2. TẢI DỮ LIỆU TỪ SERVER
async function fetchContacts() {
    try {
        const data = await contactApi.getAll();
        globalContacts = Array.isArray(data) ? data : (data.data || []);
        renderContacts(globalContacts);
    } catch (error) {
        console.error("Lỗi tải danh sách liên hệ:", error);
        // alert("Không thể tải danh sách tin nhắn.");
    }
}

// 3. RENDER DỮ LIỆU RA BẢNG HTML (ĐÃ SỬA LOGIC NÚT BẤM)
function renderContacts(list) {
    const tbody = document.getElementById('contactListBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: #888;">Hộp thư trống</td></tr>`;
        return;
    }

    list.forEach(item => {
        const isReplied = item.status === 'REPLIED';
        const badgeClass = isReplied ? 'badge-replied' : 'badge-pending';
        const statusText = isReplied ? 'Đã phản hồi' : 'Chờ xử lý';
        
        const dateStr = new Date(item.created_at).toLocaleDateString('vi-VN', { 
            year: 'numeric', month: '2-digit', day: '2-digit', 
            hour: '2-digit', minute: '2-digit' 
        });

        // --- LOGIC ẨN/HIỆN NÚT BẤM THEO YÊU CẦU ---
        let actionButtons = '';
        
        if (isReplied) {
            // Nếu ĐÃ PHẢN HỒI -> Chỉ hiện nút XÓA (Bỏ mũi tên reply)
            actionButtons = `
                <button class="action-btn btn-delete" onclick="deleteContact(${item.contact_id})" title="Xóa tin nhắn">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        } else {
            // Nếu CHỜ XỬ LÝ -> Chỉ hiện nút TRẢ LỜI (Bỏ thùng rác)
            actionButtons = `
                <button class="action-btn btn-edit" onclick="openReplyModal(${item.contact_id})" title="Trả lời ngay">
                    <i class="fas fa-reply"></i>
                </button>
            `;
        }

        const html = `
            <tr>
                <td>
                    <div class="sender-info">
                        <span class="sender-name">${item.full_name}</span>
                        <span class="sender-email">${item.email}</span>
                    </div>
                </td>
                <td>
                    <div class="message-preview" title="${item.message}">
                        ${item.message}
                    </div>
                </td>
                <td>
                    <span class="contact-badge ${badgeClass}">${statusText}</span>
                </td>
                <td style="font-size: 0.9rem; color: #666;">${dateStr}</td>
                <td style="text-align:center;">
                    ${actionButtons}
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', html);
    });
}

// 4. XỬ LÝ LOGIC MODAL
function setupModalLogic() {
    const modal = document.getElementById('replyModal');
    const closeBtns = document.querySelectorAll('.btn-close-modal, .btn-secondary'); 
    const sendBtn = document.getElementById('btnSendReply');

    const closeModal = () => {
        if (modal) modal.classList.remove('active');
        document.getElementById('replyContent').value = ''; 
    };
    
    closeBtns.forEach(btn => btn.onclick = closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (sendBtn) {
        sendBtn.onclick = async () => {
            const replyText = document.getElementById('replyContent').value;
            
            if (!replyText.trim()) {
                alert("Vui lòng nhập nội dung phản hồi!");
                return;
            }

            // Hiển thị trạng thái đang gửi (để user không bấm liên tục)
            const originalText = sendBtn.innerText;
            sendBtn.innerText = "Đang gửi mail...";
            sendBtn.disabled = true;

            try {
                await contactApi.reply(currentReplyId, replyText);
                
                alert("Đã gửi email phản hồi thành công!");
                closeModal();
                fetchContacts(); 
            } catch (error) {
                console.error(error);
                alert("Lỗi: " + (error.response?.data?.message || error.message));
            } finally {
                // Trả lại trạng thái nút
                sendBtn.innerText = originalText;
                sendBtn.disabled = false;
            }
        };
    }
}

// 5. GLOBAL FUNCTIONS
window.openReplyModal = (id) => {
    const contact = globalContacts.find(c => c.contact_id === id);
    if (!contact) return;

    currentReplyId = id; 
    document.getElementById('replyToEmail').value = contact.email;
    document.getElementById('originalMessage').textContent = contact.message;
    document.getElementById('replyContent').value = contact.reply_text || ''; 
    
    const modal = document.getElementById('replyModal');
    if (modal) modal.classList.add('active');
};

window.deleteContact = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin nhắn này không?")) return;
    
    try {
        await contactApi.delete(id);
        alert("Đã xóa tin nhắn.");
        fetchContacts(); 
    } catch (error) {
        alert("Lỗi xóa: " + (error.response?.data?.message || error.message));
    }
};