import express from 'express';

import sendMail from '../controller/mail.js';
const routes = express.Router();

routes.post('/sendmail', sendMail);

export default routes;
