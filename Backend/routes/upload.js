const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import module fs
const router = express.Router();

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
}

// Cấu hình multer để lưu ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Thư mục lưu ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên file duy nhất
    }
});

const upload = multer({ storage });

// API để upload ảnh
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        res.status(200).json({ success: true, imageUrl: `/uploads/${req.file.filename}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;