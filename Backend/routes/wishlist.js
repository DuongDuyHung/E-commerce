// routes/wishlist.js
const express = require('express');
const router = express.Router();
const Wishlist = require('../schemas/wishlist');

// Thêm sản phẩm vào wishlist
router.post('/', async (req, res) => {
    try {
        const { userId, productId } = req.body; // Lấy userId từ request body

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Kiểm tra xem người dùng đã có wishlist chưa
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            // Nếu chưa có wishlist, tạo mới
            wishlist = new Wishlist({
                user: userId,
                items: [{ product: productId }],
            });
        } else {
            // Nếu đã có wishlist, kiểm tra xem sản phẩm đã có trong danh sách chưa
            const alreadyExists = wishlist.items.some(item => item.product.toString() === productId);
            if (alreadyExists) {
                return res.status(400).json({ message: "Product already in wishlist" });
            }

            // Nếu chưa có, thêm sản phẩm vào wishlist
            wishlist.items.push({ product: productId });
        }

        await wishlist.save();
        res.status(200).json(wishlist); // Trả về wishlist sau khi đã thêm sản phẩm
    } catch (error) {
        console.error('Error adding to wishlist:', error); // Log lỗi để biết thêm chi tiết
        res.status(500).json({ message: 'Server Error', error });
    }
});


// Lấy danh sách wishlist của người dùng
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Lấy userId từ params

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Tìm wishlist của người dùng
        const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product'); // populate để lấy thông tin sản phẩm

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        res.status(200).json(wishlist); // Trả về wishlist của người dùng
    } catch (error) {
        console.error('Error fetching wishlist:', error); // Log lỗi để biết thêm chi tiết
        res.status(500).json({ message: 'Server Error', error });
    }
});

// Xóa sản phẩm khỏi wishlist
router.delete('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params; // Lấy userId và productId từ params

        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        // Tìm wishlist của người dùng
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        // Tìm và xóa sản phẩm khỏi wishlist (dựa vào product._id trong items)
        const initialItemsCount = wishlist.items.length; // Đếm số lượng sản phẩm ban đầu

        // Xóa sản phẩm khỏi wishlist.items bằng cách so sánh ID sản phẩm trong trường 'product._id'
        wishlist.items = wishlist.items.filter(item => item.product._id.toString() !== productId);

        // Kiểm tra xem sản phẩm có được xóa hay không
        if (wishlist.items.length === initialItemsCount) {
            return res.status(404).json({ message: "Product not found in wishlist" });
        }

        // Lưu lại wishlist đã thay đổi
        await wishlist.save();

        // Trả về wishlist đã cập nhật
        res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } catch (error) {
        console.error('Error removing product from wishlist:', error); // Log lỗi để biết thêm chi tiết
        res.status(500).json({ message: 'Server Error', error });
    }
});



module.exports = router;
