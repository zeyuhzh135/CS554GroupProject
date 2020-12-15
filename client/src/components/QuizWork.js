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
    },[props.match.params.id]);

    const onChangeValue=(event)=>{
        console.log(event.target.value);
    }

    if(questionList){
        questions = questionList.map((question)=>{
            let i=0;
            return(
                <div className = 'question-card' key={question.question}>
                <lable>
                    Q{++i}: {question.question}
                </lable>
                <br/>
                <form>
                    <div className = 'radio'>
                        <label>
                            <input type='radio' name={question.question} value = {question.A} onChange={onChangeValue}/>
                            {question.A}
                        </label>
                        <br/>
                        <label>
                            <input type='radio' name={question.question} value = {question.B} onChange={onChangeValue}/>
                            {question.B}
                        </label>
                        <br/>
                        <label>
                            <input type='radio' name={question.question} value = {question.C} onChange={onChangeValue}/>
                            {question.C}
                        </label>
                        <br/>
                        <label>
                            <input type='radio' name={question.question }value = {question.D} onChange={onChangeValue}/>
                            {question.D}
                        </label>
                        
                    </div>
                </form>
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