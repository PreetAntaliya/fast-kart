const mongoose = require('mongoose')

const subcategorySchema = mongoose.Schema({
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'category',
        required : true
    },
    subcategoryName : {
        type : String,
        required : true
    },
})

const subcategory = mongoose.model('subcategory',subcategorySchema)
module.exports = subcategory