import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    title:{
        type:String,
    },
    date:{
        type:Date
    },
    image:{
        type:String,
        required:true,
        default:''
    },
    link:{
        type:String,
    }
})

const Blog = mongoose.model("Blog", blogSchema);
export default Blog
