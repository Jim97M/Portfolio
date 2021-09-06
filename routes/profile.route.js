import express from 'express';
import {createProfile, getProfile, getProfileId } from '../controller/profile.controller.js';
const router = express.Router();

router.route('/profile').post(createProfile);


//Get a profile
router.route('/profile').get(getProfile);

//Get Profile By Id
router.route('/skill:id').get(getProfileId)

export default router;
