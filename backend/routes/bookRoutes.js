const router = require('express').Router();
const bookCtrl = require('../controllers/bookController');
const uploadCloud = require('../middleware/cloudinary');

// 1. IMPORT MIDDLEWARE AUTH (File tên là 'auth' như bạn nói)
const auth = require('../middleware/auth'); 

// --- CÁC ROUTE CÔNG KHAI (Ai cũng xem được) ---
router.get('/', bookCtrl.getAllBooks);
router.get('/ranking', bookCtrl.getRanking);
router.get('/:id', bookCtrl.getBookById);

// --- CÁC ROUTE BẢO VỆ (Cần đăng nhập & quyền Admin/Staff) ---

// Thêm sách: Chạy verifyToken -> verifyAdmin -> upload ảnh -> rồi mới vào controller
router.post('/', auth, uploadCloud.single('image'), bookCtrl.createBook);

// Sửa sách
router.put('/:id', auth, bookCtrl.updateBook);

// Xóa sách
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;