const router = require('express').Router();
const bookCtrl = require('../controllers/bookController');

const uploadCloud = require('../middleware/cloudinary'); // Import cái file cấu hình lúc nãy

router.get('/', bookCtrl.getAllBooks);
router.get('/ranking', bookCtrl.getRanking);
router.post('/', uploadCloud.single('image'), bookCtrl.createBook);
router.put('/:id', bookCtrl.updateBook);
router.delete('/:id', bookCtrl.deleteBook);
router.get('/:id', bookCtrl.getBookById);

module.exports = router;