import mongoose from "mongoose";

const resumeSchema = mongoose.Schema({
    year:{
        type:String,      
     },
     title:{
        type:String,
     },
    subTitle:{
        type:String,
        required:true,
        default:'./assets/intelligence.svg',
     },
      text:{
        type:String,
        required:true,
        default:'./assets/design.svg',
     },
});

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
