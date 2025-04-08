import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('userId')?.trim();
        const token = localStorage.getItem("Authorization");
        const res = await axios.get(`http://localhost:3000/order/completed/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  // Xử lý huỷ đơn hàng
  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
    if (!confirmCancel) return;
  
    try {
      const token = localStorage.getItem("Authorization");
      const res = await axios.put(`http://localhost:3000/order/cancel/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: "Cancelled" } : o));
        alert("Huỷ đơn hàng thành công!");
      } else {
        alert(res.data.message || "Huỷ đơn hàng thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi huỷ đơn hàng:", error);
      alert("Huỷ đơn hàng thất bại.");
    }
  };
  
  return (
    <div className="orders-container">
      <h2 className="orders-title">🧾 Lịch sử đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p className="no-orders-text">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6).toUpperCase()}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.totalAmount.toLocaleString()} đ</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === 'Delivered' ? (
                      <a className="invoice-link" href={`/invoice/${order._id}`}>In hóa hóa đơn</a>
                    ) : order.status === 'Cancelled' ? (
                      <span className="cancelled-text">Đã hủy</span>
                    ) : (
                      <button
                        className="cancel-btn"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
