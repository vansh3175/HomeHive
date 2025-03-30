const mongoose = require('mongoose');
const {Schema} = mongoose;
const { ref } = require('joi');


const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    date:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;