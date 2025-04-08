import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Invoice.css';

const Invoice = () => {
  const { orderId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        const res = await axios.get(`http://localhost:3000/invoice/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInvoice(res.data.invoice);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu hóa đơn:', error);
      }
    };

    fetchInvoice();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (!invoice) return <p>Đang tải hóa đơn...</p>;

  return (
    <div className="invoice-container">
      <h2>🧾 HÓA ĐƠN THANH TOÁN</h2>
      <p><strong>Số hóa đơn:</strong> {invoice.invoiceNumber}</p>
      <p><strong>Mã đơn hàng:</strong> {invoice.order._id}</p>
      <p><strong>Khách hàng:</strong> {invoice.user.name}</p>
      <p><strong>Ngày lập:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
      <p><strong>Trạng thái thanh toán:</strong> {invoice.paymentStatus}</p>
      <p><strong>Phương thức thanh toán:</strong> {invoice.paymentMethod}</p>

      <h3>📦 Danh sách sản phẩm:</h3>
      <ul>
        {invoice.items.map((item, index) => (
          <li key={index}>
            {item.product.name} x {item.quantity} — {item.total.toLocaleString()} đ
          </li>
        ))}
      </ul>

      <p><strong>Tổng cộng:</strong> {invoice.totalAmount.toLocaleString()} đ</p>

      <button className="print-btn" onClick={handlePrint}>🖨️ In hóa đơn</button>
    </div>
  );
};

export default Invoice;
