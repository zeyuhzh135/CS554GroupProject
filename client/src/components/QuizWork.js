import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';

const QuizWork = (props)=>{
    const [questionList, setQuestionList] = useState(undefined);
    const [quiz,setQuize] = useState(undefined);
    const [finished, setFinished] = useState(false);
    const [answer, setAnswer] = useState([]);
    let questions;
    useEffect(()=>{
        async function getTheClass(){
            try{
                let apires = await axios.get(`/classes/${props.match.params.id}`);
                let apires_user = await axios.get(`/users/profile/${apires.data.data.owner}`);
                let teacher = apires_user.data.data.firstName.concat(" ").concat(apires_user.data.data.lastName);
                setQuize({
                    id: apires.data.data._id,
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

    const updateFieldChanged = (name, index) => (event) => {
        let newArr = answer;
        newArr[index] = name;
        setAnswer(newArr);
      };
      
    const onSubmitValue= async (e)=>{
        e.preventDefault();
        //let theUser = await axios.get('/users/profile');
        let apiResponse = await axios.post('/classes/scores',{answers: answer, classid: quiz.id});
        setFinished(true);
    }

    if(questionList){
        let i = 0;
        if(finished) {
            return(<Redirect to="/dashboard" />);
        }
        questions = questionList.map((question)=>{
            return(
                <div className = 'question-card' key={question.question}>
                <lable>
                    Q{++i}: {question.question}
                </lable>
                <br/>
                    <input type='radio' id = "A" value = 'A' name = {question.question} onClick={updateFieldChanged('A', i-1)}/>
                    <lable>{question.A}</lable>
                <br/>
                    <input type='radio' id = "B" value = 'B' name = {question.question} onClick={updateFieldChanged('B', i-1)}/>
                    <lable>{question.B}</lable>
                <br/>
                    <input type='radio' id = "C" value = 'C'name = {question.question} onClick={updateFieldChanged('C', i-1)}/>
                    <lable>{question.C}</lable>
                <br/>
                    <input type='radio' id = "D" value = 'D' name = {question.question} onClick={updateFieldChanged('D', i-1)}/>
                    <lable>{question.D}</lable>
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
                <form onSubmit={onSubmitValue}>
                {questions}
                <button className="submit-button" type="submit">
                    Submit
                </button>
                </form>
            </div>

    )
    }else{
     return(
            <p>QuizWork</p>
        )
    }

}

export default QuizWork;