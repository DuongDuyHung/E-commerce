import React, { useState, useEffect } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography, InputLabel, MenuItem, FormControl, Select,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Transition } from '../../Constants/Constant';
import { MdOutlineCancel, MdProductionQuantityLimits } from 'react-icons/md';

const AddProduct = ({ getProductInfo }) => {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]); // Lưu danh sách category từ backend
    const [productInfo, setProductInfo] = useState({
        name: "",
        price: "",
        rating: "",
        category: "",
        description: "",
        author: "",
        brand: ""
    });
    const [imageFile, setImageFile] = useState(null); // Lưu file ảnh

    const authToken = localStorage.getItem("Authorization");

    // Lấy danh sách category từ backend
    const fetchCategories = async () => {
        try {
            const { data } = await axios.get("http://localhost:3000/categories");
            setCategories(data); // Lưu danh sách category vào state
        } catch (error) {
            console.error("Error fetching categories:", error.response?.data || error.message);
            toast.error("Failed to load categories", { autoClose: 500, theme: 'colored' });
        }
    };

    useEffect(() => {
        fetchCategories(); // Gọi API khi component được mount
    }, []);

    // Xử lý thay đổi input
    const handleOnChange = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
    };

    // Xử lý chọn ảnh
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]); // Lưu file ảnh vào state
    };

    // Upload ảnh lên backend
    const uploadImage = async () => {
        if (!imageFile) return null; // Không có file ảnh, trả về null
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const { data } = await axios.post("http://localhost:3000/api/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            return data.imageUrl; // Trả về URL của ảnh đã upload
        } catch (error) {
            console.error("Error uploading image:", error.response?.data || error.message);
            toast.error("Failed to upload image", { autoClose: 500, theme: 'colored' });
            return null;
        }
    };

    // Gửi dữ liệu sản phẩm mới lên backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Kiểm tra các trường bắt buộc
            if (!productInfo.name || !productInfo.price || !productInfo.rating || !productInfo.category || !productInfo.description) {
                toast.error("Please fill in all fields", { autoClose: 500, theme: 'colored' });
                return;
            }

            if (productInfo.rating < 0 || productInfo.rating > 5) {
                toast.error("Please add a valid rating (0-5)", { autoClose: 500, theme: 'colored' });
                return;
            }

            // Upload ảnh trước khi gửi dữ liệu sản phẩm
            const imageUrl = await uploadImage();
            if (!imageUrl) {
                toast.error("Please upload an image before submitting", { autoClose: 500, theme: 'colored' });
                return;
            }

            const { data } = await axios.post("http://localhost:3000/products", {
                name: productInfo.name,
                brand: productInfo.brand,
                price: productInfo.price,
                quantity: productInfo.quantity,
                category: productInfo.category,
                imageUrl: imageUrl, // Sử dụng URL ảnh từ backend
                rating: productInfo.rating,
                author: productInfo.author,
                description: productInfo.description,
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (data.success) {
                toast.success("Product added successfully", { autoClose: 500, theme: 'colored' });
                getProductInfo(); // Cập nhật danh sách sản phẩm
                setProductInfo({
                    name: "",
                    price: "",
                    rating: "",
                    quantity: "",
                    category: "",
                    description: "",
                    author: "",
                    brand: ""
                });
                setImageFile(null); // Reset file ảnh
                setOpen(false);
            } else {
                toast.error(data.message || "Something went wrong", { autoClose: 500, theme: 'colored' });
            }
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "An error occurred", { autoClose: 500, theme: 'colored' });
        }
    };

    // Dropdown dữ liệu
    const shoeBrand = ['adidas', 'hushpuppies', 'nike', 'reebok', 'vans'];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "20px 0" }}>
                <Typography variant='h6' textAlign='center' color="#1976d2" fontWeight="bold">Add New Product</Typography>
                <Button variant='contained' endIcon={<MdProductionQuantityLimits />} onClick={() => setOpen(true)}>Add</Button>
            </Box>
            <Divider sx={{ mb: 5 }} />
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                keepMounted
                TransitionComponent={Transition}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold', color: "#1976d2" }}>Add New Product</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField label="Name" name='name' value={productInfo.name} onChange={handleOnChange} variant="outlined" fullWidth required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="category-select-label">Product Category</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                            id="category-select"
                                            value={productInfo.category}
                                            label="Product Category"
                                            name='category'
                                            onChange={handleOnChange}
                                            required
                                        >
                                            {categories.map(category => (
                                                <MenuItem value={category.name} key={category._id}>{category.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        type="file"
                                        onChange={handleImageChange}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Price" name='price' value={productInfo.price} onChange={handleOnChange} variant="outlined" inputMode='numeric' fullWidth required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
    <TextField label="Quantity" name='quantity' value={productInfo.quantity} onChange={handleOnChange} variant="outlined" inputMode='numeric' fullWidth required />
</Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Rating" name='rating' value={productInfo.rating} onChange={handleOnChange} variant="outlined" inputMode='numeric' fullWidth required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        name='description'
                                        value={productInfo.description}
                                        onChange={handleOnChange}
                                        variant="outlined"
                                        multiline
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                
                            </Grid>
                            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button variant='contained' color='error' onClick={() => setOpen(false)} endIcon={<MdOutlineCancel />}>Cancel</Button>
                                <Button type="submit" variant="contained" endIcon={<MdProductionQuantityLimits />}>Add</Button>
                            </DialogActions>
                        </form>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddProduct;