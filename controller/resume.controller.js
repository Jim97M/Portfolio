import asyncHandler from 'express-async-handler';
import Resume from '../models/resume.model.js';

export const createResume = asyncHandler(async(req,res) => {
    const {year,title,subTitle,text} = req.body;

    const resume = await Resume.create({
        year,
        title,
        subTitle,
        text
    });

    if(resume){
        res.json({
            _id : resume._id,
            year: resume.year,
            title: resume.title,
            subTitle: resume.subTitle,
            text: resume.text
          
        })
    }else{
        res.status(400);
        throw new Error("Error");
    }
    res.json({
        year,
        title,
        subTitle,
        text
    });
});

export const getResume = asyncHandler(async(req, res) => {

    const resume = await Resume.find({});
    res.json(resume);
});

export const getResumeById = asyncHandler(async(req, res) => {

    const resume = await Resume.findById(req.params.id);
    
    if(resume){
        res.json(resume)
    }else{
        res.status(404).send({message:"Resume Not Found"});
        res.status(404);
        throw new Error("Error");
    }
    res.json(resume);
})