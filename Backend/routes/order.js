const express = require('express');
const router = express.Router();
const Order = require('../schemas/order');
const Invoice = require('../schemas/invoice');
const { generateInvoiceNumber } = require('../utils/seri');

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

router.get('/', async (req, res) => {
    try {
        // Lấy tất cả đơn hàng của người dùng
        const orders = await Order.find()
        .populate('user', 'username email phoneNumber')
            .populate('items.product', 'name price image rating') // Lấy thông tin sản phẩm
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo đơn hàng (mới nhất ở đầu)

        if (!orders || orders.length === 0) {
            return res.status(404).send({ success: false, message: 'No orders found' });
        }

        res.status(200).send({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send({ success: false, message: error.message });
    }
});

router.put('/update-status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { newStatus } = req.body;

        const allowedStatuses = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(newStatus)) {
            return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true }
        ).populate('user');

        console.log("updatedOrder:", updatedOrder);

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        if (newStatus === 'Delivered') {
            const existingInvoice = await Invoice.findOne({ order: orderId });
            if (!existingInvoice) {
                // Lấy thông tin sản phẩm đầy đủ
                await updatedOrder.populate('items.product');
        
                const invoiceItems = updatedOrder.items.map(item => {
                    const price = item.product.price;
                    const quantity = item.quantity;
                    return {
                        product: item.product._id,
                        quantity,
                        price,
                        total: price * quantity
                    };
                });
        
                await Invoice.create({
                    user: updatedOrder.user._id,
                    order: updatedOrder._id,
                    totalAmount: updatedOrder.totalAmount || 0,
                    paymentMethod: updatedOrder.paymentMethod || 'Cash',
                    invoiceNumber: generateInvoiceNumber(),
                    items: invoiceItems
                });
            }
        }
        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/completed/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const allOrders = await Order.find({ user: userId })
            .populate('items.product', 'name price image rating')
            .sort({ createdAt: -1 });

        if (!allOrders || allOrders.length === 0) {
            return res.status(404).json({ success: false, message: 'Không có đơn hàng nào' });
        }

        res.status(200).json({ success: true, orders: allOrders });
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/cancel/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
      }
  
      if (order.status === 'Delivered') {
        return res.status(400).json({ success: false, message: 'Đơn hàng đã giao, không thể hủy' });
      }
  
      if (order.status === 'Cancelled') {
        return res.status(400).json({ success: false, message: 'Đơn hàng đã bị hủy trước đó' });
      }
  
      order.status = 'Cancelled';
      await order.save();
  
      res.status(200).json({ success: true, message: 'Đã hủy đơn hàng thành công', order });
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

module.exports = router;