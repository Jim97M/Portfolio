import asyncHandler from 'express-async-handler';
import Review from '../models/review.model.js';

export const createReview = asyncHandler(async(req,res) => {
    const {name, comment} = req.body;

    const review = await Review.create({
        name,
        comment
    });

    if(review){
        res.json({
            _id:review._id,
            name: review.title,
            comment:review.comment
          
        })
    }else{
        res.status(400);
        throw new Error("Error");
    }
    res.json({
        name,
        comment
    });
});

export const getReview = asyncHandler(async(req,res) => {
    const review = await Review.find({});
    res.json(review);
});

export const getReviewId = asyncHandler(async(req,res) => {
    const review = await Review.findById(req.params.id)

    if(review){
        res.json(review)
    }else{
        res.status(404).json({message: "Review not Found"})
        res.status(404)
        throw new Error('Review not Found');
    }
    res.json(review);
})



