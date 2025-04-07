import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle
} from '@mui/material';
import axios from 'axios';

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get("http://localhost:3000/categories");
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleOpenAdd = () => {
        setFormData({ name: '', description: '' });
        setEditId(null);
        setOpen(true);
    };

    const handleOpenEdit = async (id) => {
        try {
            const res = await axios.get(`http://localhost:3000/categories/${id}`);
            if (res.data.success) {
                const { name, description } = res.data.data;
                setFormData({ name, description });
                setEditId(id);
                setOpen(true);
            }
        } catch (error) {
            console.error("Error fetching category:", error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (editId) {
                await axios.put(`http://localhost:3000/categories/${editId}`, formData);
            } else {
                await axios.post(`http://localhost:3000/categories`, formData);
            }
            fetchCategories();
            handleClose();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
        try {
            await axios.delete(`http://localhost:3000/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpenAdd} style={{ margin: '10px 0' }}>
                Thêm danh mục
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Category Name</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category._id}>
                                <TableCell align="center">{category.name}</TableCell>
                                <TableCell align="center">{category.description || "N/A"}</TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="primary" size="small" onClick={() => handleOpenEdit(category._id)}>
                                        Edit
                                    </Button>
                                    <Button variant="outlined" color="secondary" size="small" style={{ marginLeft: '10px' }} onClick={() => handleDelete(category._id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog Add/Edit */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Tên danh mục"
                        name="name"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Mô tả"
                        name="description"
                        fullWidth
                        value={formData.description}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editId ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CategoryTable;
