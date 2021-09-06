import express from 'express';
import {createPortfolio, getPortfolio, getPortfolioById} from '../controller/portfolio.controller.js';
const router = express.Router();

router.route('/portfolio').post(createPortfolio);

//Get a Portfolio
router.route('/portfolio').get(getPortfolio);

//Get Skill By Id
router.route('/portfolio:id').get(getPortfolioById)

export default router;