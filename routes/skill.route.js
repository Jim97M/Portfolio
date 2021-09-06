import express from 'express';
import {createSkill,getSkill, getSkillById} from '../controller/skill.controller.js';

const router = express.Router();

//Create a skill
router.route('/skill').post(createSkill);

//Get a skill
router.route('/skill').get(getSkill);

//Get Skill By Id
router.route('/skill:id').get(getSkillById)

export default router;

