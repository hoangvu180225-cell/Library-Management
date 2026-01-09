const router = require('express').Router();
const bookCtrl = require('../controllers/bookController');

router.get('/', bookCtrl.getAllBooks);
router.get('/ranking', bookCtrl.getRanking);
router.get('/:id', bookCtrl.getDetail);
router.post('/', bookCtrl.createBook); // Note : Yêu cầu quyền admin
router.put('/:id', bookCtrl.updateBook);
router.delete('/:id', bookCtrl.deleteBook);

module.exports = router;