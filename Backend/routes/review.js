// routes/review.js
const express = require('express');
const router = express.Router();
const Review = require('../schemas/review'); // schema review
const authMiddleware = require('../utils/check_auth'); // middleware check auth

// Add a review
router.post('/add',authMiddleware.check_authentication, async (req, res) => {
    try {
        const { id, rating, comment } = req.body;
        const userId = req.user._id;

        const newReview = new Review({
            product: id,
            user: userId,
            rating,
            comment
        });

        await newReview.save();
        res.status(200).json({ msg: "Review submitted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

router.post('/:id', async (req, res) => {
    try {
        const { filterType } = req.body;
        let query = Review.find({ product: req.params.id }).populate('user', 'username');

        if (filterType === 'mostrecent') query.sort({ createdAt: -1 });
        else if (filterType === 'old') query.sort({ createdAt: 1 });
        else if (filterType === 'positivefirst') query.sort({ rating: -1 });
        else if (filterType === 'negativefirst') query.sort({ rating: 1 });

        const reviews = await query.exec();
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
