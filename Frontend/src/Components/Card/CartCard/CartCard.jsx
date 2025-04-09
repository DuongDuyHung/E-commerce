import React, { useEffect, useState } from 'react';
import { Button, Typography, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { AiFillDelete } from 'react-icons/ai';
import axios from 'axios';

const CartCard = ({ product, removeFromCart,updateQuantity }) => {
    const [productDetails, setProductDetails] = useState(null);
    const [quantity, setQuantity] = useState(product.quantity); // Quản lý số lượng sản phẩm
    const [totalPrice, setTotalPrice] = useState(0); // Quản lý giá tạm thời

    // Gọi API để lấy thông tin chi tiết sản phẩm
    useEffect(() => {
        const fetchProductDetailsFromCart = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.error('User ID not found');
                    return;
                }
    
                if (!product || !product.product) {
                    console.error('Product data is missing:', product);
                    return;
                }
    
                const productId = typeof product.product === 'string' ? product.product : product.product._id;
    
                if (!productId) {
                    console.error('Product ID is undefined:', product);
                    return;
                }
    
                const { data } = await axios.get(`http://localhost:3000/products/cart/${productId}`, {
                    params: { userId },
                });
    
                setProductDetails(data.data);
                setTotalPrice(data.data.price * product.quantity);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
    
        fetchProductDetailsFromCart();
    }, [product]);
    

    // Hàm xử lý tăng số lượng
    const handleIncrease = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        setTotalPrice(productDetails.price * newQuantity); 
        updateQuantity(product.productId?._id || product.product?._id, newQuantity);
    };

    // Hàm xử lý giảm số lượng
    const handleDecrease = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            setTotalPrice(productDetails.price * newQuantity); // Cập nhật giá tạm thời
            updateQuantity(product.productId?._id || product.product?._id, newQuantity);
        }
    };

    

    if (!productDetails) {
        return <Typography>Loading...</Typography>; // Hiển thị trạng thái tải
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #ddd',
                padding: '10px 0',
            }}
        >
            {/* Hình ảnh sản phẩm */}
            <Box sx={{ flex: '0 0 100px', marginRight: '20px' }}>
                <img
                    alt={productDetails.name}
                    loading="lazy"
                    src={`http://localhost:3000${productDetails.imgURL}`}
                    style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
                />
            </Box>

            {/* Thông tin sản phẩm */}
            <Box sx={{ flex: '1', marginRight: '20px' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {productDetails.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {productDetails.type}
                </Typography>
            </Box>

            {/* Số lượng */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <Button variant="outlined" size="small" sx={{ minWidth: '30px' }} onClick={handleDecrease}>
                    -
                </Button>
                <Typography variant="body2" sx={{ margin: '0 10px' }}>
                    {quantity}
                </Typography>
                <Button variant="outlined" size="small" sx={{ minWidth: '30px' }} onClick={handleIncrease}>
                    +
                </Button>
            </Box>

            {/* Giá sản phẩm */}
            <Box sx={{ marginRight: '20px' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {totalPrice} đồng
                </Typography>
            </Box>

            {/* Xóa sản phẩm */}
            <Box>
                <Tooltip title="Remove From Cart">
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => removeFromCart(product)}
                        sx={{ minWidth: '30px', padding: '5px' }}
                    >
                        <AiFillDelete />
                    </Button>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default CartCard;