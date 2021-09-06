import asyncHandler from 'express-async-handler';
import Portfolio from '../models/portfolio.model.js';

export const createPortfolio = asyncHandler(async(req,res) => {
    const {category,image,link,title,text} = req.body;

    const portfolio = await Portfolio.create({
        category,
        image,
        link,
        title,
        text
    });

    if(portfolio){
        res.json({
            _id:portfolio._id,
            category:portfolio.category,
            image:portfolio.image,
            link:portfolio.link,
            title:portfolio.title,
            text:portfolio.text         
          
        })
    }else{
        res.status(400);
        throw new Error("Error");
    }
    res.json({
        category,
        image,
        link,
        title,
        text
    });
});

export const getPortfolio = asyncHandler(async(req,res) => {
    const portfolio = await Portfolio.find({});
    res.json(portfolio);
});

export const getPortfolioById = asyncHandler(async(req,res) => {
    const portfolio = await Portfolio.findById(req.params.id)

    if(portfolio){
        res.json(portfolio)
    }else{
        res.status(404).json({message: "Portfolio not Found"})
        res.status(404)
        throw new Error('Portfolio not Found');
    }
    res.json(portfolio);
})


