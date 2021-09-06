import mongoose from "mongoose";

const profileSchema = mongoose.Schema({
        title: { 
           type:String,
        },
        description: {
            type: String,
        },
        pic: {
           type:String,
         //   required: true,
         //   default: '../assets/IMG-20210524-WA0001.jpg/',
        },
        name:{
           type:String,
        },
        age:{
           type:String,
        },
        nationality:{
           type:String,
        },
        language:{
           type:String,
        },
        location:{
           type:String,
        },
        spec:{
           type:String,
        },
        resume: {
         type:String,
         // required: true,
         // default: '../assets/resumee.pdf'
      },
          },
       {
           timestamps: true
        },

  );
  
 const Profile = mongoose.model("Profile", profileSchema); 
export default Profile;
