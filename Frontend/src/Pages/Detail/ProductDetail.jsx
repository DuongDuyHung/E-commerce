import './Productsimilar.css';
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Tooltip,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Chip,
    Rating,
    ButtonGroup,
    Skeleton,
} from '@mui/material';
import { MdAddShoppingCart } from 'react-icons/md';
import { AiFillHeart, AiFillCloseCircle, AiOutlineLogin, AiOutlineShareAlt } from 'react-icons/ai';
import { TbDiscount2 } from 'react-icons/tb';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ContextFunction } from '../../Context/Context';
import ProductReview from '../../Components/Review/ProductReview';
import ProductCard from '../../Components/Card/Product Card/ProductCard';
import { Transition } from '../../Constants/Constant';
import CopyRight from '../../Components/CopyRight/CopyRight';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
    const { cart, setCart, wishlistData, setWishlistData } = useContext(ContextFunction);
    const [openAlert, setOpenAlert] = useState(false);
    const { id, cat } = useParams();
    const [product, setProduct] = useState({});
    const [similarProduct, setSimilarProduct] = useState([]);
    const [productQuantity, setProductQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    let authToken = localStorage.getItem('Authorization');
    let setProceed = authToken ? true : false;


    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('Logged in userId (useEffect):', userId); // Kiểm tra giá trị userId khi component được mount
        fetchProductDetails(); // Gọi API lấy chi tiết sản phẩm
        fetchSimilarProducts(); // Gọi API lấy sản phẩm tương tự theo category
        window.scroll(0, 0);
    }, [id, cat]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:3000/products/${id}`); // Gọi API chi tiết sản phẩm
            setProduct(data.data); // Lưu dữ liệu sản phẩm vào state
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product details:", error);
            toast.error("Failed to fetch product details", { autoClose: 500, theme: 'colored' });
            setLoading(false);
        }
    };

    const fetchSimilarProducts = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3000/products`, { params: { category: cat } }); // Gọi API sản phẩm tương tự
            setSimilarProduct(data);
        } catch (error) {
            console.error("Error fetching similar products:", error);
        }
    };

    const addToCart = async (product) => {
        if (setProceed) {
            try {
                const userId = localStorage.getItem('userId');
                console.log('Logged in userId:', userId);
                if (!userId) {
                    toast.error("User ID not found. Please log in again.", { autoClose: 500, theme: 'colored' });
                    navigate('/login'); // Điều hướng đến trang đăng nhập
                    return;
                } // nếu bạn đã lưu
                const { data } = await axios.post(`http://localhost:3000/cart/add`, 
                    {
                        userId, // Thay USER_ID bằng id người dùng thật
                        productId: product._id,
                        quantity: productQuantity
                    }, 
                    {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    }
                );
                setCart(data);
                toast.success("Added To Cart", { autoClose: 500, theme: 'colored' });
            } catch (error) {
                toast.error(error.response?.data?.msg || "Failed to add to cart", { autoClose: 500, theme: 'colored' });
            }
        } else {
            setOpenAlert(true);
        }
    };

 const addToWishlist = async (product) => {
    if (setProceed) { // Kiểm tra nếu người dùng đã đăng nhập hoặc điều kiện thêm vào wishlist
        try {
            const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
            if (!userId) {
                return toast.error("User not logged in", { autoClose: 500, theme: 'colored' });
            }

            console.log('productId:', product._id); // Log productId để kiểm tra giá trị

            // Gửi yêu cầu POST tới API wishlist
            const { data } = await axios.post(`http://localhost:3000/wishlist`, 
                { productId: product._id, userId: userId }, // Truyền thông tin sản phẩm và userId vào body
            );
            setWishlistData(data);
            toast.success("Added To Wishlist", { autoClose: 500, theme: 'colored' });
        } catch (error) {
            console.error('Error:', error); // Log lỗi để xem chi tiết
            toast.error(error.response?.data?.msg || "Failed to add to wishlist", { autoClose: 500, theme: 'colored' });
        }
    } else {
        setOpenAlert(true); // Hiển thị cảnh báo nếu người dùng chưa đăng nhập
    }
};
    

    const shareProduct = (product) => {
        const data = {
            text: product.name,
            title: "e-shopit",
            url: `https://e-shopit.vercel.app/Detail/type/${cat}/${id}`,
        };
        if (navigator.canShare && navigator.canShare(data)) {
            navigator.share(data);
        } else {
            toast.error("Browser does not support sharing", { autoClose: 500, theme: 'colored' });
        }
    };

    const increaseQuantity = () => {
        setProductQuantity((prev) => (prev >= 5 ? 5 : prev + 1));
    };

    const decreaseQuantity = () => {
        setProductQuantity((prev) => (prev <= 1 ? 1 : prev - 1));
    };

    return (
        <>
            <Container maxWidth="xl">
            <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(-1)} // Quay lại giao diện trước đó
                    sx={{ marginBottom: 2 }}
                >
                    Quay lại
                </Button>
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenAlert(false)}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
                        <DialogContentText style={{ textAlign: 'center' }} id="alert-dialog-slide-description">
                            Please Login To Proceed
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Link to="/login">
                            <Button variant="contained" endIcon={<AiOutlineLogin />} color="primary">
                                Login
                            </Button>
                        </Link>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setOpenAlert(false)}
                            endIcon={<AiFillCloseCircle />}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <main className="main-content">
                    {loading ? (
                        <Skeleton variant="rectangular" height={400} />
                    ) : (
                        <div className="product-image">
                            <div className="detail-img-box">
                                <img alt={product.name} src={`http://localhost:3000${product.imgURL}`} className="detail-img" />
                                <br />
                            </div>
                        </div>
                    )}
                    {loading ? (
                        <section style={{ display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                            <Skeleton variant="rectangular" height={200} width="200px" />
                            <Skeleton variant="text" height={400} width={700} />
                        </section>
                    ) : (
                        <section className="product-details">
                            <Typography variant="h4">{product.name}</Typography>
                            <Typography>{product.description}</Typography>
                            <Chip
                                label={product.price > 1000 ? "Upto 9% off" : "Upto 38% off"}
                                variant="outlined"
                                sx={{ background: '#1976d2', color: 'white', width: '150px', fontWeight: 'bold' }}
                                avatar={<TbDiscount2 color="white" />}
                            />
                            <div style={{ display: 'flex', gap: 20 }}>
                                <Typography variant="h6" color="red">
                                    <s>{product.price > 1000 ? product.price + 1000 : product.price + 300} đồng</s>
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    {product.price} đồng
                                </Typography>
                            </div>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '& > *': {
                                        m: 1,
                                    },
                                }}
                            >
                                <ButtonGroup variant="outlined" aria-label="outlined button group">
                                    <Button onClick={increaseQuantity}>+</Button>
                                    <Button>{productQuantity}</Button>
                                    <Button onClick={decreaseQuantity}>-</Button>
                                </ButtonGroup>
                            </Box>
                            <Rating name="read-only" value={Math.round(product.rating)} readOnly precision={0.5} />
                            <div style={{ display: 'flex' }}>
                                <Tooltip title="Add To Cart">
                                    <Button
                                        variant="contained"
                                        className="all-btn"
                                        startIcon={<MdAddShoppingCart />}
                                        onClick={() => addToCart(product)}
                                    >
                                        Buy
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Add To Wishlist">
                                    <Button
                                        style={{ marginLeft: 10 }}
                                        size="small"
                                        variant="contained"
                                        className="all-btn"
                                        onClick={() => addToWishlist(product)}
                                    >
                                        <AiFillHeart fontSize={21} />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Share">
                                    <Button
                                        style={{ marginLeft: 10 }}
                                        variant="contained"
                                        className="all-btn"
                                        startIcon={<AiOutlineShareAlt />}
                                        onClick={() => shareProduct(product)}
                                    >
                                        Share
                                    </Button>
                                </Tooltip>
                            </div>
                        </section>
                    )}
                </main>
                <ProductReview setProceed={setProceed} authToken={authToken} id={id} setOpenAlert={setOpenAlert} />

                <Typography sx={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold', textAlign: 'center' }}>
                    Similar Products
                </Typography>
                <Box className="similarProduct" sx={{ display: 'flex', overflowX: 'auto', marginBottom: 10 }}>
                    {similarProduct
                        .filter((prod) => prod._id !== id)
                        .map((prod) => (
                            <Link to={`/Detail/type/${prod.type}/${prod._id}`} key={prod._id}>
                                <ProductCard prod={prod} />
                            </Link>
                        ))}
                </Box>
            </Container>
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    );
};

export default ProductDetail;