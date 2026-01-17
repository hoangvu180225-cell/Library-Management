const express = require('express');
const router = express.Router();
const transactionCtrl = require('../controllers/transactionController');
const {verifyToken} = require('../middleware/auth');

router.use(verifyToken);
// Các API yêu cầu token
router.post('/add',  transactionCtrl.addToLibrary);
router.get('/', transactionCtrl.getLibrary);
router.post('/loans', transactionCtrl.borrowBook);
router.post('/buy', transactionCtrl.buyBook);

router.delete('/:id', transactionCtrl.deleteTransaction); // Route xóa
router.put('/:id', transactionCtrl.updateStatus);         // Route trả sách (update)

module.exports = router;