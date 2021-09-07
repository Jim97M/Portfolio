import express from 'express';
import mongoose from 'mongoose';

//import nodemailer from 'nodemailer';
//import { createRequire } from 'module';
//import path from 'path';
// import creds from './nodemon.json'
 //import path from 'path';
 //import { fileURLToPath } from 'url';
 import serviceRouter from "./routes/service.router.js";
 import skillRouter from "./routes/skill.route.js";
 import resumeRouter from "./routes/resume.route.js";
 import reviewRouter from "./routes/review.route.js";
 import profileRouter from "./routes/profile.route.js";
 import portfolioRouter from "./routes/portfolio.route.js";
 import blogRouter from "./routes/blog.route.js";

  //const __dirname = dirname(__filename);
// import cors from 'cors';
// import Mail from './routes/mail.js';
// Connect to the db


mongoose.connect("mongodb+srv://portfolioUser:portfolioUserPass@cluster0.m2yys.mongodb.net/portfolio", {
useCreateIndex: true,
keepAlive: 1,
useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false
})
.then(() => console.log('Connected'));
  // perform actions on the collection object

const app = express();
  
//app.use(express.static(path.join(__dirname, "frontend", "build")));

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/', serviceRouter);
app.use('/api/', skillRouter);
app.use('/api/', resumeRouter);
app.use('/api/', reviewRouter);
app.use('/api/', profileRouter);
app.use('/api/', portfolioRouter);
app.use('/api/', blogRouter);

// const transporter = nodemailer.createTransport({
//   host:"smtp.gmail.com",
//      port:587,
//      secure: false,
    
//      auth: {
//        user: creds.auth.user,
//        pass: creds.auth.pass
//      },
// });

// app.post('/mail', (req, res, next) => {
//   const email = req.body.email
//   const message = req.body.message
//   const subject = req.body.subject
//   const name = req.body.name

//   const mailOptions = {
//     from: name,
//     to: email,
//     subject: subject,
//     html: `${name} from <noreply@${name}.com> <br /> <br /> ${message}`
//   }
//   transporter.sendMail(mailOptions, (err, data) => {
//     if(err){
//       res.json({
//         status: "err"
//       })
//       console.log(err)
//     }
//       else {
//         res.json({
//           status: "success"
//         })
//         console.log("Email Sent" + data.response)
//       }
//   })
// })

// transporter.verify(function(error, success){
//      if(error){
//        console.log(error);
//      } else {
//        console.log("Server is ready to take our message!");
//      }
// })

// app.get("*", (req,res) => {
//   res.sendFile(path.join(__dirname, "frontend", "build"))
// });


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

//app.get("*", (req, res) => {
 // res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
//})


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
})

