const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Kiểm tra xem đã lấy được key chưa (để debug)
if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("LỖI: Chưa cấu hình file .env hoặc tên biến sai!");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Project1',
    allowed_formats: ['jpg', 'png', 'jpeg'], 
    // Mẹo: Thêm dòng này để xử lý file không phải ảnh (nếu cần)
    resource_type: 'auto', 
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;