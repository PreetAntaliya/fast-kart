const express =require('express')
const api = express.Router()
const categoryModel = require('../models/categoryModel')
const subcategoryModel = require('../models/subcategoryModel')
const exsubcategoryModel = require('../models/exsubcategory')
const cors = require('cors');
api.use(cors());

api.get('/category', async (req, res) => {
    try {
        const category = await categoryModel.find({});
        const userArray = category.map(cate => ({
            categoryName: cate.categoryName,
            categoryIcon: cate.categoryIcon,
            date: cate.date,
            status: cate.status,
        }));
        

        // Set response headers for JSON with indentation
        res.header('Content-Type', 'application/json');
        // Use res.json with options to specify JSON formatting (indentation)
        res.json(userArray, null, 2); // The third argument '2' specifies the number of spaces for indentation
    } catch (err) {
        console.log(err);
        // Consider sending an error response if an error occurs
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = api