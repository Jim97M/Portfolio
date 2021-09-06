import asyncHandler from 'express-async-handler';
import Skill from '../models/skill.model.js';
  
export const createSkill = asyncHandler(async(req,res) => {
    const {title,width,text} = req.body;

    const skill = await Skill.create({
        title,
        width,
        text
    });

    if(skill){
        res.json({
            _id :skill._id,
            title: skill.title,
            width: skill.width,
            text: skill.text
          
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

export const getSkill = asyncHandler(async(req, res) => {

    const skill = await Skill.find({});

    res.json(skill);

});

export const getSkillById = asyncHandler(async(req, res) => {
    
    const skill = await Skill.findById(req.params.id);

    if(skill){
        res.json(skill);
    }else{
        res.status(404).send({message:"Skill Not Found"})
    }
    res.json(skill);
})