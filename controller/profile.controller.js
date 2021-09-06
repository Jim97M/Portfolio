import asyncHandler from 'express-async-handler';
import Profile from '../models/profile.model.js';

export const createProfile = asyncHandler(async(req, res)=> {
     const{title,description,pic,resume,name,age,nationality,language,location,spec} = req.body;

     const profile = await Profile.create({
           title,
           description,
           pic,
           name,
           age,
           nationality,
           language,
           location,
           spec,
           resume
     });
     if(profile){
         res.json({
            _id:profile._id,
            title:profile.title,
            description:profile.description,
            pic:profile.pic,
            name:profile.name,
            age:profile.age,
            nationality:profile.nationality,
            language:profile.language,
            location:profile.location,
            spec:profile.spec,
            resume:profile.resume
         })
          }
     else{
        res.status(400);
        throw new Error("Error");

    }
    res.json({
        title,
        description,
        pic,
        name,
        age,
        nationality,
        language,
        location,
        spec,
        resume
    });
});

export const getProfile= asyncHandler(async(req,res) => {
    const profile = await Profile.find({});
    res.json(profile);
});

export const getProfileId = asyncHandler(async(req,res) => {
    const profile = await Profile.findById(req.params.id)

    if(profile){
        res.json(profile)
    }else{
        res.status(404).json({message: "Profile not Found"})
        res.status(404)
        throw new Error('Profile not Found');
    }
    res.json(profile);
})
