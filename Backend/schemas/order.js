let mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
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
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('order', orderSchema);