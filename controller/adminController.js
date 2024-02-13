const categoryModel = require('../models/categoryModel')
const subcategoryModel = require('../models/subcategoryModel')

// Dashboard
const dashboard = async (req,res) => {
    try{
        let categories = await categoryModel.find({})  // Get all Categories from the
        return res.render('admin/dashboard',{categories})
    } catch(err) {

    }
}


// Product
const product = (req,res) => {
    return res.render('admin/product')
}
const addProduct = (req,res) => {
    return res.render('admin/add-product')
}


// Category
const category = async (req,res) => {
    try{
        let category = await categoryModel.find()
        if(category){
            return res.render('admin/category',{category})
        }
    }catch(err){
        console.log(err);
        return false
    }

}
const addCategory = (req,res) => {
    return res.render('admin/add-category')
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
        let allSubcategory = await subcategoryModel.find().populate('categoryId')
        if(allSubcategory){
            return res.render('admin/subcategory',{allSubcategory})
        }
    }catch(err){
        console.log(err);
        return false
    }

}
const addsubcategory =  async (req,res) => {
    try{
        let category = await categoryModel.find({status : 1});
        return res.render('admin/add-subcategory',{
            category
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
        let category = await categoryModel.find({status : 1})
        let single = await subcategoryModel.findById(id).populate('categoryId')
        return res.render('admin/edit-subcategory', {single,category})
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



module.exports = {
    dashboard,
    product,
    addProduct,
    
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
    updateSubategory
}