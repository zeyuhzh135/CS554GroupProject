import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';

const QuizWork = (props)=>{
    const [questionList, setQuestionList] = useState(undefined);
    const [quiz,setQuize] = useState(undefined);
    let questions
    useEffect(()=>{
        async function getTheClass(){
            try{
                let apires = await axios.get(`/classes/${props.match.params.id}`);
                let apires_user = await axios.get(`/users/profile/${apires.data.data.owner}`);
                let teacher = apires_user.data.data.firstName.concat(" ").concat(apires_user.data.data.lastName);
                setQuize({
                    name:apires.data.data.name,
                    category:apires.data.data.category,
                    description:apires.data.data.description,
                    teacher:teacher
                })
                setQuestionList(apires.data.data.questions);
            }catch(e){
                console.log(e);
            }
        }
        getTheClass();
    },[])

    if(questionList){
        questions = questionList.map((question)=>{
            return(
                <div className = 'question-card' key={question.question}>
                <lable>
                    Q1: {question.question}
                </lable>
                <br/>
                <lable>
                    <input type='radio' name = {question.A} value = {question.A}/>
                </lable>
                <br/>
                <lable>
                    <input type='radio' name = {question.B} value = {question.B}/>
                </lable>
                <br/>
                <lable>
                    <input type='radio' name = {question.C} value = {question.C}/>
                </lable>
                <br/>
                <lable>
                    <input type='radio' name = {question.D} value = {question.D}/>
                </lable>
                <br/>
                </div>
            )
        })
        return(
            <div>
                <p>{quiz.name}</p>
                <p>{quiz.category}</p>
                <p>{quiz.description}</p>
                <p>{quiz.teacher}</p>
                {questions}
            </div>

    )
    }else{
     return(
            <p>QuizWork</p>
        )
    }

}

export default QuizWork;