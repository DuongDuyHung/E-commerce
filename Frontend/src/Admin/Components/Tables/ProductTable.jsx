import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import { AiOutlineSearch } from 'react-icons/ai';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    InputAdornment,
    TextField,
    IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddProduct from '../AddProduct';
import EditProduct from '../EditProduct'; // Import EditProduct component
import { FaEdit, FaTrash } from 'react-icons/fa';
import ImportProduct from '../ImportProduct';

const ProductTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Trạng thái hiển thị form chỉnh sửa
    const [editProductId, setEditProductId] = useState(null); // ID sản phẩm cần chỉnh sửa

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170, align: 'center' },
        { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
        { id: 'category', label: 'Category', minWidth: 100, align: 'center' },
        { id: 'price', label: 'Price', minWidth: 100, align: 'center' },
        { id: 'quantity', label: 'Quantity', minWidth: 100, align: 'center' },
        { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
    ];

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:3000/products");
            setData(data);
            setFilteredData(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const filterData = () => {
        if (searchTerm === '') return data;
        return data.filter(
            (item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.price.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.quantity.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        setFilteredData(filterData());
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/products/${id}`);
            fetchProducts(); // Refresh the list after deletion
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleEdit = (id) => {
        console.log("Editing product with ID:", id);  // Debug: Log ID to verify it's being passed correctly
        setEditProductId(id); // Lưu ID sản phẩm cần chỉnh sửa
        setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
    };

    const handleCancelEdit = () => {
        setIsEditing(false); // Quay lại chế độ xem danh sách sản phẩm
        setEditProductId(null); // Xóa ID sản phẩm cần chỉnh sửa
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        setFilteredData(filterData());
    }, [data, searchTerm]);

    return (
        <>
            {isEditing ? (
                <EditProduct
                    productId={editProductId}
                    onCancel={handleCancelEdit}
                    onSave={() => {
                        fetchProducts();      // Load lại danh sách
                        setIsEditing(false);  // Thoát khỏi form edit
                        setEditProductId(null); // Xóa ID đang chỉnh sửa
                    }}
                />
            ) : (
                <>
                    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 5, marginTop: 5 }}>
                        <TextField
                            id="search"
                            type="search"
                            label="Search Products"
                            value={searchTerm}
                            onChange={handleSearch}
                            sx={{ width: { xs: 350, sm: 500, md: 800 } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <AiOutlineSearch />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Container>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
    <AddProduct getProductInfo={fetchProducts} />
    <ImportProduct getProductInfo={fetchProducts} />
</Box>

                    <Paper style={{ overflow: "auto", maxHeight: "500px" }}>
                        <TableContainer sx={{ maxHeight: '500px' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead sx={{ position: 'sticky', top: 0 }}>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, color: "#1976d2", fontWeight: 'bold' }}>
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length}>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <h4>Product not found.</h4>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredData.map((prod) => (
                                            <TableRow key={prod._id}>
                                                <TableCell component="th" scope="row" align="center">
                                                    <Link to={`/admin/home/product/${prod.slug}/${prod._id}`}>
                                                        {prod.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <img
                                                        src={`http://localhost:3000${prod.imgURL}`}
                                                        alt={prod.name}
                                                        style={{ width: "100px", height: "100px", objectFit: "contain" }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">{prod.category?.name || "N/A"}</TableCell>
                                                <TableCell align="center">{prod.price}</TableCell>
                                                <TableCell align="center">{prod.quantity}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={() => handleEdit(prod._id)}>
                                                        <FaEdit color="green" />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDelete(prod._id)}>
                                                        <FaTrash color="red" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            )}
        </>
    );
};

export default ProductTable;
