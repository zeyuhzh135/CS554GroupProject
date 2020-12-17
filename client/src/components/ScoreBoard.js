import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
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
            return <img src={'/image/get?id='+id+'&type=class'}/>
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
                    {imageRender(question.hasImage, question._id)}
                    <br/>
                    <p> {question.question}</p>
                    <br/>
                    <p>A: {question.A}</p>
                    <br/>
                    <p>B:{question.B}</p>
                    <br/>
                    <p>C:{question.C}</p>
                    <br/>
                    <p>D:{question.D}</p>
                    <br/>
                    <p>Correct Answer: {question.correctAns}</p>
                    <p>You Answer:{question.studentAns}</p>
                </div>
            )
        })
    }
    

    if(!display){
        <p>loading...</p>
    }
    return(
        <div>
            <p>ScoreBoard</p>
            <p>{score}</p>
            {display}
        </div>

        
    )
}

export default ScoreBoard;