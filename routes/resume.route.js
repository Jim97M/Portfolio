import express from 'express';
import {createResume, getResume, getResumeById} from '../controller/resume.controller.js';
const router = express.Router();

//Create a Resume
router.route('/resume').post(createResume);

//Get a Resume
router.route('/resume').get(getResume);

//Get Resume By Id
router.route('/resume:id').get(getResumeById);

export default router;