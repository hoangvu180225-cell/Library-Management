const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'book_store',      // Tên thư mục trên Cloudinary
    resource_type: 'auto',     // Tự động nhận diện ảnh/video/raw
    // allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Tạm bỏ comment dòng này nếu muốn lọc kỹ
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;