import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, Box } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const ImportProduct = ({ getProductInfo }) => {
    const [file, setFile] = useState(null);
    const authToken = localStorage.getItem("Authorization");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleImport = async () => {
        if (!file) {
            toast.error("Please choose a file to import");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            try {
                for (const product of jsonData) {
                    await axios.post("http://localhost:3000/products", {
                        name: product.name,
                        price: product.price,
                        rating: product.rating,
                        category: product.category,
                        quantity: product.quantity,
                        description: product.description,
                        author: product.author || '',
                        brand: product.brand || '',
                        imageUrl: product.imageUrl || '', // Có thể để trống nếu không dùng ảnh
                    }, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                }
                toast.success("Products imported successfully");
                getProductInfo(); // Load lại danh sách sản phẩm
                setFile(null);
            } catch (error) {
                console.error("Error importing products:", error);
                toast.error("Failed to import products");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <Box sx={{ mt: 2 }}>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <Button variant="contained" sx={{ ml: 2 }} onClick={handleImport}>
                Import Excel
            </Button>
        </Box>
    );
};

export default ImportProduct;
