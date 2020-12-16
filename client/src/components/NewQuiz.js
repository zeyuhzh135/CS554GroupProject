import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';

const NewQuiz = () => {
    const [questionList, setQuestionList] = useState(undefined);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const[count, setCount] = useState(0);
    const [answer, setAnswer] = useState([]);
    const [finished, setFinished] = useState(false);

    const updateFieldChanged = async (input, value, index) => {
        let newArr = answer;
        if(newArr[index] == undefined) {
            newArr[index] = {};
        }
        newArr[index][input] = value;
        setAnswer(newArr);
    };

    const addQuestions = (e)=>{
        e.preventDefault();
        setCount(count+1);
        let temp  = [];
        for(let i = 0; i < count; i++) {
            temp[i] = (
                <div className = 'question-card'>
                    <label class="editQuizLabel">
                        Question: 
                        <input type="text" name="Question" onChange={(e) => updateFieldChanged("question", e.target.value, i)} />
                    </label>
                    <br/>
                    <label class="editQuizLabel">
                        A: 
                        <input type="text" name="A"  onChange={(e) => updateFieldChanged("A", e.target.value, i)}/>
                    </label>
                    <br/>
                    <label class="editQuizLabel">
                        B: 
                        <input type="text" name="B" onChange={(e) => updateFieldChanged("B", e.target.value, i)} />
                    </label>
                    <br/>
                    <label class="editQuizLabel">
                        C: 
                        <input type="text" name="C"  onChange={(e) => updateFieldChanged("C", e.target.value, i)}/>
                    </label>
                    <br/>
                    <label class="editQuizLabel">
                        D: 
                        <input type="text" name="D"  onChange={(e) => updateFieldChanged("D", e.target.value, i)}/>
                    </label>
                    <br/>
                    <br/>
                    <label class="editQuizLabel">
                        Answer: 
                        <input type="text" name="Answer"  onChange={(e) => updateFieldChanged("correctAns", e.target.value, i)}/>
                    </label>
                    <br/>
                </div>
            );
        }
        setQuestionList(temp); 
    }
    const onSubmitValue= async (e)=>{
        e.preventDefault();
        let theUser = await axios.get('/users/profile');
        await axios.post('/classes',{name: name, user: theUser.data.data._id, category: category, description: description, questions: answer});
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
                    <input type="text" name="name"  onChange={(e) => setName(e.target.value)}/>
                </label>
                <br/>
                <label class="editQuizLabel">
                    category:  
                    <input type="text" name="category" onChange={(e) => setCategory(e.target.value)}/>
                </label>
                <br/>
                <label class="editQuizLabel">
                    description:  
                    <input type="text" name="description" onChange={(e) => setDescription(e.target.value)}/>
                </label>
                <br/>
                {questionList}
                <br/>
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
