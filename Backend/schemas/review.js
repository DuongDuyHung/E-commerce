const mongoose = require('mongoose');
let reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'product', // Reference to the product
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user', // Reference to the user
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('review', reviewSchema);
