const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'category',
        required : true
    },
    productName : {
        type : String,
        required : true
    },
    productImg : {
        type : String,
        required : true
    },
    productQty : {
        type : String,
        required : true
    },
    productPrice : {
        type : String,
        required : true
    },
})

const product = mongoose.model('product',productSchema)
module.exports = product