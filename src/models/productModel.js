const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    currencyId: {
        type: String,
        required: true,
    },
    currencyFormat: {
        type: String,
        required: true,
    },
    isFreeShipping: {
        type: Boolean,
        default: false,
    },
    style: {
        type: String,
        trim: true
    },
    availableSizes: {
        type: [String],
        required: true
    },
    installments: {
        type: Number
    },
    categoryId: {
        type: ObjectId,
        ref: "Category",
        required: true,
        unique:true
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema) //products