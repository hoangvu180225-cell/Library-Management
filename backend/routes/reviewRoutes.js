const router = require('express').Router();
const reviewCtrl = require('../controllers/reviewController');
const auth = require('../middleware/auth');

//Lấy danh sách đánh giá và Viết đánh giá đều cần check token
router.get('/:id', auth, reviewCtrl.getReviews);
router.post('/:id', auth, reviewCtrl.postReview);

module.exports = router;