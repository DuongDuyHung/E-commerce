const express = require('express');
const router = express.Router();
const Cart = require('../schemas/cart');

// Thêm sản phẩm vào giỏ hàng
router.post('/add', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).send({ success: true, cart });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// Lấy giỏ hàng của người dùng
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
        res.status(200).send({ success: true, cart });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).send({ success: false, message: 'Product not in cart' });
        }

        if (quantity <= 0) {
            // Xoá sản phẩm nếu số lượng = 0
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        res.status(200).send({ success: true, cart });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// Xoá sản phẩm khỏi giỏ hàng
router.delete('/remove', async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.status(200).send({ success: true, cart });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

router.delete('/clear/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Xóa giỏ hàng của người dùng theo userId
        const result = await Cart.deleteMany({ user: userId });

        res.status(200).json({
            message: 'Đã xóa toàn bộ giỏ hàng sau khi đặt hàng thành công.',
            deletedCount: result.deletedCount
        });
    } catch (err) {
        console.error('Lỗi khi xóa giỏ hàng:', err);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa giỏ hàng.' });
    }
});
module.exports = router;