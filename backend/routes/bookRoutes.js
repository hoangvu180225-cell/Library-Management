const router = require('express').Router();
const bookCtrl = require('../controllers/bookController');
const uploadCloud = require('../middleware/cloudinary');

// 1. IMPORT ĐÚNG CÁC HÀM CẦN THIẾT TỪ MIDDLEWARE AUTH
const { verifyToken, verifyStaff } = require('../middleware/auth'); 

// --- CÁC ROUTE CÔNG KHAI (Public) ---
router.get('/', bookCtrl.getAllBooks);
router.get('/ranking', bookCtrl.getRanking);
router.get('/:id', bookCtrl.getBookById);

// --- CÁC ROUTE BẢO VỆ (Cần đăng nhập & quyền Admin hoặc Staff) ---
router.post('/', verifyToken, verifyStaff, uploadCloud.single('image'), bookCtrl.createBook);
router.put('/:id', verifyToken, verifyStaff, bookCtrl.updateBook);
router.delete('/:id', verifyToken, verifyStaff, bookCtrl.deleteBook);

module.exports = router;