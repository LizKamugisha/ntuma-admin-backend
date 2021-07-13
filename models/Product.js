// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   productName: String,
//   productType: String,
//   price: String,
//   quantity: String,
//   image: String,
// });

// module.exports = mongoose.model("Product", productSchema);

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    }, 
    detailedDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type:String
    }],
    price: {
        type: Number,
        default:0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock:{
        type: Number,
        required: true,
        min: 0,
    },
    rating:{
        type: Number,
        default: 0
    },
    numReviews:{
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});

productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productSchema.set('toJSON', {virtuals:true});

exports.Product = mongoose.model('Product', productSchema);