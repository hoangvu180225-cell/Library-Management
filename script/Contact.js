/* Sửa file script/Contact.js */
import { initSharedUI } from './ShareUI.js';
import contactApi from '../api/contactAPI.js'; 

document.addEventListener('DOMContentLoaded', () => {
    initSharedUI();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Lấy dữ liệu từ form
            const inputs = contactForm.querySelectorAll('input, textarea');
            const data = {
                full_name: inputs[0].value,
                email: inputs[1].value,
                message: inputs[2].value
            };

            try {
                await contactApi.submit(data);
                alert("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.");
                contactForm.reset();
            } catch (error) {
                alert("Lỗi gửi tin nhắn: " + error.message);
            }
        });
    }
});