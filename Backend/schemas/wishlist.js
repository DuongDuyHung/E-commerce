const mongoose = require('mongoose');
let wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user', // Reference to the user
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'product', // Reference to the product
                required: true
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('wishlist', wishlistSchema);
