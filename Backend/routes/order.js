const express = require('express');
const router = express.Router();
const Order = require('../schemas/order');

// Tạo đơn hàng trực tiếp từ dữ liệu gửi lên (không qua Cart)
router.post('/create', async (req, res) => {
    try {
        const { userId, totalPrice, productDetails } = req.body;

        // Kiểm tra dữ liệu cần thiết
        if (!userId || !productDetails || productDetails.length === 0) {
            return res.status(400).send({ success: false, message: 'Invalid order data' });
        }

        // Chuyển productDetails thành mảng items phù hợp schema
        const items = productDetails.map(item => ({
            product: item.product._id, // chỉ lấy _id
            quantity: item.quantity
        }));

        const order = new Order({
            user: userId,
            items,
            totalAmount: Number(totalPrice), // đảm bảo là kiểu số
            status: 'Pending' // mặc định
        });

        await order.save();

        res.status(200).send({ success: true, order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send({ success: false, message: error.message });
    }
});

module.exports = router;