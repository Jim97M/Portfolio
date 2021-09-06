import Service from "../models/service.model.js";
import asyncHandler from 'express-async-handler';

//Create and Save a new Tutorial
export const createService = asyncHandler(async(req, res) => {
    //Validate request
   //  if(!req.body.title){
   //      res.status(400).send("Request body cannot be found")
   //  }

   //  //Create a Tutorial
   //  const service = new Service({
   //     title: req.body.title,
   //     description: req.body.description,
   //  });

    //Save Service in the Database
const {icon, title, paragraph} = req.body;

const service = await Service.create({
   icon,
   title,
   paragraph
});

if(service){
   res.json({
      _id:service._id,
      icon:service.icon,
      title:service.title,
      paragraph:service.paragraph
   });
}else{
   res.status(400);
   throw new Error("Error")
}
res.json({
   icon,
   title,
   paragraph 
})
  
//     service
//        .save(service)
//        .then(data=> {
//           res.send(data);
//        }).catch(err = {
           
//        })
// });

// export const getUsers =  asyncHandler(async(req,res) => {
//    const users = await Service.find({});
//    res.json(users);
// }) 

//getUserById function to retrieve user by id
// export const getUserById = asyncHandler(async(req,res) => {
//    const user = await Service.findById(req.params.id)

//    //if user id match param id send user else throw error
//    if(user){
//       res.json(user)
//    }else{
//       res.status(404).json({message: "User not found"})
//       res.status(404)
//       throw new Error('User not found')
//    }
// })

// const findAll = (req,res) => {
//    const title = req.query.title
//    const condition = title ? {title: {$regex: new new RegExp(title), $options:"i"}} : {}

//    Service.find(condition)
//       .then(data => {
//          res.send(data)
//       }).catch(err => {
//          res.status(500).send({
//             message:
//                err.message || "Some error occurred while retrieving tutorials",
//          });
//       });
// };

// const findOne = (req, res) => {
//    const id = req.params.id;
//    Service.findOne(id)
//      .then(data => {
//         if(!data){
//            res.status(400).send({ message: "Not found tutorial with id" + id});
//         }
//         res.send(data);
//      }).catch(err)
//      {
//         res.status(500).send({message: "Error retrieving service with id" + id});
//      }
//    }

   //getUsers functions to get all users

});

export const getService = asyncHandler(async(req, res) => {

   const service = await Service.find({});

   res.json(service);

});

export const getServiceById = asyncHandler(async(req, res) => {
   const service = await Service.findById(req.params.id);

   if(service){
      res.json(service);
   } else {
      res.status(404).send({message: "Service not Found"});
      res.status(404);
      throw new Error("Error");
   }
   res.json(service);
});
