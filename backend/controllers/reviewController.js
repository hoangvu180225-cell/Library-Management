exports.getReviews = async (req, res) => {
    const { id } = req.params; // bookId
    try {
        const [rows] = await db.query('SELECT * FROM reviews WHERE book_id = ?', [id]);
        res.json(rows); // Trả về bookReview
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.postReview = async (req, res) => {
    const { id } = req.params;
    const { content, rating } = req.body; // bookReview content
    try {
        await db.query('INSERT INTO reviews (book_id, user_id, content, rating) VALUES (?, ?, ?, ?)', 
        [id, req.user.id, content, rating]);
        res.json({ message: "Gửi đánh giá thành công" });
    } catch (error) { res.status(500).json({ message: error.message }); }
};