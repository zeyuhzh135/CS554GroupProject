const express = require('express');
const router = express.Router();
const data = require('../data');
const classData = data.classes;
const userData = data.users;
const { ObjectId } = require('mongodb');
const xss = require('xss');
const { addStudentToClass } = require('../data/classes');

router.get('/',async(req,res)=>{
    let classesList = await classData.getAllClasses();
    let user;
    let logged = req.session.user? true:false;
    if(logged) user=req.session.user;
    // console.log('in classes');
    // console.log(user);
    res.status(200).json({
        error:false,
        errors:[],
        logged:logged,
        user:user,
        data:classesList
    })
});

router.get('/:id', async(req,res)=>{
    let logged = false;
    let editable = false;
    try{
        let theClass = await classData.getClass(req.params.id);
        const user = await userData.getUser(theClass.owner);
        // if(req.session.user){
        //     logged = true;
        //     if(ObjectId(req.session.user.userId).equals(user._id){
        //         editable = true;
        //     }
        // }
        res.status(200).json({
            error:false,
            errors:[],
            logged:logged,
            editable:editable,
            data: theClass
        })

    }catch(e){
        res.status(500).json({
            error:true,
            errors:e,
            logged:logged,
            editable:editable,
            data:null
        })
    }
});

router.post('/',async(req,res)=>{
    let newClassData = req.body;
    let errors = [];
    if(!newClassData.name) errors.push('No name of class');
    if(!newClassData.category) errors.push('No category');
    if(!newClassData.description) errors.push('No description');
    if(!newClassData.questions) newClassData.questions = [];
    if(newClassData.questions && !Array.isArray(newClassData.questions)) errors.push('Invalid questions');
    const owner = req.session.user.userId;
    //let owner = newClassData.owner
    if(errors.length>0){
        res.status(200).json({
            error:true,
            errors:errors,
            logged: true, //only login user can post a new class
        });
        return;
    }
    try{
        const newClass = await classData.addClass(xss(newClassData.name),xss(newClassData.category),xss(owner),xss(newClassData.description),newClassData.questions);
        res.status(200).json({
            error:false,
            errors:errors,
            logged:true,
            data:newClass
        })
    }catch(e){
        res.status(500).json({
            error:true,
            errors:e,
            logged:true,
            data:null
        })
    }
});

router.post('/edit',async(req,res)=>{
    let updateClassData = req.body;
    let errors = [];
    if(!updateClassData.name) errors.push('No class name');
    if(!updateClassData.id) errors.push('No id for class')
    if(!updateClassData.category) errors.push('No class category');
    if(!updateClassData.description) errors.push('No class decription');
    if(!updateClassData.questions) updateClassData.questions = [];
    if(updateClassData.questions && !Array.isArray(updateClassData.questions)){
        errors.push('invalid questions');
    }
    let qs = [];
    for(q of updateClassData.questions){
        qs.push(q);
    }
    const owner = req.session.user.userId;
    //let owner = updateClassData.owner;
    if(errors.length>0){
        res.status(200).json({
            error:true,
            errors:errors,
            logged: true, //only login user can post a new class
        });
        return;
    }
    try{
        const updatedClass = await classData.updateClass(xss(updateClassData.id),xss(updateClassData.name),xss(updateClassData.category),xss(updateClassData.description),qs);
        res.status(200).json({
            error:false,
            errors:errors,
            logged:true,
            data: updatedClass
        })
    }catch(e){
        res.status(500).json({
            error:true,
            errors:e,
            logged:true,
            data:null
        })
    }

});

router.post('/scores',async(req,res)=>{
    let data = req.body;
    let errors = [];
    if(!data.classid) errors.push("No classid");
    if(!data.answers) errors.push('No student answer');
    //const user = req.session.user.userId;
    let user = data.user;
    let studentAns = data.answers;
    let theClassid = data.classid;
    let scoreboard = [];
    let score = 0;
    let rightcount=0;
    try{
        const theClassInfo = await classData.getClass(xss(theClassid));
        if(studentAns.length != theClassInfo.questions.length){
            errors.push('q and a not match')
        }
        for(let i=0;i<studentAns.length;i++){
            if(studentAns[i]==theClassInfo.questions[i].correctAns){
                rightcount++;
                scoreboard.push({
                    correction:true,
                    student_answers:studentAns[i],
                    correct_answers:theClassInfo.questions[i].correctAns
                })
            }else{
                scoreboard.push({
                    correction:false,
                    student_answers:studentAns[i],
                    correct_answers:theClassInfo.questions[i].correctAn
                })
            }
        }
        score = 100*rightcount/studentAns.length
        await classData.addStudentToClass(theClassInfo._id,user,score);
    }catch(e){
        res.status(500).json({
            error:true,
            errors:e,
            logged:true,
            data: null
        });
        return;
    };
    if(errors.length>0){
        res.status(200).json({
            error:true,
            errors:errors,
            logged:true,
            data:null
        })
        return;
    }
    res.status(200).json({
        error:false,
        errors:errors,
        logged:true,
        data:{
            score:score,
            detail:scoreboard
        }
    })

    
})
module.exports = router;