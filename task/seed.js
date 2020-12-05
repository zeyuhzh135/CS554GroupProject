const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const classes = data.classes;
const passwordHash = require('password-hash');

//temporily use for test the data part
async function main(){
    const db = await dbConnection();
    await db.dropDatabase();
    
    let user1_pwd = passwordHash.generate('user1'),
    user2_pwd = passwordHash.generate('user2');
    let user1,user2,testclass;
    try{
        user1 = await users.addUser('U1F','U1L','user1@123.com',user1_pwd,'city1','state1');
    }catch(e){
        console.log(e);
    }

    try{
        user2 = await users.addUser('U2F','U2L','user2@123.com',user2_pwd,'city2','state2');
    }catch(e){
        console.log(e);
    }
    console.log(await users.getUserByEmail('user1@123.com'));
    let modified_user1 = {
        firstName:'U1FM',
        lastName:'U1LM',
        email:'user1m@123.com',
        passwordHash:user2_pwd,
        city:'city1',
        state:'state1'
    }

    await users.updateUser(user1._id,modified_user1);
    console.log(await users.getUser(user1._id));
    try{
        testclass = await classes.addClass('cs554',"Computer Science",user1._id,"CS554 Description");
    }catch(e){
        console.log(e);
    }
    console.log(await classes.getAllClasses());
    console.log(await users.getUser(user1._id));
    let questions = [{
        question:"q1",
        A: "a",
        B: "b",
        C: "c",
        D: "d",
        correctAns : "A"
    },
    {
        question:"q2",
        A:"a",
        B:"b",
        C:"c",
        D: "d",
        correctAns:"B"
    }
    ]
    try{
        testclass = await classes.updateClass(testclass._id,"cs554+1","CS","554+1",questions);
    }catch(e){
        console.log(e);
    }
    console.log(await classes.getClass(testclass._id));
    try{
        await classes.addStudentToClass(testclass._id,user2._id,59);
    }catch(e){
        console.log(e);
    }
    console.log(await users.getUser(user2._id));
    console.log(await classes.getClass(testclass._id));
	await db.serverConfig.close();
}

main().catch((error) => {
	console.error(error);
});