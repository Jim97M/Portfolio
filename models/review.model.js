import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    name:{
        type:String,
    },
    comment:{
        type:String,
    },
},
    {
        timestamps:true
    }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;