import { Container } from '@mui/system'
import axios from 'axios'
import CartList from '../../Components/Card/CartCard/CartList'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai'
import { EmptyCart } from '../../Assets/Images/Image';
import { Transition } from '../../Constants/Constant'
import CopyRight from '../../Components/CopyRight/CopyRight'

const Wishlist = () => {
    const { wishlistData, setWishlistData } = useContext(ContextFunction)
    const [openAlert, setOpenAlert] = useState(false);

    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    let navigate = useNavigate()
    useEffect(() => {
        if (authToken) {
            getWishList();
        } else {
            setOpenAlert(true);
        }
    }, [authToken]); // Theo dõi authToken
    const getWishList = async () => {
        if (setProceed) {
            try {
                const userId = localStorage.getItem('userId');
                console.log('userId', userId); // Lấy userId từ localStorage
                const { data } = await axios.get(`http://localhost:3000/wishlist/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    },
                    params: {
                        userId: userId  // Thêm userId vào query params
                    }
                });
                console.log("Wishlist data: ", data); // Log dữ liệu trả về từ API
                setWishlistData(data);
                console.log("Updated wishlistData: ", wishlistData); // Kiểm tra sau khi cập nhật
            } catch (error) {
                console.error("Error fetching wishlist: ", error); // Log lỗi nếu có
            }
        } else {
            setOpenAlert(true);
        }
    };

    const removeFromWishlist = async (product) => {
        console.log('Removing from wishlist:', product);  // Kiểm tra sản phẩm đang bị xóa
        if (setProceed) {
            try {
                // Lấy wishlistId từ wishlistData (trong trường hợp wishlistData._id là ID đúng)
                const wishlistId = wishlistData._id;
    
                // Gửi yêu cầu xóa sản phẩm từ wishlist bằng wishlistId và product._id
                const deleteProduct = await axios.delete(`http://localhost:3000/wishlist/${wishlistData.user}/${product._id}`, {
                    headers: {
                      'Authorization': `Bearer ${authToken}`
                    }
                  });
    
                // Cập nhật lại danh sách wishlist sau khi xóa sản phẩm
                setWishlistData(prevWishlistData => ({
                    ...prevWishlistData,
                    items: prevWishlistData.items.filter(item => item.product._id !== product._id) // Lọc theo product._id trong items
                }));
    
                toast.success("Removed From Wishlist", { autoClose: 500, theme: 'colored' });
            } catch (error) {
                toast.error(error.message, { autoClose: 500, theme: 'colored' });
            }
        }
    };
    const handleClose = () => {
        setOpenAlert(false);
        navigate('/')
    };
    const handleToLogin = () => {
        navigate('/login')
    };

    return (
        <>
            <Typography variant='h3' sx={{ textAlign: 'center', margin: "10px 0 ", color: '#1976d2', fontWeight: 'bold' }}>Wishlist</Typography>
            {wishlistData && wishlistData.items && wishlistData.items.length > 0 ? (
    <Container maxWidth='xl' style={{ display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20 }}>
        {wishlistData.items.map(item => (
            <CartList product={item.product} removeFromWishlist={removeFromWishlist} key={item._id} />
        ))}
    </Container>
) : (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="main-card">
            <img src={EmptyCart} alt="Empty_cart" className="empty-cart-img" />
            <Typography variant='h6' sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }}>No products in wishlist</Typography>
        </div>
    </Box>
)}
            <Dialog open={openAlert}
                keepMounted
                onClose={handleClose}
                TransitionComponent={Transition}

                aria-describedby="alert-dialog-slide-description">
                <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h5'> Please Login To Proceed</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant='contained' onClick={handleToLogin} endIcon={<AiOutlineLogin />} color='primary'>Login</Button>
                    <Button variant='contained' color='error' endIcon={<AiFillCloseCircle />} onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default Wishlist