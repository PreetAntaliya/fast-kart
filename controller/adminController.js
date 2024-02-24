const categoryModel = require('../models/categoryModel')
const subcategoryModel = require('../models/subcategoryModel')
const exsubcategoryModel = require('../models/exsubcategory')
const productModel = require('../models/productModel')
const fs = require("fs");

// Dashboard
const dashboard = async (req,res) => {
    try{
        let user = req.user
        let categories = await categoryModel.find({}) 
        return res.render('admin/dashboard',{categories,user})
    } catch(err) {

    }
}


// Product
const product = async (req,res) => {
    try{
        let user = req.user
        let product = await productModel.find({}).populate('categoryId').populate('subcategoryId')
        return res.render('admin/product',{user,product})
    }catch(err){
        console.log(err);
        return false
    }
}
const addProduct = async(req,res) => {
    try{
        let user = req.user
        let category = await categoryModel.find({})
        let subcategory = await subcategoryModel.find({})
        let excategory = await exsubcategoryModel.find({})
        return res.render('admin/add-product',{user,category,subcategory})
    }catch(err){
        console.log(err);
        return false
    }
}

const createProduct = async (req,res) => {
    try{
        const {categoryId,subcategoryId,productName,productQty,productPrice,productDescription} = req.body
        const productImg = req.files.map(file => file.path)
        const productCreate = await productModel.create({
            categoryId,
            subcategoryId,
            productName,
            productQty,
            productPrice,
            productDescription,
            productImg
        })
        return res.redirect('back')
    }catch(err) {
        console.log(err);
        return false
    }
}

const categoryFilterProduct = async(req,res) => {
    try{
        let id = req.query.id;
        console.log(id);
        let subcategory = await subcategoryModel.find({}).populate('categoryId')
        var ans = subcategory.filter((val)=>{
            return val.categoryId._id == id
        })
        return res.json(
            ans
        )
    }catch(err){
        console.log(err);
        return false
    }
}

const editProductPage = async (req,res) => {
    try{
        let id= req.query.id
        let user = req.user
        let category = await categoryModel.find({status : 1})
        let subcategory = await subcategoryModel.find({})
        let single = await productModel.findById(id).populate('subcategoryId').populate('categoryId')
        return res.render('admin/edit-product', {single,category,subcategory,user})
    } catch(err) {
        console.log(err);
        return false
    }
}

const updateProduct = async (req,res) => {
    try{
        const {id,categoryId,subcategoryId,productName,productQty,productPrice,productDescription} = req.body
        console.log(req.body);
        const productCreate = await productModel.findByIdAndUpdate(id,{
            categoryId,
            subcategoryId,
            productName,
            productQty,
            productPrice,
            productDescription,
        })
        return res.redirect('/product')
    }catch(err){
        console.log(err);
        return false
    }
}

const deleteProduct = async(req,res) => {
    try{
        let imgRecord = await productModel.findById(req.query.id)
        let imgPath = imgRecord.productImg
        imgPath.map((img) => {
            fs.unlinkSync(img)
        })

        let record = await productModel.findByIdAndDelete(req.query.id);
        return res.redirect('back')

    } catch(err) {
        console.log(err);
        return false
    }
}


// Category
const category = async (req,res) => {
    try{
        let user = req.user
        let category = await categoryModel.find()
        if(category){
            return res.render('admin/category',{category,user})
        }
    }catch(err){
        console.log(err);
        return false
    }

}
const addCategory = (req,res) => {
    let user = req.user
    return res.render('admin/add-category',{user})
}
const categoryCreate = async (req,res) => {
    const {categoryName, categoryIcon} = req.body

    try{ 
        let category = categoryModel.create({
            categoryName,
            categoryIcon
        })

        if(category){
           return res.redirect('back')
        }

    } catch(err){
        console.log(err);
        return false
    }
}
const deleteCategory = async (req,res) => {
    try{
        let id = req.query.id
        await categoryModel.findByIdAndDelete(id)
        await subcategoryModel.deleteMany({categoryId : id})
        return res.redirect('back')
    } catch(err){
        console.log(err);
        return false
    }
}
const categoryActive = async(req,res) => {
    try{
        let id = req.query.id;
        let status = 0;
        let up = await categoryModel.findByIdAndUpdate(id,{
            status : status
        })
        req.flash('success',"Category successfully changed!");
        return res.redirect('back');
    }catch(err){
        console.log(err);
        return false;
    }
}
const categoryDective = async(req,res) => {
    try{
        let id = req.query.id;
        let status = 1;
        let up = await categoryModel.findByIdAndUpdate(id,{
            status : status
        })
        req.flash('success',"Category successfully changed!");
        return res.redirect('back');
    }catch(err){
        console.log(err);
        return false;
    }
}


// Sub Category
const subcategory = async (req,res) => {
    try{
        let user = req.user
        let allSubcategory = await subcategoryModel.find().populate('categoryId')
        if(allSubcategory){
            return res.render('admin/subcategory',{allSubcategory,user})
        }
    }catch(err){
        console.log(err);
        return false
    }

}
const addsubcategory =  async (req,res) => {
    try{
        let user = req.user
        let category = await categoryModel.find({status : 1});
        return res.render('admin/add-subcategory',{
            category,user
        });
    }catch(err){
        console.log(err);
        return false;
    }
}
const subcategoryCreate = async (req,res) => {
    const {subcategoryName,categoryId } = req.body

    try{ 
        let category = subcategoryModel.create({
            subcategoryName,
            categoryId
        })

        if(category){
           return res.redirect('back')
        }

    } catch(err){
        console.log(err);
        return false
    }
}
const deleteSubcategory = async (req,res) => {
    try{
        let id = req.query.id
        console.log(id);
        let deleteSub = await subcategoryModel.findByIdAndDelete(id)
        return res.redirect('back')
    } catch(err){
        console.log(err);
        return false
    }
}
const editSubcategoryPage = async (req,res) => {
    try{
        let id= req.query.id
        let user = req.user
        let category = await categoryModel.find({status : 1})
        let single = await subcategoryModel.findById(id).populate('categoryId')
        return res.render('admin/edit-subcategory', {single,category,user})
    } catch(err) {
        console.log(err);
        return false
    }
}

const updateSubategory = async (req,res) => {
    try{
        const {subcategoryName , categoryId}= req.body;
        let update = await subcategoryModel.findByIdAndUpdate(req.body.id,{
            categoryId,
            subcategoryName,
        })
        return res.redirect('/subcategory')
    }catch(err) {
        console.log(err);
        return false
    }
}
const categoryFilter = async(req,res) => {
    try{
        let id = req.query.id;
        let subcategory = await subcategoryModel.find({}).populate('categoryId')
        var ans = subcategory.filter((val)=>{
            return val.categoryId._id == id
        })
        return res.json(
            ans
        )
    }catch(err){
        console.log(err);
        return false
    }
}



// Ex Sub Category
const exsubcategory = async (req,res) => {
    try{
        let user = req.user
        let excategory = await exsubcategoryModel.find().populate('subcategoryId').populate('categoryId')
        if(excategory){
            return res.render('admin/excategory',{excategory,user})
        }
    }catch(err){
        console.log(err);
        return false
    }

}
const addexsubcategory =  async (req,res) => {
    try{
        let user = req.user
        let category = await categoryModel.find({status : 1});
        let subcategory = await subcategoryModel.find({})
        return res.render('admin/add-excategory',{
            category,subcategory,user
        });
    }catch(err){
        console.log(err);
        return false;
    }
}
const exsubcategoryCreate = async (req,res) => {
    const {subcategoryId,categoryId, exsubcategory } = req.body

    try{ 
        let category = exsubcategoryModel.create({
            subcategoryId,
            categoryId,
            exsubcategory
        })

        if(category){
           return res.redirect('back')
        }

    } catch(err){
        console.log(err);
        return false
    }
}
const deleteexSubcategory = async (req,res) => {
    try{
        let id = req.query.id
        let deleteSub = await exsubcategoryModel.findByIdAndDelete(id)
        return res.redirect('back')
    } catch(err){
        console.log(err);
        return false
    }
}
const editexSubcategoryPage = async (req,res) => {
    try{
        let id= req.query.id
        let user = req.user
        let category = await categoryModel.find({status : 1})
        let subcategory = await subcategoryModel.find({})
        let single = await exsubcategoryModel.findById(id).populate('subcategoryId').populate('categoryId')
        return res.render('admin/edit-excategory', {single,category,subcategory,user})
    } catch(err) {
        console.log(err);
        return false
    }
}

const updateexSubategory = async (req,res) => {
    try{
        const {subcategoryId , categoryId, exsubcategory}= req.body;
        let update = await exsubcategoryModel.findByIdAndUpdate(req.body.id,{
            categoryId,
            subcategoryId,
            exsubcategory
        })
        return res.redirect('/exsubcategory')
    }catch(err) {
        console.log(err);
        return false
    }
}


const profile = async (req,res) => {
    try{
        let user = req.user
        return res.render('admin/profile',{user})
    }catch(err){
        console.log(err);
        return false
    }
}



module.exports = {
    dashboard,
    product,
    addProduct,
    categoryFilterProduct,
    createProduct,
    editProductPage,
    updateProduct,
    deleteProduct,
    
    category,
    addCategory,
    categoryCreate,
    deleteCategory,
    categoryActive,
    categoryDective,

    subcategory,
    addsubcategory,
    subcategoryCreate,
    deleteSubcategory,
    editSubcategoryPage,
    updateSubategory,
    categoryFilter,

    exsubcategory,
    addexsubcategory,
    exsubcategoryCreate,
    deleteexSubcategory,
    editexSubcategoryPage,
    updateexSubategory,

    profile,

}