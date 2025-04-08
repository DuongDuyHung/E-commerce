const express = require('express');
const router = express.Router();
const Invoice = require('../schemas/invoice');

router.get('/order/:orderId', async (req, res) => {
    try {
      const invoice = await Invoice.findOne({ order: req.params.orderId })
        .populate('order')
        .populate('user')
        .populate('items.product');
  
      if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  
      res.status(200).json({ invoice });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server' });
    }
  });

// export đúng router
module.exports = router;