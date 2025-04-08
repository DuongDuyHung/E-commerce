import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Collapse, Typography, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [openOrderId, setOpenOrderId] = useState("");

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3000/order');
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:3000/order/update-status/${orderId}`, { newStatus });
            if (response.data.success) {
                setOrders(prev =>
                    prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order)
                );
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <Paper style={{ overflow: "auto", maxHeight: "500px" }}>
            <TableContainer sx={{ maxHeight: '500px' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>User Name</TableCell>
                            <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>Phone Number</TableCell>
                            <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>Total Amount</TableCell>
                            <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>Order Created Date</TableCell>
                            <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedOrders.map((order) => (
                            <React.Fragment key={order._id}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                setOpenOrderId(openOrderId === order._id ? "" : order._id)
                                            }>
                                            <MdKeyboardArrowDown />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`user/${order.user._id}`}>{order.user.username}</Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`user/${order.user._id}`}>{order.user.email}</Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`user/${order.user._id}`}>{order.user.phoneNumber}</Link>
                                    </TableCell>
                                    <TableCell>
                                        {order.totalAmount}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            weekday: "short", year: "numeric", month: "short", day: "numeric"
                                        })} {new Date(order.createdAt).toLocaleTimeString('en-US')}
                                    </TableCell>
                                    <TableCell>
    <FormControl variant="standard" sx={{ minWidth: 120 }}>
        <Select
            value={order.status}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
        >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
    </FormControl>
</TableCell>

                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default OrderTable;
