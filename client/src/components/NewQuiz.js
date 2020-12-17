import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';

const NewQuiz = (props) => {
    const [questionList, setQuestionList] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const[count, setCount] = useState(0);
    const [answer, setAnswer] = useState([]);
    const [finished, setFinished] = useState(false);
    const [questionImages, setQuestionImages] = useState(new Map());
    const [authUser,setAuthUser] = useState(undefined);

    useEffect(()=>{
        async function getUser(){
            try{
                let apires = await axios.get('/users/profile');
                setAuthUser(apires.data.data);
            }catch(e){
                props.history.push('/404');
            }
        }
        getUser();

    },[])

    const updateFieldChanged = async (input, value, index) => {
        let newArr = answer;
        if(newArr[index] == undefined) {
            newArr[index] = {};
        }
        newArr[index][input] = value;
        setAnswer(newArr);
    };

    const updateImages = async (file, index) =>{
        let newQuestionImages = questionImages;
        newQuestionImages.set(index, file);
        setQuestionImages(newQuestionImages);
        updateFieldChanged("hasImage",true,index);
    }

    const addQuestions = (e) =>{
        e.preventDefault();
        let temp  = [];
        for(let i = 0; i < count+1; i++) {
            temp[i] = (
                <div className = 'question-card'>
                    <label>
                        Image:
                        <input type="file" name="file" onChange={(e)=>updateImages(e.target.files[0], i)}/>
                    </label>
                    <br/>
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
        setCount(count+1);
        setQuestionList(temp); 
    }
    const removeQuestions = (e) =>{
        e.preventDefault();
        let temp  = [];
        for(let i = 0; i < count-1; i++) {
            temp[i] = (
                <div className = 'question-card'>
                    <label>
                        Image:
                        <input type="file" name="file" onChange={(e)=>updateImages(e.target.files[0], i)}/>
                    </label>
                    <br/>
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
        if(count > 0) {
            setCount(count-1);
        }
        setQuestionList(temp); 
    }

    const sendImageIfItHave = async (id, image)=>{
        let formdata = new FormData();
        formdata.append("file",image)
        formdata.append("id",id)
        formdata.append("type","class")
        await axios.post("/image/upload",formdata)
    }

    const onSubmitValue= async (e)=>{
        e.preventDefault();
        let theUser = await axios.get('/users/profile');
        let newclass = await axios.post('/classes',{name: name, user: theUser.data.data._id, category: category, description: description, questions: answer});
        let questions = newclass.data.data.questions
        questions.map((question,index)=>{
            if(question.hasImage===true){
                sendImageIfItHave(question._id,questionImages.get(index))
            }
        })
        setFinished(true);
    }

    if(authUser&&!authUser.isteacher){
        return(
            <Redirect to='/404'/>
        )
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
