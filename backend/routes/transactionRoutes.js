const express = require('express');
const router = express.Router();
const transactionCtrl = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// Các API yêu cầu token
router.post('/add', auth, transactionCtrl.addToLibrary);
router.get('/', auth, transactionCtrl.getLibrary);
router.post('/loans', auth, transactionCtrl.borrowBook);
router.post('/buy', auth, transactionCtrl.buyBook);

module.exports = router;