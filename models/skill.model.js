import mongoose from "mongoose";

const skillSchema = mongoose.Schema({
    title:{
        type:String,
     },
     width:{
        type:Number,
     },
     text:{
        type:Number,
     },
});

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
