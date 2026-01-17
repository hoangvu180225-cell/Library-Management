const router = require('express').Router();
const reviewCtrl = require('../controllers/reviewController');
const {verifyToken} = require('../middleware/auth');

//Lấy danh sách đánh giá và Viết đánh giá đều cần check token
router.get('/:id', verifyToken, reviewCtrl.getReviews);
router.post('/:id', verifyToken, reviewCtrl.postReview);

module.exports = router;