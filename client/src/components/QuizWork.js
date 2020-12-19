import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';

const QuizWork = (props) => {
    const [questionList, setQuestionList] = useState(undefined);
    const [quiz, setQuize] = useState(undefined);
    const [unanswered, setUnanswered] = useState(undefined);
    const [count, setCount] = useState(0);
    const [finished, setFinished] = useState(false);
    const [answer, setAnswer] = useState([]);
    const [authUser,setAuthUser] = useState()
    let questions;
    useEffect(() => {
        async function getTheClass() {
            try {
                let apires = await axios.get(`/classes/${props.match.params.id}`);
                let apires_user = await axios.get(`/users/profile/${apires.data.data.owner}`);
                let teacher = apires_user.data.data.firstName.concat(" ").concat(apires_user.data.data.lastName);
                let apires_current = await axios.get(`/users/profile`);
                setAuthUser(apires_current.data.data);
                // for(let c of apires_current.classes){
                //     if(c===props.match.params.id){
                //         //props.history.push('/');
                //     }
                // }
                setQuize({
                    id: apires.data.data._id,
                    name: apires.data.data.name,
                    owner:apires.data.data.owner,
                    category: apires.data.data.category,
                    description: apires.data.data.description,
                    teacher: teacher
                })
                setCount(apires.data.data.questions.length);
                setQuestionList(apires.data.data.questions);
            } catch (e) {
                console.log(e);
            }
        }
        getTheClass();
    }, [props.match.params.id]);

    const updateFieldChanged = (name, index) => (event) => {
        let newArr = answer;
        newArr[index] = name;
        setAnswer(newArr);
    };

    const onSubmitValue = async (e) => {
        e.preventDefault();
        //let theUser = await axios.get('/users/profile');
        let x = 0;
        let temp = [];
        for(let i = 0; i < count; i++) {
            if(answer[i] === undefined) {
                temp[x++] = (<p>Choose Answer for Question #{i+1}</p>)
            }
        }
        if(temp.length == 0) {
            let apiResponse = await axios.post('/classes/scores', {answers: answer, classid: quiz.id});
            setFinished(true);
        }
        setUnanswered(temp);
    }

    const imageRender = (hasPicture, id) => {
        if(hasPicture){
            return <img src={'/image/get?id='+id+'&type=class'} alt="question image"/>
        }
    }

    if(authUser&&quiz){
        if(authUser._id === quiz.owner){
            return(
                <Redirect to='/404'/>
            )
        }
        for(let s of authUser.scores){
            if(s.classId===props.match.params.id){
                return(
                    <Redirect to='/404'/>
                )
            }
        }
    }

    if (questionList) {
        let i = 0;
        if (finished) {
            return (<Redirect to='/dashboard'/>);
        }
        questions = questionList.map((question) => {
            return (
                <div className='question-card' key={question.question}>
                    {imageRender(question.hasImage, question._id)}
                    <br/>
                    <div className='question-card-area'>
                    <lable id ="Label-question">
                        Q{++i}: {question.question}
                    </lable>
                    <br/>
                    <lable htmlFor="A" id ="Label-A">
                    <input type='radio' id="A" value='A' name="A"
                           onClick={updateFieldChanged('A', i - 1)}/>
                    </lable>{question.A}
                    <br/>
                    <lable htmlFor="B" id ="Label-B">
                    <input type='radio' id="B" value='B' name="B"
                           onClick={updateFieldChanged('B', i - 1)}/>
                    </lable>{question.B}
                    <br/>   
                    <lable htmlFor="C" id ="Label-C">
                    <input type='radio' id="C" value='C' name="C"
                           onClick={updateFieldChanged('C', i - 1)}/>
                    </lable>{question.C}
                    <br/>
                    <lable htmlFor="D" id ="Label-D">                    
                    <input type='radio' id="D" value='D' name="D"
                           onClick={updateFieldChanged('D', i - 1)}/>
                           {question.D}
                    </lable>
                    <br/>
                    </div>

                    <br/>
                </div>
            )
        })
        return (
            <div>
                <h1>{quiz.name}</h1>
                <p className='quiz-cate'>Category: {quiz.category}</p>
                <p className='quiz-description'>{quiz.description}</p>
                <p>Teacher: {quiz.teacher}</p>
                <form onSubmit={onSubmitValue}>
                    {questions}
                    {unanswered}
                    <button className="submit-button" type="submit">
                        Submit
                    </button>
                </form>
            </div>

        )
    } else {
        return (
            <p>QuizWork</p>
        )
    }

}

export default QuizWork;