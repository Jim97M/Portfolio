import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
    icon:{
        type:String,
        required:true,
        default:'./assets/design.svg',
     },
     title:{
        type:String,
     },
     paragraph:{
        type:String,
     },
    link:{
       String,
    }
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
