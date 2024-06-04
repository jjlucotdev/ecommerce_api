const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    remarks: {
        type: String,
        required: [true, 'Remarks are required']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});


const productSchema = new mongoose.Schema({
	name:{
		type: String,
		required: [true, 'Name is required']
	},
	description:{
		type: String,
		required: [true, 'Description is required']
	},
	category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
	price:{
		type: Number,
		required: [true, 'Price is required']
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
    reviews: [reviewSchema]
});

module.exports = mongoose.model("Product", productSchema);