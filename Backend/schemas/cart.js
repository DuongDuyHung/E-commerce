let mongoose = require('mongoose');

let cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user', // Tham chiếu đến người dùng
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'product', // Tham chiếu đến sản phẩm
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('cart', cartSchema);