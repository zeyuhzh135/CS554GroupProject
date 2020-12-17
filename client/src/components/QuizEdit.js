import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';

const NewQuiz = (props)=>{
    const [questionList, setQuestionList] = useState([]);
    const [name, setName] = useState('');
    const [questions, setQuestions] = useState(undefined);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [namei, setNamei] = useState('');
    const [categoryi, setCategoryi] = useState('');
    const [descriptioni, setDescriptioni] = useState('');
    const [count, setCount] = useState(0);
    const [answer, setAnswer] = useState([]);
    const [finished, setFinished] = useState(false);
    const updateFieldChanged = (input, value, index) => {
        let newArr = answer;
        newArr[index][input] = value;
        setAnswer(newArr);
    };

    useEffect(()=>{
        async function getTheClass(){
            try{
                let apires = await axios.get(`/classes/${props.match.params.id}`);
                setName(apires.data.data.name);
                setCategory(apires.data.data.category);
                setDescription(apires.data.data.description);
                setNamei(apires.data.data.name);
                setCategoryi(apires.data.data.category);
                setDescriptioni(apires.data.data.description);
                setQuestions(apires.data.data.questions);
                setCount(apires.data.data.questions.length);
                let temp  = [];
                setAnswer([{}]);
                for(let i = 0; i < apires.data.data.questions.length; i++) {
                    if(answer[i] == undefined) {
                        answer[i] = {};
                    }
                    temp[i] = (
                        <div className = 'question-card'>
        
                        <label class="editQuizLabel">
                            Question: 
                            <input type="text" name="Question" onChange={(e) => updateFieldChanged("question", e.target.value, i)} placeholder ={questions[i] ? questions[i]["question"] : ''}/>
                        </label>
                        <br/>
                        <label class="editQuizLabel">
                            A: 
                            <input type="text" name="A" onChange={(e) => updateFieldChanged("A", e.target.value, i)} placeholder ={questions[i] ? questions[i]["A"] : ''} />
                        </label>
                        <br/>
                        <label class="editQuizLabel">
                            B: 
                            <input type="text" name="B" onChange={(e) => updateFieldChanged("B", e.target.value, i)} placeholder ={questions[i] ? questions[i]["B"] : ''} />
                        </label>
                        <br/>
                        <label class="editQuizLabel">
                            C: 
                            <input type="text" name="C" onChange={(e) => updateFieldChanged("C", e.target.value, i)} placeholder ={questions[i] ? questions[i]["C"] : ''} />
                        </label>
                        <br/>
                        <label class="editQuizLabel">
                            D: 
                            <input type="text" name="D" onChange={(e) => updateFieldChanged("D", e.target.value, i)} placeholder ={questions[i] ? questions[i]["D"] : ''} />
                        </label>
                        <br/>
                        <br/>
                        <label class="editQuizLabel">
                            Answer: 
                            <input type="text" name="Answer" onChange={(e) => updateFieldChanged("correctAns", e.target.value, i)} placeholder ={questions[i] ? questions[i]["correctAns"] : ''} />
                        </label>
                        <br/>
                    </div>
                    );
                }
                setQuestionList(temp); 
            }catch(e){
                console.log(e);
            }
        }
        getTheClass();
    },[props.match.params.id]);

    const addQuestions = (e) =>{
        e.preventDefault();
        let temp  = [];
        for(let i = 0; i < count+1; i++) {
            if(answer[i] == undefined) {
                answer[i] = {};
            }
            temp[i] = (
                <div className = 'question-card'>

                <label class="editQuizLabel">
                    Question: 
                    <input type="text" name="Question" onChange={(e) => updateFieldChanged("question", e.target.value, i)} placeholder ={questions[i] ? questions[i]["question"] : ''}/>
                </label>
                <br/>
                <label class="editQuizLabel">
                    A: 
                    <input type="text" name="A" onChange={(e) => updateFieldChanged("A", e.target.value, i)} placeholder ={questions[i] ? questions[i]["A"] : ''} />
                </label>
                <br/>
                <label class="editQuizLabel">
                    B: 
                    <input type="text" name="B" onChange={(e) => updateFieldChanged("B", e.target.value, i)} placeholder ={questions[i] ? questions[i]["B"] : ''} />
                </label>
                <br/>
                <label class="editQuizLabel">
                    C: 
                    <input type="text" name="C" onChange={(e) => updateFieldChanged("C", e.target.value, i)} placeholder ={questions[i] ? questions[i]["C"] : ''} />
                </label>
                <br/>
                <label class="editQuizLabel">
                    D: 
                    <input type="text" name="D" onChange={(e) => updateFieldChanged("D", e.target.value, i)} placeholder ={questions[i] ? questions[i]["D"] : ''} />
                </label>
                <br/>
                <br/>
                <label class="editQuizLabel">
                    Answer: 
                    <input type="text" name="Answer" onChange={(e) => updateFieldChanged("correctAns", e.target.value, i)} placeholder ={questions[i] ? questions[i]["correctAns"] : ''} />
                </label>
                <br/>
            </div>
            );
        }
        setCount(count+1);
        setQuestionList(temp); 
    }
    const removeQuestions = (e) =>{
        e.preventDefault();
        let temp  = [];
        for(let i = 0; i < count-1; i++) {
            temp[i] = (
                <div className = 'question-card'>

                <label class="editQuizLabel">
                    Question: 
                    <input type="text" name="Question" onChange={(e) => updateFieldChanged("question", e.target.value, i)} placeholder ={questions[i] ? questions[i]["question"] : ''}/>
                </label>
                <br/>
                <label class="editQuizLabel">
                    A: 
                    <input type="text" name="A" onChange={(e) => updateFieldChanged("A", e.target.value, i)} placeholder ={questions[i] ? questions[i]["A"] : ''} />
                </label>
                <br/>
                <label class="editQuizLabel">
                    B: 
                    <input type="text" name="B" onChange={(e) => updateFieldChanged("B", e.target.value, i)} placeholder ={questions[i] ? questions[i]["B"] : ''} />
                </label>
                <br/>
                <label class="editQuizLabel">
                    C: 
                    <input type="text" name="C" onChange={(e) => updateFieldChanged("C", e.target.value, i)} placeholder ={questions[i] ? questions[i]["C"] : ''} />
                </label>
                <br/>
                <label class="editQuizLabel">
                    D: 
                    <input type="text" name="D" onChange={(e) => updateFieldChanged("D", e.target.value, i)} placeholder ={questions[i] ? questions[i]["D"] : ''} />
                </label>
                <br/>
                <br/>
                <label class="editQuizLabel">
                    Answer: 
                    <input type="text" name="Answer" onChange={(e) => updateFieldChanged("correctAns", e.target.value, i)} placeholder ={questions[i] ? questions[i]["correctAns"] : ''} />
                </label>
                <br/>
            </div>
            );
        }
        if(count > 0) {
            setCount(count-1);
        }
        setQuestionList(temp); 
    }
    const onSubmitValue= async (e)=>{
        e.preventDefault();
        let theUser = await axios.get('/users/profile'); 
        let i = 0;
        let input = answer.map(question =>     {          
                if(questions[i] != undefined) {
                    return({
                        "question": question["question"] == undefined || question["question"] == '' ? questions[i]["question"] : question["question"],
                        "A": question["A"] == undefined || question["A"] == '' ? questions[i]["A"] : question["A"],
                        "B": question["B"] == undefined || question["B"] == '' ? questions[i]["B"] : question["B"],
                        "C": question["C"] == undefined || question["C"] == '' ? questions[i]["C"] : question["C"],
                        "D": question["D"] == undefined || question["D"] == '' ? questions[i]["D"] : question["D"],
                        "correctAns": question["correctAns"] == undefined || question["correctAns"] == '' ? questions[i++]["correctAns"] : question["correctAns"]
                    });
                } else {
                    return({
                    "question": question["question"],
                    "A": question["A"],
                    "B": question["B"],
                    "C": question["C"],
                    "D": question["D"],
                    "correctAns": question["correctAns"]
                    });
                }
            });
        await axios.post('/classes/edit',{name: name, id: props.match.params.id, user: theUser.data.data._id, category: category, description: description, questions: input});
        setFinished(true);
    }
    if(finished) {
        return(<Redirect to="/dashboard" />);
    }

    return(
        <div className="new-quiz">
            <form className='new-quiz-form'>
                <h1>Create Your Quiz</h1>
                <label class="editQuizLabel">
                    name: 
                    <input type="text" name="name" placeholder={namei} onChange={(e) => setName(e.target.value)}/>
                </label>
                <br/>
                <label class="editQuizLabel">
                    category:  
                    <input type="text" name="category"  placeholder={categoryi} onChange={(e) => setCategory(e.target.value)}/>
                </label>
                <br/>
                <label class="editQuizLabel">
                    description:  
                    <input type="text" name="description" placeholder={descriptioni} onChange={(e) => setDescription(e.target.value)}/>
                </label>
                <br/>
                {questionList}
                <br/>
                <button className="submit-button" onClick={removeQuestions}>
                    Remove Question
                </button>
                <button className="submit-button" onClick={addQuestions}>
                    Add Question
                </button>
                <br/>    
                <br/>
                <button className="submit-button" type="submit" onClick={onSubmitValue}>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default NewQuiz;
