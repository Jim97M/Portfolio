import mongoose from "mongoose";

const portfolioSchema = mongoose.Schema({
    category:{
        type:String,
    },
    image:{
        type:String,
        required:true,
        default:''
    },
   link:{
       type:String,
   },
   title:{
       type:String,
   },
   text:{
       type:String,
   },

});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;