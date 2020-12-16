const mongoCollections = require('../config/mongoCollections');
const classes = mongoCollections.classes;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');


// data schema of users:
//     {
//         _id:ObjectId
//         firstName: string,
//         lastName: string,
//         email: string,
//         passwordHash: string,
//         city: string,
//         isteacher:Boolean,
//         state: string,
//         hasPicture:Boolean,
//         active:Boolean,
//         teaching: array of class ids,
//         classes: array of class ids,
//         scores: [
//             {classid: id,
//              store: number
//             }
//             ...
//         ]
//     }

module.exports = {
    async addUser(firstName, lastName, email, passwordHash, isteacher, city, state, hasPicture=false,teaching = [],classes=[], scores=[]) {
        if(!firstName || typeof firstName!= 'string') throw 'you must provide a valid first name';
        if(!lastName || typeof lastName!= 'string') throw 'you must provide a valid last name';
        if(!email || typeof email!= 'string') throw 'you must provide a valid email';
        if(typeof isteacher !='boolean') throw 'you must indicate you are teacher or not';
        if(!passwordHash || typeof passwordHash!= 'string') throw 'you must provide a valid password hash';
        if(!city || typeof city!= 'string') throw 'you must provide a valid city';
        if(!state || typeof state!='string') throw 'you must provide a valid state';

        const usersCollection = await users();
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            passwordHash: passwordHash,
            isteacher:isteacher,
            city: city,
            state: state,
            hasPicture:hasPicture,
            active:false,
            teaching:teaching,
            classes: classes,
            scores: scores
        };
        const insertInfo = await usersCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user';
        const newId = insertInfo.insertedId;
        return await this.getUser(newId);
    },

    async getAllUsers() {
        const usersCollection = await users();
        return usersCollection.find({}).toArray();
    },

    async getUser(id) {
        if (!id) throw 'You must provide a user id to search for';

        const objId = ObjectId(id);
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: objId });
        if (user === null) throw 'No user with this id';

        return user;
    },

    async getUserByEmail(email){
        if(!email || typeof email !== 'string'){
            throw "You need to provide an email";
        }
        const usersCollection = await users();
        const user = await usersCollection.findOne({email:email});
        if(user === null){
            throw "Invalid email";
        }
        return user;
    },

    async updateUser(id , updatedUser) {
        const usersCollection = await users();
    
        const updatedUserData = {};
    
        if (updatedUser.firstName) {
          updatedUserData.firstName = updatedUser.firstName;
        }
    
        if (updatedUser.lastName) {
          updatedUserData.lastName = updatedUser.lastName;
        }
    
        if (updatedUser.email) {
          updatedUserData.email = updatedUser.email;
        }

        if (updatedUser.passwordHash){
            updatedUserData.passwordHash = updatedUser.passwordHash;
        }
    
        if (updatedUser.city){
            updatedUserData.city = updatedUser.city;
        }
    
        if (updatedUser.state){
            updatedUserData.state = updatedUser.state;
        }

        if(updatedUser.hasPicture){
            updatedUserData.hasPicture = updatedUser.hasPicture;
        }

        if(updatedUser.active){
            updatedUserData.active=updatedUser.active;
        }
        await usersCollection.updateOne({_id:id}, {$set:updatedUserData});
    
        return await this.getUser(id);
    },
    //when a teacher create a quiz
    async teachingAClass(userId,classId){
        if(!userId) throw 'You must provide a user id';
        if(!classId) throw 'You must provide a class id';
        if(typeof userId ==='string'){
            userId = ObjectId(userId);
        };
        classId = classId.toString();
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: userId });
        if(!user.isteacher){
            throw 'A student cannot teach'
        }else{
            const updateInfo = await usersCollection.updateOne({_id:userId},{$push:{teaching:classId}});
            if(updateInfo.modifiedCount === 0) throw 'Can not add class to user';
        }

        return true;
    },

    //for user to join the quiz inorder to join the chatroom
    async addClassToUser(userId, classId){
        if(!userId) throw 'You must provide a user id';
        if(!classId) throw 'You must provide a class id';
        if(typeof userId ==='string'){
            userId = ObjectId(userId);
        };
        classId = classId.toString();
        const usersCollection = await users();
        const updateInfo = await usersCollection.updateOne({_id:userId},{$push:{classes:classId}});
        if(updateInfo.modifiedCount === 0) throw 'Can not add class to user';
        return true;
    },

    //for students
    async addScoreToUser(userId, classId, score,scoreboard){
        if(!userId) throw 'You must provide a user id';
        if(!classId) throw 'You must provide a class id';
        if(typeof score != 'number')  throw 'You must provide a valid score';
        if(!scoreboard) throw 'Need scoreboard';
        if(typeof userId ==='string'){
            userId = ObjectId(userId);
        };
        classId = classId.toString();
        const usersCollection = await users();
        let newScore = {
            classId:classId,
            score:score,
            scoreboard:scoreboard
        }
        const updateInfo = await usersCollection.updateOne({_id:userId},{$push:{scores:newScore}});
        if(updateInfo.modifiedCount === 0) throw 'Can not add score to user';
        return true;
    },


}