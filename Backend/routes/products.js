var express = require('express');
var router = express.Router();
let productSchema = require('../schemas/product')
let categorySchema = require('../schemas/category')
let slugify = require('slugify')
/* GET users listing. */
router.get('/', async function (req, res, next) {
    let query = req.query;
    console.log(query);
    let objQuery = {isDeleted: false };
    if (query.name) {
        objQuery.name = new RegExp(query.name, 'i')
    } else {
        objQuery.name = new RegExp("", 'i')
    }
    objQuery.price = {};
    if (query.price) {
        if (query.price.$gte) {
            objQuery.price.$gte = Number(query.price.$gte);
        } else {
            objQuery.price.$gte = 0;
        }
        if (query.price.$lte) {
            objQuery.price.$lte = Number(query.price.$lte);
        } else {
            objQuery.price.$lte = 10000;
        }
    } else {
        objQuery.price.$lte = 10000;
        objQuery.price.$gte = 0;
    }

    let products = await productSchema.find(objQuery).populate(
        { path: 'category', select: 'name' }
    );
    res.send(products);
});

router.get('/categoryid', async function (req, res, next) {
    let query = req.query;
    let objQuery = { isDeleted: false }; // Chỉ lấy sản phẩm chưa bị xóa

    if (query.category) {
        let category = await categorySchema.findOne({ name: query.category });
        if (category) {
            objQuery.category = category._id; // Lọc theo ID của danh mục
        } else {
            return res.status(404).send({ success: false, message: "Category not found" });
        }
    }

    try {
        let products = await productSchema.find(objQuery).populate(
            { path: 'category', select: 'name' }
        );
        res.status(200).send(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        let product = await productSchema.findById(req.params.id);
        res.send({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        })
    }
});
router.post('/', async function (req, res, next) {
    try {
        let body = req.body;
        console.log("Received body:", body);
        
        let imageUrl = body.imageUrl || ''; // Kiểm tra ảnh từ frontend
        
        if (!imageUrl) {
            return res.status(400).send({
                success: false,
                message: "Image URL is missing"
            });
        }
        
        console.log("Image URL:", imageUrl); // Đảm bảo URL được truyền về đúng
        
        let category = await categorySchema.findOne({ name: body.category });
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            });
        }
        
        console.log("Category found:", category); // Log category để kiểm tra _id
        
        let newProduct = new productSchema({
            name: body.name,
            price: body.price ? body.price : 1000,
            quantity: body.quantity ? body.quantity : 10,
            category: category._id,
            slug: slugify(body.name, { lower: true }),
            imgURL: imageUrl, // Lưu URL ảnh vào database
        });
        
        console.log("New product object:", newProduct); // Log newProduct trước khi lưu
        
        await newProduct.save()
            .then(result => {
                console.log("Product saved:", result); // Log kết quả lưu vào database
                res.status(200).send({
                    success: true,
                    data: result
                });
            })
            .catch(error => {
                console.error("Error saving product:", error); // Log lỗi khi lưu sản phẩm
                res.status(500).send({
                    success: false,
                    message: error.message
                });
            });
    } catch (error) {
        console.error("Error occurred:", error); // Log toàn bộ lỗi
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});


router.put('/:id', async function (req, res, next) {
    try {
        let body = req.body;
        let updatedObj = {};

        // Cập nhật các trường cơ bản
        if (body.name) {
            updatedObj.name = body.name;
        }
        if (body.quantity) {
            updatedObj.quantity = body.quantity;
        }
        if (body.price) {
            updatedObj.price = body.price;
        }
        if (body.category) {
            let category = await categorySchema.findOne({ name: body.category });
            if (!category) {
                return res.status(404).send({
                    success: false,
                    message: "Category not found"
                });
            }
            updatedObj.category = category._id;
        }

        // Cập nhật URL ảnh
        if (body.imgURL) {
            updatedObj.imgURL = body.imgURL;
        }

        console.log("Updated product object:", updatedObj); // Log đối tượng cập nhật

        let updatedProduct = await productSchema.findByIdAndUpdate(req.params.id, updatedObj, { new: true });
        res.status(200).send({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error); // Log lỗi chi tiết
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});
router.delete('/:id', async function (req, res, next) {
    try {
        let body = req.body;
        let updatedProduct = await productSchema.findByIdAndUpdate(req.params.id, {
            isDeleted: true
        }, { new: true })
        res.status(200).send({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        })
    }
});


module.exports = router;
