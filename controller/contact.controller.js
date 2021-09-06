import asyncHandler from 'express-async-handler';
import Blog from '../models/blog.model.js';

export const createBlog = asyncHandler(async(req,res) => {
    const {title,width,text} = req.body;

    const blog = await Blog.create({
        title,
        width,
        text
    });

    if(blog){
        res.json({
            _id = blog._id,
            title: blog.title,
            width: blog.width,
            text: blog.text
          
        })
    }else{
        res.status(400);
        throw new Error("Error");
    }
    res.json({
        title,
        width,
        text
    });
});

export const getContact = asyncHandler(async(req,res) => {
    const contact = await Contact.find({});
    res.json(contact);
});

export const getContactById = asyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id)

    if(contact){
        res.json(contact)
    }else{
        res.status(404).json({message: "Contact NotFound"})
        res.status(404)
        throw new Error('Contact not Found');
    }
    res.json(contact);
})
