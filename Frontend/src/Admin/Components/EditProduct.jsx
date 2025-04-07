import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Grid, MenuItem } from '@mui/material';

const EditProduct = ({ productId, onCancel, onSave }) => {
    const [product, setProduct] = useState({
        name: '',
        quantity: '',
        price: '',
        category: '',
        imgURL: '',
    });

    const [categories, setCategories] = useState([]); // Danh sách các category
    const [previewImage, setPreviewImage] = useState(''); // URL ảnh tạm thời

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log("Fetching product with ID:", productId); // Log ID trước khi gọi API
                const { data } = await axios.get(`http://localhost:3000/products/${productId}`);
                console.log("Fetched product:", data); // Log dữ liệu sản phẩm
                setProduct({
                    name: data.data.name,
                    quantity: data.data.quantity,
                    price: data.data.price,
                    category: data.data.category?.name || '', // Hiển thị tên category
                    imgURL: data.data.imgURL || '', // Hiển thị URL ảnh
                });
                setPreviewImage(`http://localhost:3000${data.data.imgURL}` || ''); // Hiển thị ảnh ban đầu
            } catch (error) {
                console.error("Error fetching product:", error); // Log lỗi chi tiết
            }
        };

        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/categories`);
                console.log("Fetched categories:", data); // Log danh sách category
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error); // Log lỗi chi tiết
            }
        };

        if (productId) {
            fetchProduct();
            fetchCategories();
        } else {
            console.error("Error: productId is undefined"); // Log lỗi nếu productId không tồn tại
        }
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file); // 'image' là tên field trong multer

            try {
                const response = await axios.post('http://localhost:3000/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const imageUrl = response.data.imageUrl; // Đường dẫn ảnh trả về từ server
                setPreviewImage(`http://localhost:3000${imageUrl}`); // Hiển thị ảnh tạm thời
                setProduct({
                    ...product,
                    imgURL: imageUrl, // Lưu đường dẫn ảnh tương đối vào state
                });
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Updating product with ID:", productId); // Log ID trước khi gọi API
            console.log("Product data being sent:", product); // Log dữ liệu sản phẩm
            const category = categories.find((cat) => cat.name === product.category); // Lấy ID category từ tên
            await axios.put(`http://localhost:3000/products/${productId}`, {
                ...product,
                category: category?._id, // Gửi ID category thay vì tên
            });
            console.log("Product updated successfully"); // Log khi cập nhật thành công
            onSave(); // Gọi lại hàm onSave để refresh danh sách sản phẩm
        } catch (error) {
            console.error("Error updating product:", error); // Log lỗi chi tiết
        }
    };

    return (
        <Container>
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Product Name"
                            variant="outlined"
                            fullWidth
                            value={product.name}
                            name="name"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={product.quantity}
                            name="quantity"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Price"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={product.price}
                            name="price"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Category"
                            variant="outlined"
                            fullWidth
                            value={product.category}
                            name="category"
                            onChange={handleChange}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat._id} value={cat.name}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Image URL"
                            variant="outlined"
                            fullWidth
                            value={product.imgURL}
                            name="imgURL"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleImageChange}
                            style={{ marginTop: '10px' }}
                        />
                        {previewImage && (
                            <div style={{ marginTop: '20px' }}>
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                                />
                            </div>
                        )}
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                    Save Changes
                </Button>
                <Button onClick={onCancel} variant="outlined" color="secondary" style={{ marginLeft: '10px' }}>
                    Cancel
                </Button>
            </form>
        </Container>
    );
};

export default EditProduct;