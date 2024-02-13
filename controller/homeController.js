const categoryModel = require('../models/categoryModel')
const subcategoryModel = require('../models/subcategoryModel')

const home = async (req,res) => {
    try{
        let category = await categoryModel.find({status : 1})
        let subcategory = await subcategoryModel.find({}).populate("categoryId");
        return res.render('index', {category,subcategory})
    } catch(err) {
        console.log(err);
        return false
    }
}

// const home = (req,res) => {
//     return res.render('index')
// }

module.exports = {
    home
}