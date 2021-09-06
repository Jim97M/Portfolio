import express from 'express';
import {createReview,getReview,getReviewId} from '../controller/review.controller.js';
const router = express.Router();

//Create review
router.route('/review').post(createReview);

//Get Review
router.route('/review').get(getReview);

//Get review by id
router.route('/review:id').get(getReviewId);

export default router;