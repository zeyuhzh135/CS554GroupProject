const mongoCollections = require('../config/mongoCollections');
const classes = mongoCollections.classes;
const users = require('./users');
const { ObjectId } = require('mongodb');

// class data schema = {
//     name:string,
//     category:string,
//     owner:objid/string,
//     description:string,
//     questions:[
//         {
//             question:string,
//             hasImage:Boolean,
//             A: string,
//             B: striing,
//             C: string,
//             D: string,
//             correctAns: string/A,B,C,D,
//         }
//         ...
//     ],
//     students:[
//         {
//             id:objid/string,
//             score:Number
//         }
//          ....
//     ]
// }

module.exports = {
    async addClass(className, classCategory, classOwner, classDescription, questions, students=[]){
        if(!className) throw "No class name";
        if(!classCategory) throw 'No class category';
        if(!classOwner) throw 'No class owner';
        if(!classDescription) throw 'No class description';
        if(!questions) questions = [];
        const classesCollection = await classes();
        let insertquestions  = [];
        for(q of questions){
            let newQ = {
                _id:ObjectId(),
                question:q.question,
                hasImage: q.hasImage,
                A:q.A,
                B:q.B,
                C:q.C,
                D:q.D,
                correctAns:q.correctAns
            }
            insertquestions.push(newQ);
        }
        classOwner = classOwner.toString();
        let newClass = {
            name:className,
            category:classCategory,
            owner: classOwner,
            description:classDescription,
            questions:insertquestions,
            students:students
        }
        const insertInfo = await classesCollection.insertOne(newClass);
        if(insertInfo.insertedCount === 0) throw 'Can not add class';
        const classId = insertInfo.insertedId;
        let addClassToUser;
        let addTeaching;
        try{
            addTeaching = await users.teachingAClass(classOwner,classId);
            addClassToUser = await users.addClassToUser(classOwner,classId);
        }catch(e){
            throw(e);
        }
        if(!addClassToUser) throw 'Can not add class to user';
        if(!addTeaching) throw 'Can not teaching this class';
        return await this.getClass(classId);
    },

    async getAllClasses(){
        const classesCollection = await classes();
        return await classesCollection.find({}).toArray();
    },

    async getClass(id){
        const classesCollection = await classes();
        if(typeof(id)=='string') id = ObjectId(id);
        const theclass = await classesCollection.findOne({_id:id});
        if(theclass === null) throw 'No class with this id';
        return theclass;
    },

    async updateClass(classId,className,classCategory,classDescription,questions){
        if(!classId) throw 'No classId';
        if(!className) throw 'No classCategory';
        if(!classCategory) throw 'No classCategory';
        if(!classDescription) throw 'No classDescription';
        if(!questions) throw 'No questions';
        if(typeof(classId)=='string') classId = ObjectId(classId);
        const classesCollection = await classes();
        const updatedInfo = await classesCollection.updateOne({_id:classId},{$set:{name:className,category:classCategory,description:classDescription,questions:questions}});
        if(updatedInfo.modifiedCount === 0) throw 'Can not update class';
        return await this.getClass(classId);
    },

    async addStudentToClass(classId,studentId, score,scoreboard){
        if(!classId) throw 'No classId';
        if(!studentId) throw 'No studentId';
        if(typeof(score) != 'number') throw 'invalid score';
        if(!scoreboard) throw 'Need score board';
        const classesCollection = await classes();
        let newStudent = {
            id: studentId,
            score:score,
            scoreboard:scoreboard
        }
        const updatedInfo = await classesCollection.updateOne({_id:classId},{$push:{students:newStudent}});
        const updatedUser = await users.addScoreToUser(studentId,classId,score,scoreboard);
        if(updatedInfo.modifiedCount === 0 || !updatedUser) throw 'Can not add class to user';
        return this.getClass(classId);
    }
}