const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true
    },
    categoryDescription: {
        type: String,
        required: true,
        trim: true
    },
    categoryType: {
        type: String,
        required: true,
        trim: true
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

module.exports = mongoose.model('Category', categorySchema) //categories