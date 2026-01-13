const router = require('express').Router();
const bookCtrl = require('../controllers/bookController');

const uploadCloud = require('../middleware/cloudinary'); // Import cái file cấu hình lúc nãy

router.get('/', bookCtrl.getAllBooks);
router.get('/ranking', bookCtrl.getRanking);
router.post('/create', uploadCloud.single('image'), (req, res) => {
    // Nếu upload thất bại thì middleware sẽ báo lỗi trước khi vào đây
    // Nếu vào được đây tức là req.file đã có link Cloudinary
    
    if (!req.file) {
        // Trường hợp hiếm hoi: không lỗi nhưng không có file
        return res.status(400).json({ error: "Không có file nào được upload!" });
    }

    // Gọi Controller để lưu vào Database
    bookCtrl.createBook(req, res);
});
router.put('/:id', bookCtrl.updateBook);
router.delete('/:id', bookCtrl.deleteBook);
router.get('/:id', bookCtrl.getBookById);

module.exports = router;