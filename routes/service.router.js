import express from "express";
import {createService, getService, getServiceById} from "../controller/service.controller.js";
const router = express.Router();


    // Express router method to create route for getting all users
    router.route('/service').post(createService);
     
    
    //Get a service
    router.route('/service').get(getService);
    
    //Get Service By Id
    router.route('/service:id').get(getServiceById)
    
export default router;

