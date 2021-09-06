import express from 'express';
import {createBlog, getBlog, getBlogById} from '../controller/blog.controller.js';
const router = express.Router();

router.route('/blog').post(createBlog);

//Get a blog
router.route('/blog').get(getBlog);

//Get Blog By Id
router.route('/blog:id').get(getBlogById)

export default router;
