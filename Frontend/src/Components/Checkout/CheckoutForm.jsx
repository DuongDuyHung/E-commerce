import React, { useContext, useEffect, useState } from 'react'
import {
    Button, Container, Dialog, DialogActions,
    DialogContent, Grid, TextField, Typography
} from '@mui/material'
import styles from './Chekout.module.css'
import { BsFillCartCheckFill } from 'react-icons/bs'
import { MdUpdate } from 'react-icons/md'
import axios from 'axios'
import { ContextFunction } from '../../Context/Context'
import { Link, useNavigate } from 'react-router-dom'
import { profile } from '../../Assets/Images/Image'
import { toast } from 'react-toastify'
import CopyRight from '../CopyRight/CopyRight'
import { Transition, handleClose } from '../../Constants/Constant'
import { AiFillCloseCircle, AiOutlineSave } from 'react-icons/ai'


const CheckoutForm = () => {
    const { cart } = useContext(ContextFunction)
    const [userData, setUserData] = useState(null)
    const [openAlert, setOpenAlert] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const authToken = localStorage.getItem('Authorization')
    const navigate = useNavigate()
    const totalAmount = sessionStorage.getItem('totalAmount') || 0

    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        address: ''
    })

    useEffect(() => {
        if (!authToken) {
            navigate('/')
        } else {
            getUserData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getUserData = async () => {
        try {
            const userId = localStorage.getItem("userId")
            const response = await axios.get(`http://localhost:3000/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            })
            const user = response.data.data

            setUserData(user)
            setUserDetails({
                username: user.username || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || ''
            })

            if (!user.phoneNumber || !user.address) {
                setOpenAlert(true)
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error)
            toast.error("Không thể lấy thông tin người dùng", { autoClose: 1000 })
        }
    }

    const checkOutHandler = async (e) => {
        e.preventDefault()

        const { username, email, phoneNumber, address } = userDetails

        if (!username || !email || !phoneNumber || !address) {
            toast.error("Vui lòng điền đầy đủ thông tin", { autoClose: 1000 })
            return
        }

        if (paymentMethod === 'cash') {
            try {
                await axios.post(`http://localhost:3000/order/create`, {
                    userId: userData._id,
                    totalPrice: totalAmount,
                    productDetails: cart,
                    userDetails,
                    paymentMethod: 'cash'
                }, {
                    headers: { Authorization: `Bearer ${authToken}` }
                })
        
                await axios.post(`http://localhost:3000/products/update-stock`, {
                    products: cart.map(item => ({
                        productId: item._id,
                        quantity: item.quantity
                    }))
                }, {
                    headers: { Authorization: `Bearer ${authToken}` }
                })
        
                // 🧹 Gọi API để xóa toàn bộ giỏ hàng
                await axios.delete(`http://localhost:3000/cart/clear/${userData._id}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                })
        
                toast.success("Đặt hàng thành công! Thanh toán khi nhận hàng.", { autoClose: 1000 })
                 // 🧹 Gọi API để xóa toàn bộ giỏ hàng
                 await axios.delete(`http://localhost:3000/cart/clear/${userData._id}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                })
            
                navigate('/')
            } catch (error) {
                console.error("Lỗi khi đặt hàng:", error)
                toast.error("Đặt hàng thất bại!", { autoClose: 1000 })
            }
        } else {
            try {
                const { data: { key } } = await axios.get(`${process.env.REACT_APP_GET_KEY}`)
                const { data } = await axios.post(`${process.env.REACT_APP_GET_CHECKOUT}`, {
                    amount: totalAmount,
                    productDetails: cart,
                    userId: userData._id,
                    userDetails: JSON.stringify(userDetails),
                    paymentMethod: 'online',
                })

                const options = {
                    key,
                    amount: totalAmount,
                    currency: "INR",
                    name: username,
                    description: "Online Payment",
                    image: profile,
                    order_id: data.order.id,
                    callback_url: process.env.REACT_APP_GET_PAYMENTVERIFICATION,
                    prefill: {
                        name: username,
                        email,
                        contact: phoneNumber
                    },
                    notes: {
                        address
                    },
                    theme: {
                        color: "#1976d2"
                    }
                }

                const razor = new window.Razorpay(options)
                razor.open()
            } catch (error) {
                console.error("Lỗi khi xử lý thanh toán:", error)
                toast.error("Không thể xử lý thanh toán!", { autoClose: 1000 })
            }
        }
    }

    const handleOnchange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
                <Typography variant='h6' sx={{ margin: '20px 0' }}>Checkout</Typography>
                <form className={styles.checkout_form} onSubmit={checkOutHandler}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Username"
                                name="username"
                                value={userDetails.username}
                                disabled
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                value={userDetails.email}
                                onChange={handleOnchange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contact Number"
                                name="phoneNumber"
                                value={userDetails.phoneNumber}
                                onChange={handleOnchange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                name="address"
                                value={userDetails.address}
                                onChange={handleOnchange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>Payment Method</Typography>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={paymentMethod === 'cash'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    /> &nbsp;Cash on Delivery
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    /> &nbsp;Online Payment
                                </label>
                            </div>
                        </Grid>
                    </Grid>
                    <Container sx={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 5 }}>
                        <Link to='/update'><Button variant='contained' endIcon={<MdUpdate />}>Update</Button></Link>
                        <Button variant='contained' endIcon={<BsFillCartCheckFill />} type='submit'>Checkout</Button>
                    </Container>
                </form>

                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => handleClose(setOpenAlert)}
                >
                    <DialogContent>
                        <Typography variant='h6'>
                            Please add your address and phone number to proceed faster next time.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Link to='/update'>
                            <Button variant='contained' color='primary' endIcon={<AiOutlineSave />}>Add</Button>
                        </Link>
                        <Button onClick={() => handleClose(setOpenAlert)} variant='contained' color='error' endIcon={<AiFillCloseCircle />}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default CheckoutForm
