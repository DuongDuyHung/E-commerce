let mongoose = require('mongoose');

let invoiceSchema = new mongoose.Schema({
    order: {
        type: mongoose.Types.ObjectId,
        ref: 'order', // Reference to the order
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user', // Reference to the user
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    items: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'product', // Reference to the product
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'],
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('invoice', invoiceSchema);
