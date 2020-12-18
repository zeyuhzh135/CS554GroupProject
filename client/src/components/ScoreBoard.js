import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import Axios from 'axios';

const ScoreBoard = (props)=>{
    const [loading,setLoading] = useState(true);
    const [questionList, setQuestionList] = useState([]);
    const [score,setScore] = useState(0);
    const [answers,setAnswers] = useState([]);

    let display=[];
    useEffect(()=>{
        async function getQuestions(){
            try{
                let apiuser = await Axios.get(`/classes/${props.match.params.quizId}`)
                setQuestionList(apiuser.data.data.questions);
            }catch(e){

            }
        }
        async function getScoreboard(){
            try{
                let apiuser = await Axios.get('/users/profile');
                for(let s of apiuser.data.data.scores){
                    if(s.classId == props.match.params.quizId){
                        setAnswers(s.scoreboard);
                        setScore(s.score);
                    }
                }
            }catch(e){

            }
        }
        getQuestions();
        getScoreboard();
        setLoading(false);
    },[]);

    const imageRender = (hasPicture, id) => {
        if(hasPicture){
            return <img src={'/image/get?id='+id+'&type=class'} alt="question image"/>
        }
    }

    if(questionList.length>0&&answers.length>0){
        console.log(score);
        console.log(questionList);
        console.log(answers);
        let allquestions = [];
        for(let i=0;i<questionList.length;i++){
            let single = {
                questionId:questionList[i]._id,
                question:questionList[i].question,
                hasImage:questionList[i].hasImage,
                A:questionList[i].A,
                B:questionList[i].B,
                C:questionList[i].C,
                D:questionList[i].D,
                correctAns:questionList[i].correctAns,
                studentAns:answers[i].student_answers,
                correction:answers[i].correction
            }
            allquestions.push(single);
        }
        console.log(allquestions);
        display = allquestions.map((question)=>{
            return(
                <div className='question-card' key={question.question}>
                    <br/>
                    <div className='question-card-area'>
                    {imageRender(question.hasImage, question.questionId)}
                    <p> {question.question}</p>
                    <p>A: {question.A}</p>
                    <p>B: {question.B}</p>
                    <p>C: {question.C}</p>
                    <p>D: {question.D}</p>
                    <p>Correct Answer: {question.correctAns}</p>
                    <p>You Answer: {question.studentAns}</p>
                    </div>
                    <br/>
            </div>
            )
        })
    }
    

    if(!display){
        <p>loading...</p>
    }
    return(
        <div>
            <div className='scoreboard'>
                <p>Score {score}%</p>
            </div>

            {display}
        </div>

        
    )
}

export default ScoreBoard;