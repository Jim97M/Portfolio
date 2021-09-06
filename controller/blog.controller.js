import asyncHandler from 'express-async-handler';
import Blog from '../models/blog.model.js';

export const createBlog = asyncHandler(async(req,res) => {
    const {title,date,image,link} = req.body;

    const blog = await Blog.create({
        title,
        date,
        image,
        link
    });

    if(blog){
        res.json({
            _id : blog._id,
            title: blog.title,
            date: blog.date,
            image: blog.image,
            link: blog.link
          
        })
    }else{
        res.status(400);
        throw new Error("Error");
    }
    res.json({
        title,
        date,
        image,
        link
    });
});

export const getBlog = asyncHandler(async(req,res) => {
    const blog = await Blog.find({});
    res.json(blog);
});

export const getBlogById = asyncHandler(async(req,res) => {
    const blog = await Blog.findById(req.params.id)

    if(blog){
        res.json(blog);
    }else{
        res.status(404).json({message: "Blog not Found"})
        res.status(404);
        throw new Error('Blog not Found');
    }
    res.json(blog);
})
