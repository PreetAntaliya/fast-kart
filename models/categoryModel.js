const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    categoryName : {
        type : String,
        required : true
    },
    categoryIcon : {
        type : String,
        require : true
    },
    date :{
        type : Date,
        default :Date.now
    },
    status : {
        type : Number,
        default : 1
    }
})

const category = mongoose.model('category',categorySchema)
module.exports = category