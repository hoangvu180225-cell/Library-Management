/* =========================================
   FILE: AdminShared.js
   Nhiệm vụ: Tự bơm CSS, HTML Dropdown, Modal Profile và Logic xử lý
   ========================================= */
import authApi from '../../api/authAPI.js'; 

export function setupAdminProfile() {
    // --- 1. TỰ ĐỘNG BƠM CSS (Dropdown + Modal) ---
    if (!document.getElementById('admin-shared-style')) {
        const style = document.createElement('style');
        style.id = 'admin-shared-style';
        style.innerHTML = `
            /* Dropdown Style */
            .admin-profile { position: relative; cursor: pointer; }
            .admin-dropdown {
                position: absolute; top: 120%; right: 0; width: 200px;
                background: white; border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border: 1px solid #eee; display: none;
                flex-direction: column; padding: 8px 0; z-index: 999;
            }
            .admin-dropdown.active { display: flex; animation: fadeDown 0.2s ease; }
            .dropdown-item {
                padding: 10px 15px; font-size: 0.85rem; color: #333;
                display: flex; align-items: center; gap: 10px; transition: 0.2s;
            }
            .dropdown-item:hover { background: #f5f5f5; color: #4361ee; }
            .dropdown-divider { height: 1px; background: #eee; margin: 5px 0; }
            
            /* Modal Admin Style */
            .admin-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); z-index: 2000; display: none;
                align-items: center; justify-content: center;
                backdrop-filter: blur(2px);
            }
            .admin-modal-box {
                background: white; width: 500px; max-width: 95%; border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2); padding: 25px;
                animation: slideIn 0.3s ease;
            }
            .admin-modal-header { 
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;
            }
            .admin-modal-header h3 { margin: 0; color: #333; }
            .btn-close-modal { cursor: pointer; font-size: 1.2rem; color: #888; }
            
            .admin-form-row { margin-bottom: 15px; }
            .admin-form-row label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 5px; color: #555; }
            .admin-form-row input { 
                width: 100%; padding: 10px; border: 1px solid #ddd; 
                border-radius: 6px; font-size: 0.9rem; outline: none; box-sizing: border-box;
            }
            .admin-form-row input:focus { border-color: #4361ee; }
            .admin-form-row input:disabled { background: #f9f9f9; color: #888; }
            
            .admin-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
            .btn-adm-save { background: #4361ee; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
            .btn-adm-cancel { background: #eee; color: #333; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }

            @keyframes fadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    }

    // --- 2. TỰ ĐỘNG BƠM HTML (Dropdown & Modal) ---
    const adminProfile = document.querySelector('.admin-profile');
    if (adminProfile && !document.getElementById('admin-dropdown')) {
        // HTML Dropdown
        const dropdownHtml = `
            <div class="admin-dropdown" id="admin-dropdown">
                <div class="dropdown-item" id="open-admin-profile"><i class="fas fa-user-circle"></i> Hồ sơ cá nhân</div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" id="admin-logout" style="color: #e74c3c;">
                    <i class="fas fa-sign-out-alt"></i> Đăng xuất
                </div>
            </div>
        `;
        adminProfile.insertAdjacentHTML('beforeend', dropdownHtml);

        // HTML Modal (Chèn vào cuối body để tránh bị che)
        const modalHtml = `
            <div class="admin-modal-overlay" id="adminProfileModal">
                <div class="admin-modal-box">
                    <div class="admin-modal-header">
                        <h3><i class="fas fa-user-shield"></i> Hồ sơ Admin</h3>
                        <span class="btn-close-modal" id="closeAdmModal">&times;</span>
                    </div>
                    <form id="admin-profile-form">
                        <div class="admin-form-row">
                            <label>Họ và tên</label>
                            <input type="text" id="adm-name" required>
                        </div>
                        <div class="admin-form-row">
                            <label>Email (Không thể thay đổi)</label>
                            <input type="email" id="adm-email" disabled>
                        </div>
                        <div class="admin-form-row">
                            <label>Số điện thoại</label>
                            <input type="tel" id="adm-phone" required>
                        </div>
                        <div class="admin-form-row">
                            <label>Địa chỉ</label>
                            <input type="text" id="adm-address">
                        </div>
                        
                        <div style="border-top: 1px dashed #ddd; margin: 15px 0;"></div>
                        <p style="font-size: 0.8rem; color: #4361ee; margin-bottom: 10px; font-weight: 600;">Đổi mật khẩu (Bỏ qua nếu không đổi)</p>
                        
                        <div class="admin-form-row">
                            <label>Mật khẩu hiện tại</label>
                            <input type="password" id="adm-old-pass" placeholder="Nhập mật khẩu cũ để xác nhận">
                        </div>
                        <div class="admin-form-row">
                            <label>Mật khẩu mới</label>
                            <input type="password" id="adm-new-pass" placeholder="Nhập mật khẩu mới">
                        </div>

                        <div class="admin-modal-footer">
                            <button type="button" class="btn-adm-cancel" id="btnCancelAdm">Hủy</button>
                            <button type="submit" class="btn-adm-save">Lưu thay đổi</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // --- 3. KHỞI TẠO CÁC BIẾN DOM ---
    const dropdown = document.getElementById('admin-dropdown');
    const modal = document.getElementById('adminProfileModal');
    const openProfileBtn = document.getElementById('open-admin-profile');
    const logoutBtn = document.getElementById('admin-logout');
    const closeBtnX = document.getElementById('closeAdmModal');
    const closeBtnCancel = document.getElementById('btnCancelAdm');
    const profileForm = document.getElementById('admin-profile-form');

    // Cập nhật tên Admin hiển thị trên thanh Header
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const nameDisplay = adminProfile.querySelector('span');
    const roleDisplay = adminProfile.querySelector('small');
    if (nameDisplay && userInfo.name) nameDisplay.textContent = userInfo.name;
    if (roleDisplay && userInfo.role) roleDisplay.textContent = userInfo.role;

    // --- 4. XỬ LÝ DROPDOWN ---
    adminProfile.onclick = (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    };
    document.addEventListener('click', () => dropdown && dropdown.classList.remove('active'));

    // --- 5. XỬ LÝ LOGOUT ---
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm("Xác nhận đăng xuất khỏi hệ thống Admin?")) {
                localStorage.clear();
                window.location.href = '../../asset/Homepage/HomePage.html';
            }
        };
    }

    // --- 6. XỬ LÝ MODAL PROFILE ---
    
    // Mở Modal & Load dữ liệu
    if (openProfileBtn) {
        openProfileBtn.onclick = async () => {
            modal.style.display = 'flex';
            
            // Reset form pass
            document.getElementById('adm-old-pass').value = '';
            document.getElementById('adm-new-pass').value = '';

            try {
                // Gọi API lấy thông tin Admin đang đăng nhập
                const res = await authApi.getProfile(); 
                const user = res.data || res;

                // Đổ dữ liệu vào form
                document.getElementById('adm-name').value = user.full_name || '';
                document.getElementById('adm-email').value = user.email || '';
                document.getElementById('adm-phone').value = user.phone || '';
                document.getElementById('adm-address').value = user.address || '';
            } catch (err) {
                console.error(err);
                alert("Lỗi tải thông tin: " + (err.response?.data?.message || err.message));
                modal.style.display = 'none';
            }
        };
    }

    // Đóng Modal
    const closeModal = () => { if(modal) modal.style.display = 'none'; };
    if (closeBtnX) closeBtnX.onclick = closeModal;
    if (closeBtnCancel) closeBtnCancel.onclick = closeModal;

    // Submit Form Cập nhật
    if (profileForm) {
        profileForm.onsubmit = async (e) => {
            e.preventDefault();
            
            const payload = {
                full_name: document.getElementById('adm-name').value,
                phone: document.getElementById('adm-phone').value,
                address: document.getElementById('adm-address').value,
                currentPassword: document.getElementById('adm-old-pass').value,
                newPassword: document.getElementById('adm-new-pass').value
            };

            // Validate đơn giản
            if (payload.newPassword && !payload.currentPassword) {
                alert("Vui lòng nhập mật khẩu cũ để xác nhận đổi mật khẩu!");
                return;
            }

            try {
                await authApi.updateProfile(payload);
                alert("Cập nhật thông tin thành công!");
                closeModal();

                // Cập nhật lại tên trên Header ngay lập tức
                if (nameDisplay) nameDisplay.textContent = payload.full_name;
                
                // Cập nhật lại localStorage để giữ đồng bộ
                userInfo.name = payload.full_name;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));

            } catch (err) {
                console.error(err);
                alert("Cập nhật thất bại: " + (err.response?.data?.message || err.message));
            }
        };
    }
}