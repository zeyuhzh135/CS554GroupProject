const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const classes = data.classes;
const passwordHash = require('password-hash');

//temporily use for test the data part
async function main(){
    const db = await dbConnection();
    await db.dropDatabase();
    
    let teacher_pwd = passwordHash.generate('teacherpassword'),
    student_pwd = passwordHash.generate('studentpassword');
    let teacher0,teacher1,student0,student1,student2,student3,quiz0,quiz1;

    try{
        teacher0 = await users.addUser("Jane","Baker",'janeb@example.com',teacher_pwd,true,'Santa Cruz','CT');
        teacher1 = await users.addUser("Jason", "Hovin","jasonh@example.com",teacher_pwd,true,"Hoboken","NJ");
        student0 = await users.addUser('Bill', "Penceny","billp@example.com",student_pwd,false,"Hoboken","NJ");
        student1 = await users.addUser('Stephanie',"Garfield","stephanieg@example.com",student_pwd,false,'Los Altos','CA');
        student2 = await users.addUser('Peter',"Ramsammy","peterr@example.com",student_pwd,false,'Chicago',"IL");
        student3 = await users.addUser('Jon','Norton',"jonn@example.com",student_pwd,false,"Fairfax","VA");
    }catch(e){
        console.log(e);
    }

     let quiz0qustions = [
    {
        question:"Strand of RNA is made of",
        hasImage:false,
        A: "ribose sugar",
        B: "phosphate unit",
        C: "nitrogen base",
        D: "all of above",
        correctAns : "D"
    },
    {
        question:"Which of the following activates more than 100 different enzymes?",
        hasImage:false,
        A:"vitamin A",
        B:"vitamin B",
        C:"vitamin C",
        D: "vitamin D",
        correctAns:"B"
    },
    {
        question:"Which of the following are obtained from fruits, vegetables, and cereals?",
        hasImage:false,
        A: "monosaccharides",
        B: "sucrose",
        C: "cellulose",
        D: "starch",
        correctAns : "A"
    },
    {
        question:"Which of the following is used to make rectified spirit by fermentation process?",
        hasImage:false,
        A: "cellulose",
        B: "starch",
        C: "glucose",
        D: "fructose",
        correctAns : "B"
    },
    {
        question:"How many amino acids are synthesized by our bodies?",
        hasImage:false,
        A: "10",
        B: "20",
        C: "30",
        D: "40",
        correctAns : "A"
    },
    {
        question:"The key to the ability of DNA to pass and store genetic information is its",
        hasImage:false,
        A: "hydrogen bonding",
        B: "double stranded structure",
        C: "deoxyribose sugar",
        D: "nitrogen base",
        correctAns : "B"
    }
    ]
    let quiz1questions = [
        {
            question:"To create a variable in Javascript, use the ______ keyword",
            hasImage:false,
            A: "let",
            B: "variable",
            C: "for",
            D: "if",
            correctAns : "A"  
        },
        {
            question:"To run a function when a user clicks a button on the screen, add this attribute to the <button> tag:",
            A: "onPress",
            B: "onPush",
            C: "onBlitzen",
            D: "onClick",
            correctAns : "D"  
        },
        {
            question:"To work with a specific element on the web page, such as an input box or paragraph, from a Javascript function you should use its:",
            hasImage:false,
            A: "id",
            B: "color",
            C: "name",
            D: "size",
            correctAns : "A"  
        },
        {
            question:"Which of the following is used to locate a specific HTML element in Javascript? ",
            hasImage:false,
            A: "document.getElementById",
            B: "document.getElementByLocation",
            C: "document.getElementByType",
            D: "document.getElementByNomial",
            correctAns : "A"  
        },
        {
            question:"To create a constant value in Javascript, such as the value of pi, use the ____ keyword",
            hasImage:false,
            A: "const",
            B: "constant",
            C: "let",
            D: "var",
            correctAns : "A"  
        },
    ]
    try{
        quiz0 = await classes.addClass('Biochemistry50 quiz',"Chemistry",teacher0._id," Practice biochemistry quiz questions. Learn nucleic acids, glucose, importance of vitamin, vitamin and mineral test prep. The key to the ability of DNA to pass and store genetic information with double stranded structure, hydrogen bonding, deoxyribose sugar, and nitrogen base.",quiz0qustions);
        quiz1 = await classes.addClass('Web-programming quiz',"Computer Science",teacher1._id,"The first web-programming quiz, bascially go through javascript questions",quiz1questions);
    }catch(e){
        console.log(e);
    }

    try{
        await users.addClassToUser(student0._id,quiz0._id);
        await users.addClassToUser(student1._id,quiz0._id);
    }catch(e){
        console.log(e);
    }
    // try{
    //     user1 = await users.addUser('U1F','U1L','user1@123.com',user1_pwd,'city1','state1');
    // }catch(e){
    //     console.log(e);
    // }

    // try{
    //     user2 = await users.addUser('U2F','U2L','user2@123.com',user2_pwd,'city2','state2');
    // }catch(e){
    //     console.log(e);
    // }
    // console.log(await users.getUserByEmail('user1@123.com'));
    // let modified_user1 = {
    //     firstName:'U1FM',
    //     lastName:'U1LM',
    //     email:'user1m@123.com',
    //     passwordHash:user2_pwd,
    //     city:'city1',
    //     state:'state1'
    // }

    // await users.updateUser(user1._id,modified_user1);
    // console.log(await users.getUser(user1._id));
    // try{
    //     testclass = await classes.addClass('cs554',"Computer Science",user1._id,"CS554 Description");
    // }catch(e){
    //     console.log(e);
    // }
    // console.log(await classes.getAllClasses());
    // console.log(await users.getUser(user1._id));
    // let questions = [{
    //     question:"q1",
    //     A: "a",
    //     B: "b",
    //     C: "c",
    //     D: "d",
    //     correctAns : "A"
    // },
    // {
    //     question:"q2",
    //     A:"a",
    //     B:"b",
    //     C:"c",
    //     D: "d",
    //     correctAns:"B"
    // }
    // ]
    // try{
    //     testclass = await classes.updateClass(testclass._id,"cs554+1","CS","554+1",questions);
    // }catch(e){
    //     console.log(e);
    // }
    // console.log(await classes.getClass(testclass._id));
    // try{
    //     await classes.addStudentToClass(testclass._id,user2._id,59);
    // }catch(e){
    //     console.log(e);
    // }
    // console.log(await users.getUser(user2._id));
    // console.log(await classes.getClass(testclass._id));
	await db.serverConfig.close();
}

main().catch((error) => {
	console.error(error);
});