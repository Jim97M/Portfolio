'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _mail = require('./routes/mail');

var _mail2 = _interopRequireDefault(_mail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const nodemailer = require('nodemailer');

// const cors = require('cors');
var app = (0, _express2.default)();

// require("dotenv").config();


// Connect to the db

// const fastify = require('fastify')();
_mongoose2.default.connect("mongodb://localhost:27017/portfolio", { useNewUrlParser: true, useUnifiedTopology: true
}).then(function () {
    console.log('Connected');
}).catch(function (err) {
    console.log('Error');
    process.exit();
});

app.use(_express2.default.json());
app.use((0, _cors2.default)());

app.use('/api', _mail2.default);

//Declare a route

// app.get('/user/:id', function(req, reply) {
//     //Or this.mongo.client.db('portfolio).collection('users')
//      const users = this.mongo.db.collection('users')
//     users.findOne({id: req.params.id}, (err, user) => {
//         if(err){
//             reply.send(err)
//             return
//         }
//         reply.send(err)
//     })
// })
//middleware
// app.use(express.json());
// app.use(cors());
// let transporter = nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         type: "OAuth2",
//         user: process.env.EMAIL,
//         pass: process.env.WORD,
//         clientId: process.env.OAUTH_CLIENTID,
//         clientSecret: process.env.OAUTH_CLIENT_SECRET,
//         refreshToken: process.env.OAUTH_REFRESH_TOKEN,
//     },
// });

// transporter.verify((err, success) => {
//     err
//        ? console.log(err)
//        : console.log(`===Server is ready to take messages: ${success} ===`)
// });

// app.post("/send", function(req, res){
//     let mailOptions = {
//         from: `${req.body.mailerState.email}`,
//         to: process.env.EMAIL,
//         subject: `About: ${req.body.mailerState.subject}`,
//         text: `${req.body.mailerState.message}`
//     };
//     transporter.sendMail(mailOptions, function(err, data) {
//         if(err){
//             res.json({
//                 status: "fail"
//             });
//         }else {
//             console.log("Email Sent Successfully");
//             res.json({status: "Email sent"});
//         }
//     });


// })


var PORT = 3001;
app.listen(PORT, function () {
    console.log('Server is running ' + PORT);
});