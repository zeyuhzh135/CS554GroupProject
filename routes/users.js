const express = require('express');
const router = express.Router();
const data = require('../data');
const classData = data.classes;
const userData = data.users;
const passwordHash = require('password-hash');
const { ObjectId } = require('mongodb');
const xss = require('xss');
const nodemailer = require("nodemailer");

// res.json={
//     error: Boolean,
//     erros:[],
//     logged:Boolean,
//     data:{}
// }

const transporter = nodemailer.createTransport({
    service:'gmail.com',
    secure:true,
    port:465,
    auth:{
        user:'groupprojectcs554fall2020@gmail.com',
        pass:'nidayedelajigmailsba123'
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});


router.post("/joinClass", async (req,res)=>{
    if(req.session.user){
        let userId = req.session.user.userId;
        let classId = req.body.classId;
        try {
            let user = await userData.getUser(userId);
            if(!user.classes.includes(classId)){
                let result = await userData.addClassToUser(userId,classId)
            }
        }catch (e){
            res.status(400).json({
                error:true,
                errors:e,
                logged:true,
                data:null
            })
        }
        res.status(200).json({
            error:false,
            errors:[],
            logged:true,
            data:null
        })
    }else {
        res.status(200).json({
            error:true,
            errors:['You need to login first'],
            logged:false,
            data:null
        });
    }
})

router.post('/email-score',async(req,res)=>{
    let info = req.body;
    //console.log(info);
    if(!req.session.user){
        res.status(500);
        return;
    }
    let requestUser,emailTo;
    try{
        requestUser = await userData.getUser(req.session.user.userId);
        emailTo = requestUser.email;
    }catch(e){
        emailTo=undefined;
    }

    let htmlstring = "";
    for(s of info){
        //let quizdetail = await classData.getClass(s.classId);
        let quiz = s.className;
        let scoreboard = s.scoreboard;
        htmlstring+=`<div><p>${quiz}<p><div>`;
        htmlstring+=`<div><p>${s.score}<p><div>`
    }
    console.log(htmlstring);
    console.log(emailTo);
    let e = !emailTo?true:false
    if(htmlstring==""){
        htmlstring="<div><p>You have not done any quiz yet<p><div>"
    }
    var mailOptions = {
        from: "Quiz App <groupprojectcs554fall2020@gmail.com>",
        to:emailTo,
        subject:'Quiz App Scores',
        text:'Quiz App Scores',
        html:htmlstring
    }
    let emailresponse = await transporter.sendMail(mailOptions);
    console.log(emailresponse);
    if(emailresponse.accepted&&!e){
        res.status(200).json({
            error:false,
            errors:null,
            logged:true,
            data: 'The email has been sent'
        })
    }else{
        res.status(200).json({
            error:true,
            errors:["Unable to send the email"],
            logged:true,
            data:null
        })
    }
})

router.post('/signin',async(req,res)=>{
    let loginfo = req.body;
    let errors = [];

    if(!loginfo.email) errors.push('No email');
    if(!loginfo.password) errors.push('No password');
    if(errors.length>0){
        res.status(200).json({
            error:true,
            errors:errors,
            logged:false,
            data: null
        });
        return;
    };
    let user;
    try{
        user = await userData.getUserByEmail(loginfo.email.toLowerCase());
    }catch(e){
        res.status(200).json({
            error:true,
            errors:['Invalid email and/or password'],
            logged:false,
            data:null
        });
        return;
    }
    const comparedHashedPassword = passwordHash.verify(loginfo.password,user.passwordHash);
    if(comparedHashedPassword){
        req.session.user = {firstName:user.firstName,lastName:user.lastName,userId:user._id};
        // console.log('in user');
        // console.log(req.session.user);
        res.status(200).json({
            error:false,
            errors:[],
            logged:true,
            data:user
        })
    }else{
        res.status(200).json({
            error:true,
            errors:['Invalid email and/or password'],
            logged:false,
            data:null
        });
        return;
    }

});

//register
router.post('/',async(req,res)=>{
    let newUser = req.body;
    let errors = [];
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!newUser.firstName) errors.push('No first Name');
    if(!newUser.lastName) errors.push('No last Name');
    if(!newUser.email) errors.push('No email');
    if(newUser.email && !emailRegex.test(newUser.email)) errors.push('Invalid email');
    if (!newUser.password) errors.push('No password provided');
    if(newUser.password && newUser.password.length < 8) errors.push('Password should contain at least 8 characters');
    if (!newUser.password_confirm)  errors.push('No password confirmation provided');
    if(newUser.password_confirm !== newUser.password)   errors.push('Passwords don\'t match');
    if(!newUser.isteacher) errors.push('Declare you a teacher or not');
    if (!newUser.city)  errors.push('No city provided');
    if (!newUser.state) errors.push('No state provided');
    newUser.email = newUser.email.toLowerCase();
    try{
        const existingEmail =  await userData.getUserByEmail(newUser.email.toLowerCase());
        if (existingEmail)
            errors.push('An account with this email already exists.');
    } catch(e) {}

    if (errors.length > 0) {
		res.status(200).json( {
		    error: true,
			errors: errors,
            logged: false,
            data:null
		});
		return;
    }
    try {
        const hashedPassword = passwordHash.generate(newUser.password);
        await userData.addUser(xss(newUser.firstName), xss(newUser.lastName), xss(newUser.email.toLowerCase()),
            hashedPassword, newUser.isteacher,xss(newUser.city), xss(newUser.state));
        let newRegister = await userData.getUserByEmail(newUser.email.toLowerCase());
        //req.session.user = {firstName:newRegister.firstName,lastName:newRegister.lastName,userId:newRegister._id}
        let emailTo = newRegister.email;
        let htmlstring="<div>Please active your account with blow link<div>";
        let link = "http:/localhost:3000/varification/"+newRegister._id;
        htmlstring += `<div><a href=${link}>${link}<div>`;
        var mailOptions = {
            from: "Quiz App <groupprojectcs554fall2020@gmail.com>",
            to:emailTo,
            subject:'Email varification',
            text:'Please varify your account at Quiz App',
            html: htmlstring
        }
        let emailresponse = await transporter.sendMail(mailOptions);
        console.log(emailresponse);
        if(emailresponse.accepted){
            res.status(200).json({
                error:false,
                errors:[],
                logged:true,
                data: newRegister
            })
        }else{
            errors.push("Unable to send the email");
            res.status(200).json({
                error:true,
                errors:errors,
                logged:true,
                data:null
            })
        }
    }catch(e){
        res.status(500).json({error: e.toString()})
  }
});

//get user info by session
router.get('/profile',async (req,res)=>{
    if(req.session.user){
        let user;
        try {
            user = await  userData.getUser(req.session.user.userId)
        }catch (e){
            res.status(400).json({
                error:true,
                errors:e,
                logged:true,
                data:null
            })
        }
        res.status(200).json({
            error:false,
            errors:[],
            logged:true,
            data:user
        })
    }else {
        res.status(200).json({
            error:true,
            errors:['You need to login first'],
            logged:false,
            data:null
        });
    }
})

router.post('/active',async(req,res)=>{
    if(!req.body.userId){
        res.status(400);
    }
    let user
    try{
        user = await userData.updateUser(req.body.userId,{active:true});
    }catch(e){
        res.status(400);
        return;
    }
    if(user){
        res.status(200).json({
            error:false,
            errors:[],
            loggin:false,
            data: "successfully activate the user"
        })
    }else{
        res.status(400);
    }
})

router.get('/profile/:userId', async(req,res)=>{
    // if (req.params.userId !== req.session.user.userId) {
    //     res.redirect('/');
    //     return;
    // }

    //it's lazy binding and this is noSQL!
    let user
    try{
        user = await userData.getUser(req.params.userId);
    }catch(e){
        res.status(200).json({
            error:true,
            errors:e,
            logged:false,
            data:null
        })
        return;
    }
    res.status(200).json({
        error:false,
        errors:[],
        logged:true,
        data:user
    })
    return;
})

//To check the varification url
router.get('/varification/:userId',async(req,res)=>{
    let user;
    try{
        user = await userData.getUser(req.params.userId);
    }catch(e){
        res.status(200).json({
            error:true,
            errors:[e],
            valid:false,
            message:'Invalid url to varify the email'
        })
    }
    if(user&&!user.active){
        console.log(user);
        res.status(200).json({
            error:false,
            errors:[],
            valid:true,
            message:'Please click the button the active your account'
        })
    }else{
        console.log(user);
        res.status(200).json({
            error:true,
            errors:["No such user or the user has been actived"],
            valid:false,
            message:'No such user or the user has been actived'
        })
    }
})


router.get('/logout',async(req,res)=>{
    if(!req.session.user){
        res.status(200).json({
            error:true,
            errors:['You are not loggedin'],
            logged:false,
            data:null
        })
    }
    req.session.destroy();
    res.status(200).json({
        loggedout:true
    })
})

router.post('/update', async (req, res)=>{
    let info = req.body;
    try {
        await userData.updateUser(info._id, info)
        res.status(200).json({
            error:false,
            errors:null,
            logged:true,
            data:null
        })
    }catch (e){
        res.status(404).json({
            error:true,
            errors:e,
            logged:true,
            data:null
        })
    }
})
module.exports = router;