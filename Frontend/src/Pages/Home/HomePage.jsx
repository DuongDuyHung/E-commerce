import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ContextFunction } from '../../Context/Context';
import CategoryCard from '../../Components/Category_Card/CategoryCard';
import Carousel from '../../Components/Carousel/Carousel';
import SearchBar from '../../Components/SearchBar/SearchBar';
import CopyRight from '../../Components/CopyRight/CopyRight';

// Ảnh mẫu import
import { GroupCloth, Shoes, Electronics, FemaleCloth, MaleCloth, Books, Jewelry } from '../../Assets/Images/Image';

const HomePage = () => {
    const { setCart } = useContext(ContextFunction);
    const [categories, setCategories] = useState([]);
    let authToken = localStorage.getItem('Authorization');

    useEffect(() => {
        getCategories();
        getCart();
        window.scrollTo(0, 0);
    }, []);

    // Lấy danh mục và gán ảnh theo thứ tự
    const getCategories = async () => {
        try {
            const res = await axios.get("http://localhost:3000/categories");
            const images = [GroupCloth, Shoes, Electronics, FemaleCloth, MaleCloth, Books, Jewelry]; // Mảng ảnh theo thứ tự
            const dataWithImages = res.data.map((category, index) => ({
                ...category,
                img: images[index % images.length], // Gán ảnh theo thứ tự, lặp lại nếu danh mục nhiều hơn số ảnh
            }));
            setCategories(dataWithImages);
        } catch (error) {
            console.error("Lỗi khi lấy categories:", error);
        }
    };

    const getCart = async () => {
        if (authToken !== null) {
            try {
                const { data } = await axios.get("http://localhost:3000/cart", {
                    headers: {
                        'Authorization': authToken
                    }
                });
                setCart(data);
            } catch (error) {
                console.error("Lỗi khi lấy giỏ hàng:", error);
            }
        }
    };

    return (
        <>
            <Container maxWidth='xl' style={{ display: 'flex', justifyContent: "center", padding: 0, flexDirection: "column", marginBottom: 70 }}>
                <Box padding={1}>
                    <Carousel />
                </Box>
                <Container style={{ marginTop: 90, display: "flex", justifyContent: 'center' }}>
                    <SearchBar />
                </Container>
                <Typography variant='h3' sx={{ textAlign: 'center', marginTop: 10, color: '#1976d2', fontWeight: 'bold' }}>
                    Categories
                </Typography>
                <Container maxWidth='xl' style={{ marginTop: 90, display: "flex", justifyContent: 'center', flexGrow: 1, flexWrap: 'wrap', gap: 20 }}>
                    {categories.map(data => (
                        <CategoryCard data={data} key={data.id || data.name} />
                    ))}
                </Container>
            </Container>
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    );
};

export default HomePage;